import { users } from "../data/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storeRefreshToken } from "../data/refreshTokens.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Genera tokens de acceso y renovación para un usuario
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, type: "refresh" },
    process.env.JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  storeRefreshToken(refreshToken, user.id, expiresAt);

  return { accessToken, refreshToken };
};

// Registro de usuario
export const registerUser = async (userData) => {
  const existingUser = users.find((u) => u.email === userData.email);
  if (existingUser) {
    throw new Error("El email ya está en uso");
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = { id: Date.now(), ...userData, password: hashedPassword };
  users.push(newUser);

  const { accessToken, refreshToken } = generateTokens(newUser);

  const { password: _, ...userWithoutPassword } = newUser;
  return {
    message: "Registro exitoso",
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

// Login de usuario
export const loginUser = async (email, password) => {
  const user = users.find((u) => u.email === email);

  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Credenciales inválidas");
  }

  // Generar tokens
  const { accessToken, refreshToken } = generateTokens(user);

  // Retornar usuario sin la contraseña y los tokens
  const { password: _, ...userWithoutPassword } = user;
  return {
    message: "Login exitoso",
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

// Renueva el token de acceso usando el refresh token
export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token requerido");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (decoded.type !== "refresh") {
      throw new Error("Token inválido");
    }

    const user = users.find((u) => u.id === decoded.id);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    return { accessToken };
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token expirado");
    }
    throw new Error("Refresh token inválido");
  }
};

// Cierra sesión del usuario y revoca el refresh token
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token requerido");
  }

  const { revokeRefreshToken } = await import("../data/refreshTokens.js");
  revokeRefreshToken(refreshToken);

  return { message: "Logout exitoso" };
};

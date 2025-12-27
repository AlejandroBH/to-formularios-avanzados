import * as userService from "../services/userService.js";

// Registro de usuario
export const registerUser = async (req, res) => {
  try {
    const data = req.body;
    const resp = await userService.registerUser(data);

    res.status(201).send(resp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const resp = await userService.loginUser(email, password);

    res.status(200).json(resp);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const resp = await userService.refreshAccessToken(refreshToken);

    res.status(200).json(resp);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Logout de usuario
export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const resp = await userService.logoutUser(refreshToken);

    res.status(200).json(resp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


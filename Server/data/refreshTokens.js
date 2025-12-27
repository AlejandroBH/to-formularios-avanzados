export const refreshTokens = new Map();

// Almacena un refresh token
export const storeRefreshToken = (token, userId, expiresAt) => {
  refreshTokens.set(token, {
    userId,
    expiresAt,
    createdAt: new Date(),
  });
};

// Valida y obtiene los datos del refresh token
export const validateRefreshToken = (token) => {
  const tokenData = refreshTokens.get(token);

  if (!tokenData) {
    return null;
  }

  if (new Date() > tokenData.expiresAt) {
    refreshTokens.delete(token);
    return null;
  }

  return tokenData;
};

// Revoca un refresh token
export const revokeRefreshToken = (token) => {
  refreshTokens.delete(token);
};

// Revoca todos los refresh tokens de un usuario
export const revokeAllUserTokens = (userId) => {
  for (const [token, data] of refreshTokens.entries()) {
    if (data.userId === userId) {
      refreshTokens.delete(token);
    }
  }
};

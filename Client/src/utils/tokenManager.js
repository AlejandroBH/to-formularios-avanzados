// Decodifica un token JWT sin verificación
export const decodeToken = (token) => {
    try {
        if (!token) return null;

        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = parts[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));

        return decoded;
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
};

// Verifica si el token ha expirado
export const isTokenExpired = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
};

// Verifica si el token necesita renovación (expira en menos de 5 minutos)
export const shouldRefreshToken = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const fiveMinutes = 5 * 60 * 1000;
    return decoded.exp * 1000 - Date.now() < fiveMinutes;
};

// Obtiene el tiempo hasta la expiración del token en milisegundos
export const getTimeUntilExpiration = (token) => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return 0;

    const timeRemaining = decoded.exp * 1000 - Date.now();
    return Math.max(0, timeRemaining);
};

const REMEMBER_ME_KEY = 'rememberMe';

// Establece la preferencia de "recordar sesión"
export const setRememberMe = (remember) => {
    localStorage.setItem(REMEMBER_ME_KEY, remember.toString());
};

// Obtiene la preferencia de "recordar sesión"
export const getRememberMe = () => {
    const value = localStorage.getItem(REMEMBER_ME_KEY);
    return value === 'true';
};

// Obtiene el storage apropiado según la preferencia
const getStorage = () => {
    return getRememberMe() ? localStorage : sessionStorage;
};

// Almacena los tokens en localStorage o sessionStorage según la preferencia
export const storeTokens = (accessToken, refreshToken, rememberMe = null) => {
    if (rememberMe !== null) {
        setRememberMe(rememberMe);
    }

    const storage = getStorage();
    storage.setItem('token', accessToken);
    storage.setItem('refreshToken', refreshToken);
};

// Obtiene los tokens almacenados desde localStorage o sessionStorage
export const getStoredTokens = () => {
    let accessToken = localStorage.getItem('token');
    let refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
        accessToken = sessionStorage.getItem('token');
        refreshToken = sessionStorage.getItem('refreshToken');
    }

    return {
        accessToken,
        refreshToken,
    };
};

// Elimina todos los tokens de ambos storages
export const clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
};

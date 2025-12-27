import { createContext, useContext, useReducer, useEffect } from 'react';
import { storeTokens, clearTokens, getStoredTokens } from '../utils/tokenManager';

const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  REFRESH_USER: 'REFRESH_USER',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.REFRESH_USER:
      return {
        ...state,
        user: action.payload.user,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const loadAuthData = () => {
      try {
        const { accessToken, refreshToken } = getStoredTokens();
        let userStr = localStorage.getItem('user');
        if (!userStr) {
          userStr = sessionStorage.getItem('user');
        }

        if (accessToken && refreshToken && userStr) {
          const user = JSON.parse(userStr);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: { user, token: accessToken, refreshToken },
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error al cargar datos de autenticación:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'logout-event') {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
        return;
      }

      if (e.key === 'token' && e.newValue) {
        const { accessToken, refreshToken } = getStoredTokens();
        let userStr = localStorage.getItem('user');
        if (!userStr) {
          userStr = sessionStorage.getItem('user');
        }

        if (accessToken && refreshToken && userStr) {
          try {
            const user = JSON.parse(userStr);
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: { user, token: accessToken, refreshToken },
            });
          } catch (error) {
            console.error('Error syncing login from another tab:', error);
          }
        }
      }

      if (e.key === 'token' && !e.newValue) {
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      });
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, []);

  const login = (user, accessToken, refreshToken, rememberMe = true) => {
    try {
      storeTokens(accessToken, refreshToken, rememberMe);

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token: accessToken, refreshToken },
      });

      return true;
    } catch (error) {
      console.error('Error en login:', error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Error al guardar la sesión',
      });
      return false;
    }
  };

  const logout = async () => {
    try {
      const { refreshToken } = getStoredTokens();

      if (refreshToken) {
        try {
          await fetch('http://localhost:3000/user/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
        } catch (error) {
          console.error('Error calling logout endpoint:', error);
        }
      }

      clearTokens();

      localStorage.setItem('logout-event', Date.now().toString());
      localStorage.removeItem('logout-event');

      dispatch({ type: AUTH_ACTIONS.LOGOUT });

      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      return false;
    }
  };

  const refreshUser = (updatedUser) => {
    try {
      const { accessToken } = getStoredTokens();
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(updatedUser));

      dispatch({
        type: AUTH_ACTIONS.REFRESH_USER,
        payload: { user: updatedUser },
      });

      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: 'Error al actualizar datos del usuario',
      });
      return false;
    }
  };

  const setLoading = (isLoading) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: isLoading });
  };

  const setError = (error) => {
    dispatch({ type: AUTH_ACTIONS.SET_ERROR, payload: error });
  };

  const value = {
    user: state.user,
    token: state.token,
    refreshToken: state.refreshToken,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    login,
    logout,
    refreshUser,
    setLoading,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

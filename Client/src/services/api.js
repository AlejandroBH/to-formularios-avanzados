import axios from "axios";
import { getStoredTokens, storeTokens, clearTokens } from "../utils/tokenManager";
import cacheService from "./cacheService";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

let isRefreshing = false;
let failedRequestsQueue = [];

// Procesa las solicitudes en cola después de la renovación del token
const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedRequestsQueue = [];
};

// Interceptor de solicitud para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const { accessToken } = getStoredTokens();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores y refresh automático
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { refreshToken } = getStoredTokens();

      if (!refreshToken) {
        throw new Error("No hay refresh token disponible");
      }

      const response = await axios.post(
        "http://localhost:3000/user/refresh",
        { refreshToken }
      );

      const { accessToken } = response.data;

      storeTokens(accessToken, refreshToken);

      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearTokens();

      window.dispatchEvent(new CustomEvent("session-expired"));

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// FUNCIONES DE API CON CACHE PARA PRODUCTOS

const CACHE_KEYS = {
  PRODUCTS: 'products_list',
};

// Obtener todos los productos (con cache)
export const getProducts = async () => {
  const cachedProducts = cacheService.get(CACHE_KEYS.PRODUCTS);

  if (cachedProducts) {
    return { data: cachedProducts, fromCache: true };
  }

  try {
    const response = await api.get("/products");

    cacheService.set(CACHE_KEYS.PRODUCTS, response.data);

    return { data: response.data, fromCache: false };
  } catch (error) {
    console.error("[API] Error al obtener productos:", error);
    throw error;
  }
};

// Crear un nuevo producto invalida el cache después de crear
export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);

    cacheService.invalidate(CACHE_KEYS.PRODUCTS);

    return response;
  } catch (error) {
    console.error("[API] Error al crear producto:", error);
    throw error;
  }
};

// Actualizar un producto existente invalida el cache después de actualizar
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);

    cacheService.invalidate(CACHE_KEYS.PRODUCTS);

    return response;
  } catch (error) {
    console.error("[API] Error al actualizar producto:", error);
    throw error;
  }
};

// Eliminar un producto invalida el cache después de eliminar
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`);

    cacheService.invalidate(CACHE_KEYS.PRODUCTS);

    return response;
  } catch (error) {
    console.error("[API] Error al eliminar producto:", error);
    throw error;
  }
};

// Obtener productos favoritos del usuario autenticado (con cache)
export const getFavoriteProducts = async () => {
  const { accessToken } = getStoredTokens();
  let userId = null;

  if (accessToken) {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      userId = payload.id;
    } catch (error) {
      console.error("[API] Error al decodificar token:", error);
    }
  }

  const FAVORITES_CACHE_KEY = `favorite_products_list_user_${userId}`;
  const cachedFavorites = cacheService.get(FAVORITES_CACHE_KEY);

  if (cachedFavorites) {
    return { data: cachedFavorites, fromCache: true };
  }

  try {
    const response = await api.get("/products/favorites");

    cacheService.set(FAVORITES_CACHE_KEY, response.data);

    return { data: response.data, fromCache: false };
  } catch (error) {
    console.error("[API] Error al obtener productos favoritos:", error);
    throw error;
  }
};

// Marcar/desmarcar producto como favorito
export const toggleFavorite = async (id) => {
  try {
    const response = await api.patch(`/products/${id}/favorite`);

    cacheService.invalidate(CACHE_KEYS.PRODUCTS);

    const { accessToken } = getStoredTokens();
    if (accessToken) {
      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        const userId = payload.id;
        cacheService.invalidate(`favorite_products_list_user_${userId}`);
      } catch (error) {
        console.error("[API] Error al invalidar cache de favoritos:", error);
      }
    }

    return response;
  } catch (error) {
    console.error("[API] Error al cambiar favorito:", error);
    throw error;
  }
};

export default api;

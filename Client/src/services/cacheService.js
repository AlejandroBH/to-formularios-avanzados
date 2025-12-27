//Sistema de Cache con memoria y localStorage

class CacheService {
  constructor() {
    this.memoryCache = new Map();

    this.defaultTTL = 5 * 60 * 1000;

    this.storagePrefix = 'cache_';
  }

  get(key) {
    // 1. Intentar obtener de memoria primero
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);

      if (this._isValid(cached)) {
        return cached.data;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // 2. Intentar obtener de localStorage
    try {
      const storageKey = this.storagePrefix + key;
      const cached = localStorage.getItem(storageKey);

      if (cached) {
        const parsed = JSON.parse(cached);

        if (this._isValid(parsed)) {
          // Restaurar en memoria para próximas consultas
          this.memoryCache.set(key, parsed);
          return parsed.data;
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error(`[Cache] ❌ Error al leer localStorage:`, error);
    }

    return null;
  }

  // Guardar datos en el cache
  set(key, data, ttl = this.defaultTTL) {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
      ttl
    };

    // Guardar en memoria
    this.memoryCache.set(key, cacheEntry);

    // Guardar en localStorage
    try {
      const storageKey = this.storagePrefix + key;
      localStorage.setItem(storageKey, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error(`[Cache] ❌ Error al guardar en localStorage:`, error);

      // Si localStorage está lleno, intentar limpiar cache antiguo
      if (error.name === 'QuotaExceededError') {
        this._cleanExpiredFromStorage();
        try {
          const storageKey = this.storagePrefix + key;
          localStorage.setItem(storageKey, JSON.stringify(cacheEntry));
        } catch (retryError) {
          console.error(`[Cache] ❌ No se pudo guardar después de limpiar:`, retryError);
        }
      }
    }
  }

  // Invalidar una entrada específica del cache
  invalidate(key) {
    // Eliminar de memoria
    if (this.memoryCache.has(key)) {
      this.memoryCache.delete(key);
    }

    // Eliminar de localStorage
    try {
      const storageKey = this.storagePrefix + key;
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error(`[Cache] ❌ Error al invalidar localStorage:`, error);
    }
  }

  // Limpiar todo el cache
  clear() {
    // Limpiar memoria
    this.memoryCache.clear();

    // Limpiar localStorage
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error(`[Cache] ❌ Error al limpiar localStorage:`, error);
    }
  }

  // Verificar si una entrada de cache es válida
  isValid(key) {
    // Verificar en memoria
    if (this.memoryCache.has(key)) {
      const cached = this.memoryCache.get(key);
      return this._isValid(cached);
    }

    // Verificar en localStorage
    try {
      const storageKey = this.storagePrefix + key;
      const cached = localStorage.getItem(storageKey);

      if (cached) {
        const parsed = JSON.parse(cached);
        return this._isValid(parsed);
      }
    } catch (error) {
      console.error(`[Cache] ❌ Error al verificar localStorage:`, error);
    }

    return false;
  }

  // Verificar si una entrada de cache es válida (método privado)
  _isValid(cacheEntry) {
    if (!cacheEntry || !cacheEntry.timestamp) {
      return false;
    }

    const age = Date.now() - cacheEntry.timestamp;
    return age < cacheEntry.ttl;
  }

  // Limpiar entradas expiradas de localStorage
  _cleanExpiredFromStorage() {
    try {
      const keysToRemove = [];

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          const cached = localStorage.getItem(key);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (!this._isValid(parsed)) {
                keysToRemove.push(key);
              }
            } catch (e) {
              // Si no se puede parsear, eliminar
              keysToRemove.push(key);
            }
          }
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error(`[Cache] ❌ Error al limpiar entradas expiradas:`, error);
    }
  }

  // Obtener estadísticas del cache
  getStats() {
    let localStorageCount = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storagePrefix)) {
          localStorageCount++;
        }
      }
    } catch (error) {
      console.error(`[Cache] ❌ Error al obtener estadísticas:`, error);
    }

    return {
      memoryEntries: this.memoryCache.size,
      localStorageEntries: localStorageCount,
      defaultTTL: this.defaultTTL
    };
  }
}

// Exportar instancia única (singleton)
const cacheService = new CacheService();
export default cacheService;

import imageCompression from 'browser-image-compression';

// Comprime una imagen antes de subirla al servidor
export const compressImage = async (imageFile, options = {}) => {
    const defaultOptions = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: imageFile.type,
        initialQuality: 0.8,
    };

    const compressionOptions = { ...defaultOptions, ...options };

    try {
        console.log('Tamaño original:', (imageFile.size / 1024 / 1024).toFixed(2), 'MB');

        const compressedFile = await imageCompression(imageFile, compressionOptions);

        console.log('Tamaño comprimido:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('Reducción:', ((1 - compressedFile.size / imageFile.size) * 100).toFixed(2), '%');

        return compressedFile;
    } catch (error) {
        console.error('Error al comprimir la imagen:', error);
        return imageFile;
    }
};

// Obtiene información sobre el archivo de imagen
export const getImageInfo = (imageFile) => {
    return {
        name: imageFile.name,
        size: imageFile.size,
        sizeInMB: (imageFile.size / 1024 / 1024).toFixed(2),
        type: imageFile.type,
    };
};

// Valida si un archivo es una imagen válida
export const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!file) {
        return { isValid: false, error: 'No se seleccionó ningún archivo' };
    }

    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)'
        };
    }

    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'La imagen no puede superar los 5MB'
        };
    }

    return { isValid: true, error: '' };
};

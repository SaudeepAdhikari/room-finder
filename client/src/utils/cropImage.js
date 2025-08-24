// Utility to crop an image using canvas for react-easy-crop
// src: image url, croppedAreaPixels: {x, y, width, height}
export default function getCroppedImg(src, croppedAreaPixels) {
    return new Promise((resolve, reject) => {
        const image = new window.Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                resolve(blob);
            }, 'image/jpeg', 0.95);
        };
        image.onerror = () => reject(new Error('Failed to load image'));
        image.src = src;
    });
} 
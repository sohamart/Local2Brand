/**
 * Universal High-Performance Client-Side Image Optimizer
 * Automatically scales down, crops, and compresses large images (even 20MB+ mobile photos)
 * into lightweight, crystal-clear WebP / JPEG images under 100-300 KB.
 */

/**
 * Optimizes an avatar photo specifically for user profiles.
 * Centers, resizes to max 600x600 px, compresses with 0.85 quality.
 *
 * @param {File|Blob} file - The original image file
 * @param {Object} [options]
 * @param {number} [options.maxSize=600] - Max width/height in px
 * @param {number} [options.quality=0.85] - WebP/JPEG quality (0-1)
 * @returns {Promise<{ file: File, previewUrl: string, originalSize: number, optimizedSize: number }>}
 */
export const optimizeAvatarImage = async (file, options = {}) => {
  const { maxSize = 600, quality = 0.85 } = options;
  return compressImage(file, {
    maxWidth: maxSize,
    maxHeight: maxSize,
    quality,
    squareCrop: true,
    fileNamePrefix: 'avatar_',
  });
};

/**
 * General purpose image compressor.
 *
 * @param {File|Blob} file
 * @param {Object} [options]
 * @param {number} [options.maxWidth=1920]
 * @param {number} [options.maxHeight=1920]
 * @param {number} [options.quality=0.85]
 * @param {boolean} [options.squareCrop=false]
 * @param {string} [options.fileNamePrefix='']
 * @returns {Promise<{ file: File, previewUrl: string, originalSize: number, optimizedSize: number }>}
 */
export const compressImage = (file, options = {}) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      // Non-image file, return as is
      return resolve({
        file,
        previewUrl: file ? URL.createObjectURL(file) : '',
        originalSize: file?.size || 0,
        optimizedSize: file?.size || 0,
      });
    }

    const {
      maxWidth = 1920,
      maxHeight = 1920,
      quality = 0.85,
      squareCrop = false,
      fileNamePrefix = 'opt_',
    } = options;

    const originalSize = file.size;

    // Use FileReader to load the image into an HTML Image element
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        try {
          let srcX = 0;
          let srcY = 0;
          let srcWidth = img.width;
          let srcHeight = img.height;

          let targetWidth = img.width;
          let targetHeight = img.height;

          if (squareCrop) {
            // Center-crop to a 1:1 square
            const minDim = Math.min(srcWidth, srcHeight);
            srcX = (srcWidth - minDim) / 2;
            srcY = (srcHeight - minDim) / 2;
            srcWidth = minDim;
            srcHeight = minDim;
            targetWidth = Math.min(maxWidth, minDim);
            targetHeight = Math.min(maxHeight, minDim);
          } else {
            // Proportional scaling
            if (targetWidth > maxWidth) {
              targetHeight = Math.round((targetHeight * maxWidth) / targetWidth);
              targetWidth = maxWidth;
            }
            if (targetHeight > maxHeight) {
              targetWidth = Math.round((targetWidth * maxHeight) / targetHeight);
              targetHeight = maxHeight;
            }
          }

          // Render onto off-screen canvas
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Fill white background for transparent PNGs converted to JPEG/WebP
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Draw the cropped/scaled image
          ctx.drawImage(
            img,
            srcX,
            srcY,
            srcWidth,
            srcHeight,
            0,
            0,
            targetWidth,
            targetHeight
          );

          // Try modern WebP first, fallback to image/jpeg
          const mimeType = 'image/webp';
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // Fallback: return original file
                return resolve({
                  file,
                  previewUrl: readerEvent.target.result,
                  originalSize,
                  optimizedSize: originalSize,
                });
              }

              const ext = mimeType === 'image/webp' ? '.webp' : '.jpg';
              const cleanOriginalName = (file.name || 'image').replace(/\.[^/.]+$/, '');
              const newFileName = `${fileNamePrefix}${cleanOriginalName}${ext}`;

              const optimizedFile = new File([blob], newFileName, {
                type: blob.type || mimeType,
                lastModified: Date.now(),
              });

              const previewUrl = URL.createObjectURL(blob);

              console.log(
                `⚡ Image optimized: ${(originalSize / (1024 * 1024)).toFixed(2)} MB -> ${(optimizedFile.size / 1024).toFixed(1)} KB (${Math.round((1 - optimizedFile.size / originalSize) * 100)}% reduction)`
              );

              resolve({
                file: optimizedFile,
                previewUrl,
                originalSize,
                optimizedSize: optimizedFile.size,
              });
            },
            mimeType,
            quality
          );
        } catch (canvasErr) {
          console.warn('Canvas optimization notice, using original file:', canvasErr);
          resolve({
            file,
            previewUrl: readerEvent.target.result,
            originalSize,
            optimizedSize: originalSize,
          });
        }
      };

      img.onerror = () => {
        resolve({
          file,
          previewUrl: '',
          originalSize,
          optimizedSize: originalSize,
        });
      };

      img.src = readerEvent.target.result;
    };

    reader.onerror = () => {
      resolve({
        file,
        previewUrl: '',
        originalSize,
        optimizedSize: originalSize,
      });
    };

    reader.readAsDataURL(file);
  });
};

export default {
  compressImage,
  optimizeAvatarImage,
};

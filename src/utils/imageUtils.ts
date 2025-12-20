/**
 * Image Cropping and Compression Utilities
 *
 * Canvas-based image manipulation for the ImageCropModal.
 * Handles cropping, resizing, and compression before upload.
 */

export interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ImageProcessingOptions {
  /** Maximum output width (default: 1920 for cover, 1280 for screenshots) */
  maxWidth?: number;
  /** Maximum output height (default: 1080 for cover, 720 for screenshots) */
  maxHeight?: number;
  /** Output quality 0-1, only for JPEG/WebP (default: 0.85) */
  quality?: number;
  /** Output format (default: image/jpeg) */
  format?: "image/jpeg" | "image/png" | "image/webp";
}

/**
 * Create an HTMLImageElement from a URL or data URL
 */
export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // Image is a browser global (HTMLImageElement constructor)
    // eslint-disable-next-line no-undef
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () =>
      reject(new Error("Failed to load image")),
    );
    // Required for CORS when loading external images
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

/**
 * Read a File as a data URL
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as data URL"));
      }
    });
    reader.addEventListener("error", () =>
      reject(new Error("Failed to read file")),
    );
    reader.readAsDataURL(file);
  });
}

/**
 * Generate a cropped and optionally resized image Blob from source image
 *
 * @param imageSrc - Source image URL or data URL
 * @param croppedAreaPixels - The crop area in pixels from react-easy-crop
 * @param options - Processing options (max dimensions, quality, format)
 * @returns Cropped image as Blob
 */
export async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: CroppedAreaPixels,
  options: ImageProcessingOptions = {},
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    format = "image/jpeg",
  } = options;

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas 2d context");
  }

  // Calculate output dimensions (respect max while maintaining aspect ratio)
  let outputWidth = croppedAreaPixels.width;
  let outputHeight = croppedAreaPixels.height;

  // Scale down if exceeds max dimensions
  if (outputWidth > maxWidth) {
    const ratio = maxWidth / outputWidth;
    outputWidth = maxWidth;
    outputHeight = Math.round(outputHeight * ratio);
  }
  if (outputHeight > maxHeight) {
    const ratio = maxHeight / outputHeight;
    outputHeight = maxHeight;
    outputWidth = Math.round(outputWidth * ratio);
  }

  // Set canvas size to output dimensions
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  // Draw the cropped area scaled to output dimensions
  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    outputWidth,
    outputHeight,
  );

  // Convert canvas to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas toBlob returned null"));
        }
      },
      format,
      quality,
    );
  });
}

/**
 * Convert a Blob to a File object
 *
 * @param blob - The blob to convert
 * @param fileName - Original file name (will have extension updated)
 * @param mimeType - Optional mime type override
 */
export function blobToFile(
  blob: Blob,
  fileName: string,
  mimeType?: string,
): File {
  // Update extension based on actual mime type
  const type = mimeType || blob.type;
  const extension = type.split("/")[1] || "jpg";
  const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
  const newFileName = `${nameWithoutExt}.${extension}`;

  return new File([blob], newFileName, { type });
}

/**
 * Get preset options for different image types
 */
export function getImageProcessingOptions(
  imageType: "cover" | "screenshot",
): ImageProcessingOptions {
  if (imageType === "cover") {
    return {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      format: "image/jpeg",
    };
  }
  // Screenshots can be smaller
  return {
    maxWidth: 1280,
    maxHeight: 720,
    quality: 0.85,
    format: "image/jpeg",
  };
}

/**
 * Validate file before processing
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Please select an image file" };
  }
  // 5MB limit before cropping (cropping will compress further)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "Image must be smaller than 5MB" };
  }
  return { valid: true };
}

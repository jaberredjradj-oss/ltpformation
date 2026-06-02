export const FORMATION_IMAGES_BUCKET = "ltp-formation-images";

export const MAX_COVER_IMAGE_BYTES = 3 * 1024 * 1024; // 3 Mo

export const MAX_COVER_IMAGE_ERROR =
  "L'image dépasse la taille maximale autorisée (3 Mo).";

export const ALLOWED_COVER_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_COVER_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

export const COVER_ACCEPT_ATTR =
  ".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp";

export const COVER_FORMATS_ERROR = "Format non supporté (JPEG, PNG ou WebP uniquement).";

/** Maps an accepted mime type to the file extension used in storage. */
export const COVER_MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

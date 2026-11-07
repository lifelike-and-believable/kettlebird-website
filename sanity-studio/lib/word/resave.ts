// Re-saving a picture in the browser before it's uploaded: through a canvas, at most 3200 pixels wide, which drops
// what the file carries about where it was taken (docs/specs/story-import-word.md AC-12). Browser only.
import { resaveSize, resaveType } from './pictures';

export async function resavePicture(data: Uint8Array, type: string): Promise<Blob> {
  const bitmap = await createImageBitmap(new Blob([data as Uint8Array<ArrayBuffer>], { type }));
  const size = resaveSize(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No canvas');
  context.drawImage(bitmap, 0, 0, size.width, size.height);
  bitmap.close();
  const out = resaveType(type);
  return new Promise((resolve, reject) => canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Not saved'))), out, 0.9));
}

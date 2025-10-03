
/**
 * Converts a File object to a base64 encoded string.
 * @param file The image file to convert.
 * @returns A promise that resolves to an object containing the base64 data and the mime type.
 */
export const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // result is in the format "data:image/jpeg;base64,LzlqLzRBQ...""
      // We need to extract the base64 part
      const base64Data = result.split(',')[1];
      if (base64Data) {
        resolve({ base64Data, mimeType: file.type });
      } else {
        reject(new Error("Failed to read base64 data from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

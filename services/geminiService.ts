
import { GoogleGenAI, Modality, Part } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Edits an image using a text prompt with the "Nano Banana" model.
 * @param base64ImageData The base64 encoded string of the image.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg').
 * @param prompt The text prompt describing the desired edit.
 * @returns A promise that resolves to the base64 encoded string of the generated image.
 */
export const editImageWithNanoBanana = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  try {
    const imagePart: Part = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };

    const textPart: Part = {
      text: prompt,
    };

    // FIX: Use the recommended `ai.models.generateContent` method instead of the deprecated `getGenerativeModel`.
    // The model name is now passed directly in the `generateContent` call. The structure of `contents` and response handling have also been corrected.
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    
    // The model can return multiple parts, we need to find the image part.
    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData
    );

    if (imagePartFromResponse && imagePartFromResponse.inlineData) {
      return imagePartFromResponse.inlineData.data;
    } else if(response.text) {
        // If the model returns text, it's usually an error or refusal.
        throw new Error(`سرویس به جای تصویر، متن بازگرداند: ${response.text}`);
    }

    return null;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("خطا در ارتباط با سرویس هوش مصنوعی. لطفاً دوباره تلاش کنید.");
  }
};

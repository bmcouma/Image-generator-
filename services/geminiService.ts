import { GoogleGenAI } from "@google/genai";
import { ImageAsset, AspectRatio } from "../types";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is not set in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Generates or edits an image using Gemini 2.5 Flash Image.
 * 
 * @param prompt The text description of the image or edit.
 * @param inputImage Optional base64 image data for editing.
 * @param aspectRatio Optional aspect ratio for the output image.
 * @returns The generated image as a data URL string.
 */
export const generateOrEditImage = async (
  prompt: string,
  inputImage?: ImageAsset,
  aspectRatio: AspectRatio = '1:1'
): Promise<string> => {
  try {
    const parts: any[] = [];

    // If we have an input image, add it to the parts (Edit Mode)
    if (inputImage) {
      parts.push({
        inlineData: {
          data: inputImage.data,
          mimeType: inputImage.mimeType,
        },
      });
    }

    // Add the text prompt
    parts.push({
      text: prompt,
    });

    // Use the specific model 'gemini-2.5-flash-image'
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        // Image generation config
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    // Parse response to find the image part
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const content = candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};
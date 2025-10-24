import { GoogleGenAI } from "@google/genai";
import { ThumbnailStyle } from '../StyleSelector';

const styleInstructions: Record<ThumbnailStyle, string> = {
  MrBeast: `
    - **Overall Vibe:** High-energy, exciting, and impossible to ignore. A "larger than life" feel.
    - **Composition:** A central, expressive human subject, often with a shocked, amazed, or joyful face. Action-oriented.
    - **Color & Lighting:** Extremely vibrant, saturated colors. High contrast. Cinematic, bright lighting with a glow effect on the subject to make them pop.
    - **Text Style:** Massive, bold, 3D-extruded font (e.g., Bebas Neue, Impact). Text MUST have a thick, contrasting outline (e.g., white or black), an inner glow, and a heavy, deep drop shadow to create a strong 3D effect. The letters can have a subtle color gradient. 2-4 word MAX. Example: "I DID IT!" or "CRAZY EXPENSIVE".
  `,
  Minimalist: `
    - **Overall Vibe:** Clean, elegant, modern, and professional. Focus on clarity and simplicity.
    - **Composition:** Lots of negative space. A single, well-lit object or a person with a neutral or thoughtful expression. Uncluttered background, often a simple gradient or solid color.
    - **Color & Lighting:** A limited, sophisticated color palette (2-3 colors). Often monochromatic with one accent color. Soft, studio-like lighting. No harsh shadows.
    - **Text Style:** The text is a primary design element. It must be perfectly kerned and aligned, often using a premium sans-serif font like 'Montserrat' or 'Gilroy'. No outlines or heavy shadows; focus on sharp, clean letterforms. The text should have ample breathing room. Can be title-cased. Example: "The Future of Laptops" or "My Simple Desk Setup".
  `,
  Vlog: `
    - **Overall Vibe:** Authentic, personal, and "in-the-moment". Feels like a snapshot from a real-life experience.
    - **Composition:** Often a first-person perspective or a candid shot of the creator in a real-world environment. Can be slightly imperfect to feel more genuine.
    - **Color & Lighting:** Natural, realistic lighting that matches the environment (e.g., sunny outdoors, cozy indoor). Colors are true-to-life, maybe slightly enhanced.
    - **Text Style:** Looks like an authentic, friendly subtitle. It should be perfectly readable, often achieved with white text having a very subtle, soft drop shadow or placed on a semi-transparent black bar at the bottom of the thumbnail. Can use a friendly, slightly rounded sans-serif or even a clean handwritten font. Example: "a new chapter begins" or "the best coffee in New York".
  `,
  Documentary: `
    - **Overall Vibe:** Cinematic, serious, and high-quality. Evokes curiosity and tells a deeper story.
    - **Composition:** Follows cinematic principles like the rule of thirds. Can feature dramatic landscapes, detailed close-ups, or powerful portraits.
    - **Color & Lighting:** Moody, atmospheric lighting. Often uses color grading to set a tone (e.g., cool blues for a tech doc, warm tones for a historical one). High dynamic range.
    - **Text Style:** Text must look like a professional film title. Use elegant serif (like 'Garamond') or clean sans-serif fonts ('Proxima Nova'). The text should have a subtle cinematic effect, like a faint outer glow or a very soft, diffused drop shadow to lift it from the background without being distracting. Placement is critical, usually in the lower third. Example: "The Rise of an Empire" or "Secrets of the Deep".
  `,
};


export const generateThumbnail = async (topic: string, style: ThumbnailStyle): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set. Please select an API key.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Step 1: Generate a detailed, descriptive prompt for the image generator.
    const conceptPrompt = `
      You are an expert YouTube thumbnail designer AI. Your task is to generate a single, detailed, and effective prompt for an AI image generator to create a thumbnail for the topic: "${topic}".

      The final image must be clean, professional, high-contrast, and look like a real, high-resolution photo, optimized for a 1280x720 YouTube thumbnail format. The prompt should result in a thumbnail that tells a clear story at a glance and looks instantly recognizable as a professional, top-tier YouTube thumbnail.

      A critical part of this thumbnail is the TEXT. The text must be visually dominant, extremely easy to read at a small size, and styled professionally according to the chosen style. Ensure your prompt describes the font, color, outlines, shadows, and placement in great detail.

      You MUST strictly adhere to the specific style guidelines for the **'${style}'** style provided below:
      
      --- STYLE GUIDELINES for '${style}' ---
      ${styleInstructions[style]}
      --- END OF STYLE GUIDELINES ---

      Based on a final image generator prompt now.
    `;
    
    const conceptModel = 'gemini-2.5-pro';
    const conceptResponse = await ai.models.generateContent({
      model: conceptModel,
      contents: conceptPrompt,
    });

    const imagePrompt = conceptResponse.text.trim();

    // Step 2: Use the generated prompt to create the image with Imagen.
    const imageModel = 'imagen-4.0-generate-001';
    const imageResponse = await ai.models.generateImages({
        model: imageModel,
        prompt: imagePrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
      throw new Error("Image generation failed or returned no images.");
    }

    const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
    if (!base64ImageBytes) {
      throw new Error("Generated image data is empty.");
    }
    
    return `data:image/jpeg;base64,${base64ImageBytes}`;

  } catch (error) {
    console.error("Error generating thumbnail:", error);
    if (error instanceof Error) {
        throw error; // Re-throw the original error to be handled by the UI
    }
    throw new Error("An unknown error occurred during thumbnail generation.");
  }
};

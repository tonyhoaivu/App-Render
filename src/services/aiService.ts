import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
};

export interface CharacterProfile {
  name: string;
  age: string;
  gender: string;
  faceDescription: string;
  hairStyle: string;
  mainOutfit: string;
  skinTone: string;
  cinematicStyle: string;
  personality: string;
  seed: string;
}

export interface Scene {
  number: number;
  timestamp: string;
  description: string;
  dialogue: string;
  action: string;
  camera: string;
  emotion: string;
  lighting: string;
  prompt: string;
  imagePrompt: string;
  visualDetails: string;
}

export interface AnalysisResult {
  character: CharacterProfile;
  scenes: Scene[];
  marketing: {
    suggestedTitle: string;
    hashtags: string[];
    similarContentIdeas: string[];
  };
  viralScripts: {
    hook: string;
    body: string;
    callToAction: string;
    visualHook: string;
    alternativeViralPrompt: string;
  }[];
}

export const analyzeVideo = async (
  frames: { data: string, mimeType: string }[],
  characterProfile?: CharacterProfile
): Promise<AnalysisResult> => {
  const ai = getAI();
  const model = "gemini-3-flash-preview"; 

  const systemInstruction = `
    You are a Senior AI Video Director, Content Strategist, and Viral Growth Expert. 
    Your task is to analyze the provided sequence of frames from a video and:
    1. Extract a Master Character Profile if not provided.
    2. Split the video into 6-second scenes based on the visual progression in the frames. 
    3. For each scene, generate a "Grok Video Prompt" and a "Static Image Prompt".
    
    PROMPT LANGUAGE RULES:
    - Descriptions, Visual Details, Actions, and Camera settings MUST be in ENGLISH.
    - Dialogue (Speech to Text) MUST be in standard VIETNAMESE.
    - IMPORTANT: In the Grok Video Prompt, explicitly include an instruction for the AI to render the Vietnamese dialogue using standard Vietnamese fonts (e.g., "Render the following Vietnamese dialogue using standard Vietnamese fonts: '...'").
    
    GOLD STANDARD FOR PROMPT STRUCTURE (English descriptions + Vietnamese dialogue):
    - Character position & Environment (English).
    - Visual details: lighting, textures, colors (English).
    - Actions: gestures, expressions (English).
    - Dialogue: Standard Vietnamese dialogue wrapped in quotes with font instruction.
    
    Example of the quality expected for Video Prompt:
    "The character 'Bánh Chưng Nhí' stands in the center of the frame, with a warm family gathering background during Tet holiday. Warm golden lighting from lanterns, sharp textures of the green 'lá dong' leaves, bright white rice grains, and soft pink peach blossoms in the background. Bánh Chưng Nhí waves at the camera, mouth moving naturally as if speaking, pointing at a blackboard. Render the following Vietnamese dialogue using standard Vietnamese fonts: 'Tớ là bánh chưng đây, Tết đến là nhà nào cũng có tớ trong nhà, tớ gói ghém hạt gạo thơm, đậu xanh bùi, thịt mỡ béo.'"

    4. Provide 3 "Viral Script Variations" with Hooks, Body, CTA, and Visual Hooks (Vietnamese).
    5. Provide marketing suggestions: title, hashtags, and similar ideas (Vietnamese).
    6. Ensure character consistency across all scenes.
    
    The output MUST be a valid JSON object matching the requested schema.
  `;

  const prompt = `
    Analyze these video frames in depth for viral potential. 
    ${characterProfile ? `Use this FIXED character profile for consistency: ${JSON.stringify(characterProfile)}` : "Identify the main character and create a Master Character Profile."}
    
    Based on these frames, divide the content into 6-second segments.
    For each segment, provide:
    - A "Grok Video Prompt" in ENGLISH (except for the dialogue).
    - The dialogue MUST be in VIETNAMESE.
    - Include the instruction: "Render the following Vietnamese dialogue using standard Vietnamese fonts: '...'" inside the prompt.
    - A "Static Image Prompt" in ENGLISH.

    Prompt structure: Position (English), Visual Details (English), Action (English), Vietnamese Dialogue with font instruction.

    Also, generate 3 "Viral Script Variations" (Kịch bản Viral) in Vietnamese:
    - Hook (Câu mở đầu thu hút)
    - Body (Nội dung chính)
    - Call to Action (Kêu gọi hành động)
    - Visual Hook (Mô tả hình ảnh gây ấn tượng mạnh)
    - Alternative Viral Prompt (Một prompt khác tối ưu hơn cho sự lan truyền)

    Marketing:
    - Viral title in Vietnamese.
    - 10 trending hashtags.
    - 3 follow-up content ideas.
  `;

  const imageParts = frames.map(frame => ({
    inlineData: {
      mimeType: frame.mimeType,
      data: frame.data,
    },
  }));

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          { text: prompt },
          ...imageParts
        ],
      },
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          character: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              age: { type: Type.STRING },
              gender: { type: Type.STRING },
              faceDescription: { type: Type.STRING },
              hairStyle: { type: Type.STRING },
              mainOutfit: { type: Type.STRING },
              skinTone: { type: Type.STRING },
              cinematicStyle: { type: Type.STRING },
              personality: { type: Type.STRING },
              seed: { type: Type.STRING }
            },
            required: ["name", "age", "gender", "faceDescription", "seed"]
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.NUMBER },
                timestamp: { type: Type.STRING },
                description: { type: Type.STRING },
                visualDetails: { type: Type.STRING },
                dialogue: { type: Type.STRING },
                action: { type: Type.STRING },
                camera: { type: Type.STRING },
                emotion: { type: Type.STRING },
                lighting: { type: Type.STRING },
                prompt: { type: Type.STRING },
                imagePrompt: { type: Type.STRING }
              },
              required: ["number", "timestamp", "description", "prompt", "imagePrompt", "visualDetails"]
            }
          },
          marketing: {
            type: Type.OBJECT,
            properties: {
              suggestedTitle: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              similarContentIdeas: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["suggestedTitle", "hashtags", "similarContentIdeas"]
          },
          viralScripts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                body: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                visualHook: { type: Type.STRING },
                alternativeViralPrompt: { type: Type.STRING }
              },
              required: ["hook", "body", "callToAction", "visualHook", "alternativeViralPrompt"]
            }
          }
        },
        required: ["character", "scenes", "marketing", "viralScripts"]
      }
    },
  });

  const result = JSON.parse(response.text || "{}");
  return result;
};

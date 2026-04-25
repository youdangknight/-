import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateScript(gratitudes: string[], character: any, futureGoals: string) {
  const prompt = `
    You are an expert anime director and scriptwriter, specializing in Studio Ghibli style healing vlogs.
    The user is a busy worker who wrote 3 things they are grateful for today:
    1. ${gratitudes[0]}
    2. ${gratitudes[1]}
    3. ${gratitudes[2]}

    Their future manifestation goal is: ${futureGoals}
    Their character profile: Gender: ${character.gender}, Hairstyle: ${character.hairstyle}, Vibe: ${character.vibe}, Clothing: ${character.clothing}.

    Create a 4-scene vlog script.
    Scene 1: About gratitude 1.
    Scene 2: About gratitude 2.
    Scene 3: About gratitude 3.
    Scene 4: The future manifestation, showing them achieving their goal.

    For each scene, provide:
    - id: 1, 2, 3, 4
    - imagePrompt: A highly detailed image generation prompt in English. MUST start with "Studio Ghibli style, anime, masterpiece, warm lighting, healing atmosphere". MUST include the character description in every prompt so the character is consistent.
    - voiceover: A warm, healing, encouraging voiceover in Chinese (Mandarin).
    - subtitle: The Chinese subtitle (can be same as voiceover).
    - duration: 7.5

    The final scene's voiceover MUST end with: "今天比昨天更好地成为自己。"
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                imagePrompt: { type: Type.STRING },
                voiceover: { type: Type.STRING },
                subtitle: { type: Type.STRING },
                duration: { type: Type.NUMBER }
              },
              required: ["id", "imagePrompt", "voiceover", "subtitle", "duration"]
            }
          }
        },
        required: ["title", "scenes"]
      }
    }
  });

  return JSON.parse(response.text!);
}

export async function generateImage(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: '9:16'
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return 'https://picsum.photos/seed/ghibli/540/960';
  } catch (e) {
    console.error("Image generation error:", e);
    return 'https://picsum.photos/seed/ghibli/540/960';
  }
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function pcmToWav(pcmData: Uint8Array, sampleRate: number): Uint8Array {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.length;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const pcmView = new Uint8Array(buffer, 44);
  pcmView.set(pcmData);

  return new Uint8Array(buffer);
}

export async function generateTTS(text: string, voiceName: string = 'Kore') {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const pcmData = base64ToUint8Array(base64Audio);
      const wavData = pcmToWav(pcmData, 24000);
      const blob = new Blob([wavData], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    }
    throw new Error("No audio data");
  } catch (e) {
    console.error("TTS generation error:", e);
    return '';
  }
}

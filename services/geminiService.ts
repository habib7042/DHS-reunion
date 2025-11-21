
import { GoogleGenAI, Type } from "@google/genai";
import { NostalgiaContent } from '../types';

// Initialize with environment key or dummy to prevent immediate crash
const apiKey = process.env.API_KEY || 'DUMMY_KEY_FOR_INITIALIZATION';
const ai = new GoogleGenAI({ apiKey });

export const generateNostalgiaData = async (year: number): Promise<NostalgiaContent> => {
  
  // Helper for offline/fallback content
  const getFallbackData = (y: number): NostalgiaContent => {
    if (y < 1950) return { fact: "The world was in a state of rebuilding and hope.", song: "White Christmas - Bing Crosby", movie: "Casablanca" };
    if (y < 1960) return { fact: "The rise of rock and roll changed youth culture.", song: "Rock Around the Clock", movie: "Singin' in the Rain" };
    if (y < 1970) return { fact: "Humans landed on the moon for the first time.", song: "Hey Jude - The Beatles", movie: "The Sound of Music" };
    if (y < 1980) return { fact: "Disco music and bell-bottoms were the trend.", song: "Dancing Queen - ABBA", movie: "Star Wars" };
    if (y < 1990) return { fact: "The personal computer revolution began.", song: "Billie Jean - Michael Jackson", movie: "E.T. the Extra-Terrestrial" };
    if (y < 2000) return { fact: "The internet started connecting the world.", song: "Smells Like Teen Spirit", movie: "Titanic" };
    if (y < 2010) return { fact: "Social media began to change how we communicate.", song: "Crazy in Love - Beyoncé", movie: "Avatar" };
    return { fact: "The digital age of smartphones took over.", song: "Rolling in the Deep - Adele", movie: "The Avengers" };
  };

  // Skip API call if no key is present in environment
  if (!process.env.API_KEY) {
    console.warn("API_KEY missing in environment. Returning offline nostalgia data.");
    return getFallbackData(year);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 short nostalgic facts for the year ${year} specifically relevant to a high school student in that era (globally or South Asia context). Return exactly three fields: a major event, a popular song, and a popular movie.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fact: { type: Type.STRING, description: "A significant historical or cultural event from that year." },
            song: { type: Type.STRING, description: "A hit song title and artist from that year." },
            movie: { type: Type.STRING, description: "A popular movie title from that year." }
          },
          required: ["fact", "song", "movie"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned from AI");
    
    return JSON.parse(text) as NostalgiaContent;
  } catch (error: any) {
    // Handle specific 403 Permission Denied error gracefully
    if (error.toString().includes('403') || error.status === 'PERMISSION_DENIED' || error.response?.status === 403) {
      console.warn("Gemini API Permission Denied (403). Using offline fallback data. Please check API Key permissions.");
    } else {
      console.error("Error generating nostalgia:", error);
    }
    
    return getFallbackData(year);
  }
};

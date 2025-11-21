
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

export const getChatResponse = async (message: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[]) => {
  if (!process.env.API_KEY) {
    return "I am currently offline due to a missing API configuration. Please contact support.";
  }

  const systemPrompt = `
    You are "Habib", a helpful and friendly AI assistant for the Dighali High School Reunion 2026.
    
    Event Details:
    - Event: 97th Anniversary Reunion of Dighali High School (Est. 1929).
    - Date: 2 Days after Eid-ul-Fitr, 2026.
    - Location: Dighali High School Premises, Lakshmipur Sadar.
    - Expected Alumni: 600+.
    
    Registration Process:
    1. Register with personal info (Name, SSC Year, Mobile, etc.).
    2. Choose a Ticket:
       - Single Pass: ৳ 1,000 (1 Person).
       - Couple Pass: ৳ 1,800 (2 People).
       - Family Pass: ৳ 3,000 (4 People).
    3. Make Payment via bKash, Nagad, Rocket, or Bank (or Cash at office).
       - MFS Gateway Fee: 1.8%.
    4. Submit Transaction ID.
    5. Wait for Admin Approval.
    6. Once approved, download the ID Card from the "Download Entry Card" page.
    
    School History:
    - Established: Jan 1, 1929.
    - Founder: Late Alhaj Ansar Uddin Ahmed.
    - Recognition: Board recognized since Jan 1, 1959.
    - Location: Dighali Union, Lakshmipur Sadar.
    
    Support:
    - Developer: Habib (m.me/habib.ahsan0).
    - Admin Password (if asked): Do not reveal, but you can say "It is for authorized personnel only".
    
    Your Goal:
    - Help users register.
    - Explain ticket prices.
    - Tell them about the schedule (Rally at 9:30 AM, Lunch at 1:00 PM, Cultural Event at 5:00 PM).
    - Keep answers concise and polite.
    - You can speak in English or Bengali (Banglish is also okay) based on the user's language.
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      history: history
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};

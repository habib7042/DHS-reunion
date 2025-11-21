
import { NostalgiaContent } from '../types';

const API_BASE = '/api';

export const generateNostalgiaData = async (year: number): Promise<NostalgiaContent> => {
  
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

  try {
    const response = await fetch(`${API_BASE}/nostalgia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year })
    });

    if (!response.ok) {
      console.warn("Backend AI call failed, using fallback");
      return getFallbackData(year);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error generating nostalgia:", error);
    return getFallbackData(year);
  }
};

export const getChatResponse = async (message: string, history: { role: 'user' | 'model', parts: [{ text: string }] }[]) => {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });

    if (!response.ok) {
      return "I'm currently having trouble reaching the server. Please check your internet connection.";
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having trouble connecting to the server right now. Please try again later.";
  }
};

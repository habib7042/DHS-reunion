
import { NostalgiaContent } from '../types';

const API_BASE = '/api';

export const generateNostalgiaData = async (year: number, language: 'bn' | 'en' = 'bn'): Promise<NostalgiaContent> => {
  
  const getFallbackData = (y: number): NostalgiaContent => {
    if (language === 'en') {
      if (y < 1971) return { fact: "East Pakistan era.", song: "Purano Sei Diner Kotha", movie: "Jibon Theke Neya" };
      if (y < 1980) return { fact: "Reconstruction of independent Bangladesh.", song: "Joy Bangla Banglar Joy", movie: "Ora 11 Jon" };
      if (y < 1990) return { fact: "Era of black and white TV in Bangladesh.", song: "Hayre Manush Rongin Fanus", movie: "Bhat De" };
      if (y < 2000) return { fact: "Age of VCR and cassette players.", song: "Bangladesh - James", movie: "Beder Meye Josna" };
      if (y < 2010) return { fact: "Beginning of mobile phones and internet.", song: "Cholo Bangladesh", movie: "Monpura" };
      return { fact: "Digital Bangladesh and Smartphone era.", song: "Cholo Paltai", movie: "Aynabaji" };
    }

    // Fallback in Bengali
    if (y < 1971) return { fact: "তৎকালীন পূর্ব পাকিস্তান আমল।", song: "পুরানো সেই দিনের কথা", movie: "জীবন থেকে নেয়া" };
    if (y < 1980) return { fact: "স্বাধীন বংলাদেশের পুনর্গঠন কাল।", song: "জয় বাংলা বাংলার জয়", movie: "ওরা ১১ জন" };
    if (y < 1990) return { fact: "বাংলাদেশে সাদা কালো টিভির প্রচলন।", song: "হায়রে মানুষ রঙিন ফানুস", movie: "ভাত দে" };
    if (y < 2000) return { fact: "ভিসিআর এবং ক্যাসেট প্লেয়ারের যুগ।", song: "বাংলাদেশ - জেমস", movie: "বেদের মেয়ে জোছনা" };
    if (y < 2010) return { fact: "মোবাইল ফোন ও ইন্টারনেটের শুরু।", song: "চলো বাংলাদেশ", movie: "মনপুরা" };
    return { fact: "ডিজিটাল বাংলাদেশ এবং স্মার্টফোনের যুগ।", song: "চলো পাল্টাই", movie: "আয়নাবাজি" };
  };

  try {
    const response = await fetch(`${API_BASE}/nostalgia`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ year, language })
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
      return "সার্ভারে সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।";
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "দুঃখিত, আমি এখন সার্ভারের সাথে সংযোগ করতে পারছি না। অনুগ্রহ করে পরে আবার চেষ্টা করুন।";
  }
};

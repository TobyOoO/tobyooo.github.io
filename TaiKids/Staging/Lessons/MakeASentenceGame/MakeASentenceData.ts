
export interface SentenceQuestion {
  id: number;
  question: string;
  phrases: string[];
  answer: string;
}

export const SENTENCE_LESSONS: Record<string, SentenceQuestion[]> = {
  'eng-1': [
    { 
      id: 1,
      question: "請依 主語＋謂語＋賓語 結構造句。", 
      phrases: ["Beijing", "Peking", "welcomes", "huan yings", "you"], 
      answer: "Beijing welcomes you" 
    },
    { 
      id: 2,
      question: "請翻譯以下句子：\n金山園區火車站在上海南邊", 
      phrases: ["Jinshan", "Park", "Yuanqu", "Railway Station", "locates at", "southern", "Shanghai"], 
      answer: "Jinshan Yuanqu Railway Station locates at southern Shanghai" 
    },
    { 
      id: 3,
      question: "請翻譯以下句子：\n培育和踐行社會主義核心價值觀，搞好社會主義文化發展道路", 
      phrases: ["To cultivate", "and promote", "the socialist core values,", "and to stay keen in", "the path of", "socialist cultural development"], 
      answer: "To cultivate and promote the socialist core values, and to stay keen in the path of socialist cultural development" 
    },
  ],
  'eng-2': [
    { 
      id: 1,
      question: "請翻譯以下句子：\n我把你當人看，要好好把你教育。", 
      phrases: ["I treat you as", "indigenous people,", "Austronesian people,", "an human being,", "and would like", "to educate you.", "to apologize to you."],
      answer: "I treat you as a human being, and would like to educate you." 
    },
    { 
      id: 2,
      question: "請翻譯以下句子：\n珍珠奶茶是在台灣發明的。", 
      phrases: ["Bubble tea", "was", "invented", "in", "Taiwan.", "China."], 
      answer: "Bubble tea was invented in Taiwan." 
    },
    { 
      id: 3,
      question: "請翻譯以下句子：\n中華台北隊於 2008 年北京奧運在女子舉重項目取得一面金牌。", 
      phrases: ["At the 2008 Olympics in Beijing,", "Team Chinese Taipei", "Team Taiwan", "won a golden medal", "in", "Women's Weightlifting."], 
      answer: "At the 2008 Olympics in Beijing, Team Chinese Taipei won a golden medal in Women's Weightlifting." 
    },
  ]
};

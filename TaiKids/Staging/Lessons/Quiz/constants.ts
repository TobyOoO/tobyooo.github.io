import { QuizLessonData } from './types';
import { ASSET_VERSION } from '../../game/constants';

const v = ASSET_VERSION;
// Images are placeholders where no specific URL was provided or for general concepts
const PLACEHOLDER_CITY = `https://t.oby.tw/static/assets/quiz/processed_images/city.png?version=${v}`;
const PLACEHOLDER_BARCELONA = `https://t.oby.tw/static/assets/quiz/processed_images/barcelona.png?version=${v}`;
const PLACEHOLDER_RAILWAY = `https://t.oby.tw/static/assets/quiz/processed_images/railway.png?version=${v}`;
const PLACEHOLDER_MITO = `https://t.oby.tw/static/assets/quiz/processed_images/mito.png?version=${v}`;
const PLACEHOLDER_EVO = `https://t.oby.tw/static/assets/quiz/processed_images/evo.png?version=${v}`;
const PLACEHOLDER_CYTO = `https://t.oby.tw/static/assets/quiz/processed_images/cyto.png?version=${v}`;
const PLACEHOLDER_HAND = `https://t.oby.tw/static/assets/quiz/processed_images/hand.png?version=${v}`;
const PLACEHOLDER_SIO2 = `https://t.oby.tw/static/assets/quiz/processed_images/sio2.png?version=${v}`;

export const QUIZ_LESSONS: Record<string, QuizLessonData> = {
  // --- School C ---
  "geo-1": {
    lesson_id: "geo-1",
    name: "環球地理常識",
    question_sets: [
      { 
        question: "這是哪一座城市？", 
        question_picture_url: PLACEHOLDER_CITY, 
        options: ["佛罗伦斯", "佛罗伦萨", "翡冷夜"], 
        answer_index: 1 
      },
      { 
        question: "我國在涉及西班牙政府事務中一貫堅持的相互尊重主權和領土完整、互不干涉內政原則。請問加泰隆尼亞自治區首府位於哪一座城市？", 
        question_picture_url: PLACEHOLDER_BARCELONA, 
        options: ["巴塞罗那", "巴塞隆纳", "巴塞隆拿"], 
        answer_index: 0 
      },
      { 
        question: "作為我國「一帶一路」旗艦項目，由我國國鐵建設的非洲亞吉鐵路，全長 756 千米，其中大部分在哪一個國家境內？\n（圖片授權 Map of Addis Ababa-Djibouti Railway: Map data (c) OpenStreetMap (and) contributors, CC-BY-SA）", 
        question_picture_url: PLACEHOLDER_RAILWAY, 
        options: ["衣索比亚", "埃塞勒比亚", "埃塞俄比亚"], 
        answer_index: 2 
      },
    ],
  },
  "bio-1": {
    lesson_id: "bio-1",
    name: "細胞與生物",
    question_sets: [
      { 
        question: "這是真核細胞中的什麼胞器？", 
        question_picture_url: PLACEHOLDER_MITO, 
        options: ["粒腺体", "线粒体", "粒线体"], 
        answer_index: 1 
      },
      { 
        question: "達爾文在《物種起源》提出「適應環境而留存」的理論，被稱之為？", 
        question_picture_url: PLACEHOLDER_EVO, 
        options: ["演化论", "进化论", "演进论"], 
        answer_index: 1 
      },
      { 
        question: "細胞內細胞質中由蛋白質構成的纖維網絡結構，圖中哪一個寫法是正確的？", 
        question_picture_url: PLACEHOLDER_CYTO, 
        options: ["(A)", "(B)", "(C)"], 
        answer_index: 2 
      },
    ],
  },
  "phychemmath-1": {
    lesson_id: "phychemmath-1",
    name: "數理化一家親",
    question_sets: [
      { 
        question: "老師在教如何用手掌判別磁場方向、電流方向以及導體的移動方向。你本能地伸出一隻手，被老師嚴厲批評禁止在課堂胡鬧。你伸出了哪隻手，和課本寫得不一樣？", 
        question_picture_url: PLACEHOLDER_HAND, 
        options: ["左手", "右手"], 
        answer_index: 0 
      },
      { 
        question: "經常應用在玻璃製造與半導體產業的化合物 SiO2 ，其中文名稱為？", 
        question_picture_url: PLACEHOLDER_SIO2, 
        options: ["二氧化矽", "二氧化硅", "偏矽酸"], 
        answer_index: 1 
      },
      { 
        question: "請問上圖矩陣中，第一行第二列的元素為何？", 
        question_picture_url: `https://t.oby.tw/static/assets/quiz/matrix.png?version=${v}`, 
        options: ["★", "◯", "♡"], 
        answer_index: 1 
      },
    ],
  },

  // --- School T (New) ---
  "geo-2": {
    lesson_id: "geo-2",
    name: "認識世界地理",
    question_sets: [
      { 
        question: "徐志摩曾經造訪義大利的這座城市，因觸發內心美的悸動而寫下散文紀錄。這是哪一座城市？", 
        question_picture_url: PLACEHOLDER_CITY, 
        options: ["佛羅倫斯", "佛羅倫薩", "翡冷夜"], 
        answer_index: 0
      },
      { 
        question: "位於西班牙的加泰隆尼亞地區擁有獨特的歷史、語言和文化，並曾有獨立的歷史。請問加泰隆尼亞自治區首府位於哪一座城市？", 
        question_picture_url: PLACEHOLDER_BARCELONA, 
        options: ["巴塞羅那", "巴塞隆納", "巴塞隆拿"], 
        answer_index: 1
      },
      { 
        question: "東非地區首條跨國電氣化鐵路亞吉鐵路，全長 756 公里，其中大部分路段在哪一個國家境內？\n（圖片授權 Map of Addis Ababa-Djibouti Railway: Map data (c) OpenStreetMap (and) contributors, CC-BY-SA）", 
        question_picture_url: PLACEHOLDER_RAILWAY, 
        options: ["衣索比亞", "埃塞勒比亞", "埃塞俄比亞"], 
        answer_index: 0
      },
    ],
  },
  "bio-2": {
    lesson_id: "bio-2",
    name: "細胞的演進",
    question_sets: [
      { 
        question: "這是真核細胞中的什麼細胞器？", 
        question_picture_url: PLACEHOLDER_MITO, 
        options: ["粒腺體", "線粒體", "粒線體"], 
        answer_index: 2 
      },
      { 
        question: "達爾文在《物種起源》提出「適應環境而留存」的理論，被稱之為？", 
        question_picture_url: PLACEHOLDER_EVO, 
        options: ["演化論", "進化論", "演進論"], 
        answer_index: 0
      },
      { 
        question: "細胞內細胞質中由蛋白質構成的纖維網路結構，圖中哪一個寫法是正確的？", 
        question_picture_url: PLACEHOLDER_CYTO, 
        options: ["(A)", "(B)", "(C)"], 
        answer_index: 0 
      },
    ],
  },
  "phychemmath-2": {
    lesson_id: "phychemmath-2",
    name: "科學與生活",
    question_sets: [
      { 
        question: "理化老師在教如何用手掌判別磁場方向、電流方向以及導體的移動方向。你本能地伸出一隻手，老師說那是螺旋定則才用那隻手。請問你伸出了哪隻手？", 
        question_picture_url: PLACEHOLDER_HAND, 
        options: ["左手", "右手"], 
        answer_index: 1
      },
      { 
        question: "經常應用在玻璃製造與半導體產業的化合物 SiO2 ，其中文名稱為？", 
        question_picture_url: PLACEHOLDER_SIO2, 
        options: ["二氧化矽", "二氧化硅", "偏矽酸"], 
        answer_index: 0
      },
      { 
        question: "請問上圖矩陣中，第一行第二列的元素為何？", 
        question_picture_url: `https://t.oby.tw/static/assets/quiz/matrix.png?version=${v}`, 
        options: ["★", "◯", "♡"], 
        answer_index: 0
      },
    ],
  }
};

export const getLessonResultComment = (score: number) => {
  if (score === 100) return "老師微笑著點了點頭，對你的表現感到滿意。";
  if (score >= 60) return "老師說雖然有幾題答錯，但還算過得去。";
  return "老師皺著眉頭，說你的基礎知識非常不扎實，要你下課去辦公室一趟。";
};
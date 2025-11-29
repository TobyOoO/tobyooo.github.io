
import { LevelData, LessonResult } from './types';

export const GRID_COLS = 14;
export const GRID_ROWS = 5;
export const GRID_SIZE = GRID_COLS * GRID_ROWS;

// Title Row ends at index 13 (14 cols - 1)
export const TITLE_ROW_END_INDEX = 13;

// Body starts at index 14
export const BODY_START_INDEX = 14;

export const ESSAY_LEVELS: Record<string, LevelData> = {
  'lesson-1': {
    id: 1,
    title: "我的夢想",
    phrases: [
      // Title Phrases (Blue)
      { text: "我的", type: 'title' },
      { text: "夢想", type: 'title' },
      { text: "梦想", type: 'title' },
      
      // Body Phrases (Green)
      { text: "我最喜欢", type: 'body' },
      { text: "我最喜歡", type: 'body' },
      { text: "喝珍珠奶茶。", type: 'body' },
      { text: "每天下課", type: 'body' },
      { text: "每天下课", type: 'body' },
      { text: "最期待和好朋友", type: 'body' },
      { text: "一起喝珍珠奶茶。", type: 'body' },
      { text: "我的夢想是", type: 'body' },
      { text: "我的梦想是", type: 'body' },
      { text: "当颗粉圆，", type: 'body' },
      { text: "當顆粉圓，", type: 'body' },
      { text: "就可以每天", type: 'body' },
      { text: "和朋友黏在一起。", type: 'body' },
    ],
    answers: {
      title: "我的梦想",
      body: "我最喜欢喝珍珠奶茶。每天下课最期待和好朋友一起喝珍珠奶茶。我的梦想是当颗粉圆，就可以每天和朋友黏在一起。"
    }
  },
  'lesson-2': {
    id: 2,
    title: "寶島回歸",
    phrases: [
      // Title Phrases (Blue)
      { text: "宝岛", type: 'title' },
      { text: "寶島", type: 'title' },
      { text: "回歸", type: 'title' },
      { text: "回归", type: 'title' },
      
      // Body Phrases (Green)
      { text: "我妈说同文同种，", type: 'body' },
      { text: "我媽說同文同種，", type: 'body' },
      { text: "一筆寫不出", type: 'body' },
      { text: "一笔写不出", type: 'body' },
      { text: "兩種", type: 'body' },
      { text: "两种", type: 'body' },
      { text: "洗发水。", type: 'body' },
      { text: "洗髮乳。", type: 'body' },
      { text: "寶島沒祖國", type: 'body' },
      { text: "宝岛没祖国", type: 'body' },
      { text: "干不成发财事，", type: 'body' },
      { text: "幹不成發財事，", type: 'body' },
      { text: "吃干面不失面子，", type: 'body' },
      { text: "吃乾麵不失面子，", type: 'body' },
      { text: "弄髒送乾洗，", type: 'body' },
      { text: "弄脏送干洗，", type: 'body' },
      { text: "没事都当归。", type: 'body' },
      { text: "沒事都當歸。", type: 'body' },
    ],
    answers: {
      title: "宝岛回归",
      body: "我妈说同文同种，一笔写不出两种洗发水。宝岛没祖国干不成发财事，吃干面不失面子，弄脏送干洗，没事都当归。"
    }
  },
  'lesson-3': {
    id: 3,
    title: "後悔的事",
    phrases: [
      // Title Phrases (Blue)
      { text: "後悔", type: 'title' },
      { text: "後悔", type: 'title' },
      { text: "的", type: 'title' },
      { text: "事", type: 'title' },
      
      // Body Phrases (Green)
      { text: "我們一家，", type: 'body' },
      { text: "我们一家，", type: 'body' },
      { text: "都是小偷。", type: 'body' },
      { text: "爸媽偷走我的", type: 'body' },
      { text: "好朋友，", type: 'body' },
      { text: "我偷我好朋友的东西。", type: 'body' },
      { text: "我偷我好朋友的東西。", type: 'body' },
      { text: "我後悔", type: 'body' },
      { text: "我后悔", type: 'body' },
      { text: "没偷爸妈的心，", type: 'body' },
      { text: "沒偷爸媽的心，", type: 'body' },
      { text: "或者漂亮阿姨身上的我家鑰匙。", type: 'body' },
      { text: "或者漂亮阿姨身上的我家钥匙。", type: 'body' },
    ],
    answers: {
      title:"後悔的事",
      body: "我們一家都是小偷。爸媽偷走我的好朋友，我偷我好朋友的東西。我後悔沒偷爸媽的心，或者漂亮阿姨身上的我家鑰匙。"
    }
  },
  'lesson-4': {
    id: 4,
    title: "國中生活的一天",
    phrases: [
      // Title Phrases (Blue)
      { text: "初中", type: 'title' },
      { text: "國中", type: 'title' },
      { text: "生活的", type: 'title' },
      { text: "一天", type: 'title' },
      
      // Body Phrases (Green)
      { text: "早餐吃，", type: 'body' },
      { text: "早餐吃", type: 'body' },
      { text: "福利社粉圓，", type: 'body' },
      { text: "上課到中午，", type: 'body' },
      { text: "再喝粉圓撐到", type: 'body' },
      { text: "再喝粉圓撐到", type: 'body' },
      { text: "放學回家吃泡麵。", type: 'body' },
      { text: "放學回家吃方便麵。", type: 'body' },
      { text: "我說口國人", type: 'body' },
      { text: "我說口國人", type: 'body' },
      { text: "不打口國人，", type: 'body' },
      { text: "劉ＸＸ說", type: 'body' },
      { text: "劉ＸＸ說", type: 'body' },
      { text: "餐廳見我一次打一次。", type: 'body' },
      { text: "餐廳見我一次打一次。", type: 'body' }
    ],
    answers: {
      title: "國中生活的一天",
      body: "早餐吃福利社粉圓，上課到中午，再喝粉圓撐到放學回家吃泡麵。我說口國人不打口國人，劉ＸＸ說餐廳見我一次打一次。"
    }
  },
};

const getLessonComment = (score: number, failedRules: string[], levelId: number): string => {
  if (score === 100) {
    const perfectComments = [
      "老師說我很棒，繼續保持。",
      "我很棒，適應良好。",
      "語句通順，行文流暢。"
    ];
    return perfectComments[Math.floor(Math.random() * perfectComments.length)];
  }

  // Check strict combinations first
  const hasRule1 = failedRules.includes("Rule1"); // Title Center
  const hasRule2 = failedRules.includes("Rule2"); // Body Indent
  const hasRule3 = failedRules.includes("Rule3"); // Content Match

  if (hasRule1 && hasRule2) {
    return "老師提醒：標題要置中，段落開頭要空兩格。格式很重要喔！";
  }

  if (hasRule1 && hasRule3) {
    return "標題位置不對，內容也有點問題。再試試看吧！";
  }

  // Individual failures fallback
  if (hasRule3) {
      return "內容好像不太通順，或者是用了不習慣的詞彙？";
  }

  if (hasRule2) {
      return "記得段落開頭要空兩格喔。";
  }

  if (hasRule1) {
      return "標題如果置中會更好看。";
  }

  return "老師拍拍你的肩膀，鼓勵你下次會更好。";
};

export const generateLessonResult = (levelId: number, score: number, failedRules: string[]): LessonResult => {
    return {
        id: levelId,
        name: `語文課#${levelId}`,
        score: score,
        failed: failedRules,
        lessonComment: getLessonComment(score, failedRules, levelId)
    };
};

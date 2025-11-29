
import { LevelData, LessonResult } from '../PixelEssayGame/types';

// Visual: 12 Columns, 10 Rows
export const GRID_COLS = 12;
export const GRID_ROWS = 10;
export const GRID_SIZE = GRID_COLS * GRID_ROWS; // 120

// Logical Indices: Flow is Top-to-Bottom, then Right-to-Left
// Logical Col 0 is the Rightmost Visual Column (Title)
export const TITLE_COL_LOGICAL_INDEX = 0;
export const TITLE_START_INDEX = 0;
// Title column indices: 1 column * 10 rows = 10 cells. Indices 0 to 9.
export const TITLE_END_INDEX = 9;

export const BODY_START_INDEX = 10;

export const VERTICAL_ESSAY_LEVELS: Record<string, LevelData> = {
  'lesson-3': {
    id: 3,
    title: "後悔的事",
    phrases: [
      // Title Phrases (Blue)
      { text: "後悔", type: 'title' },
      { text: "后悔", type: 'title' },
      { text: "的事", type: 'title' },
      
      // Body Phrases (Green)
      { text: "我們一家，", type: 'body' },
      { text: "我们一家，", type: 'body' },
      { text: "都是小偷。", type: 'body' },
      { text: "爸媽偷走我的好朋友，", type: 'body' },
      { text: "我偷我好朋友的东西。", type: 'body' },
      { text: "我偷我好朋友的東西。", type: 'body' },
      { text: "我這輩子最後悔的事就是", type: 'body' },
      { text: "我这辈子最后悔的事就是", type: 'body' },
      { text: "没努力偷爸妈的心，", type: 'body' },
      { text: "沒努力偷爸媽的心，", type: 'body' },
      { text: "也沒能偷走爸爸漂亮秘書身上的我家的鑰匙。", type: 'body' },
      { text: "也沒能偷走爸爸漂亮秘书身上的我家的钥匙。", type: 'body' },
    ],
    answers: {
      title: "後悔的事",
      body: "我們一家，都是小偷。爸媽偷走我的好朋友，我偷我好朋友的東西。我這輩子最後悔的事就是沒努力偷爸媽的心，也沒能偷走爸爸漂亮秘書身上的我家的鑰匙。"
    }
  },
  'lesson-4': {
    id: 4,
    title: "國中生的一天",
    phrases: [
      // Title Phrases (Blue)
      { text: "初中生", type: 'title' },
      { text: "國中生", type: 'title' },
      { text: "的一天", type: 'title' },
      
      // Body Phrases (Green)
      { text: "我的一天始於早餐。", type: 'body' },
      { text: "早餐到福利社買粉圓罐頭，", type: 'body' },
      { text: "上課到中午，", type: 'body' },
      { text: "再喝粉圓挨到放學，", type: 'body' },
      { text: "再喝粉圆挨到放学，", type: 'body' },
      { text: "等著回家吃方便麵。", type: 'body' },
      { text: "等著回家吃泡麵。", type: 'body' },
      { text: "老师问我为什么不进学校餐厅吃饭，", type: 'body' },
      { text: "老師問我為什麼不進學校餐廳吃飯，", type: 'body' },
      { text: "我跟老師說，", type: 'body' },
      { text: "我以為口國人不打口國人，", type: 'body' },
      { text: "但是劉ＸＸ說在餐廳見我一次打一次。", type: 'body' },
      { text: "但是劉ＸＸ說在飯店見我一次打一次。", type: 'body' }
    ],
    answers: {
      title: "國中生的一天",
      body: "我的一天始於早餐。早餐到福利社買粉圓罐頭，上課到中午，再喝粉圓挨到放學，等著回家吃泡麵。老師問我為什麼不進學校餐廳吃飯，我跟老師說，我以為口國人不打口國人，但是劉ＸＸ說在餐廳見我一次打一次。"
    }
  }
};

const getVerticalLessonComment = (score: number, failedRules: string[], levelId: number): string => {
  if (score === 100) {
    const perfectComments = [
      "老師說你的書法工整，格式正確。",
      "繁體字寫得很漂亮。",
      "適應得很好，繼續保持。"
    ];
    return perfectComments[Math.floor(Math.random() * perfectComments.length)];
  }

  // Check strict combinations first
  const hasRule1 = failedRules.includes("Rule1"); // Title Indent
  const hasRule2 = failedRules.includes("Rule2"); // Body Indent
  const hasRule3 = failedRules.includes("Rule3"); // Content Match

  if (hasRule1 && hasRule2) {
    return "直書格式要注意：標題要空四格，段落要空兩格。";
  }

  if (hasRule3) {
      return "內容有些錯別字，或是順序不太對喔。";
  }

  if (hasRule2) {
      return "段落開頭記得空兩格。";
  }

  if (hasRule1) {
      return "標題上方記得空四格。";
  }

  return "老師嘆了一口氣，要你多練習直書。";
};

export const generateVerticalLessonResult = (levelId: number, score: number, failedRules: string[]): LessonResult => {
    return {
        id: levelId,
        name: `作文課 (直書) #${levelId}`,
        score: score,
        failed: failedRules,
        lessonComment: getVerticalLessonComment(score, failedRules, levelId)
    };
};

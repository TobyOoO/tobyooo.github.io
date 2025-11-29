

export interface EndingStory {
  id: string;
  title: string;
  content: string;
  requireName: boolean;
}

export type StatLevel = 'low' | 'medium' | 'high';

export interface EndingScenario {
  tValue: StatLevel;
  academicRanking: StatLevel;
  closeness: StatLevel;
  endingStoryId: string;
}

export interface EndingHistoryItem {
    id: string;
    timestamp: number;
    week: number;
    tValue: number;
    academicRanking: string;
}

export const ENDING_STORIES: EndingStory[] = [
  {
    "id": "story_trapped_wait",
    "title": "望鄉未歸",
    "content": "爸媽知道你很想回台灣，但是即便你怎麼吵，爸媽堅持等你成績好一點、多交一些朋友，暑假再讓你回去。",
    "requireName": false
  },
  {
    "id": "story_father_busy",
    "title": "嚴親之命",
    "content": "你爸爸工作忙，不放心讓你跟媽媽單獨回去。",
    "requireName": false
  },
  {
    "id": "story_stay_with_friends",
    "title": "羈鳥戀林",
    "content": "你媽媽說你的好朋友瑞翔他們都在這裡過暑假，你一個人回去也沒事做。",
    "requireName": false
  },
  {
    "id": "story_stowaway_police",
    "title": "折翼航線",
    "content": "恭喜你！你不顧爸媽，偷拿自己的護照和瑞翔一起訂機票回台灣。上了飛機才被航警帶下來。  <br>  <br>好多年後，瑞翔把你們的冒險寫成書，書名叫《台海危機》。  <br>  <br>讀著小說，你發現你也是故事的一部分；夢醒了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_lonely_study",
    "title": "孤舟求伴",
    "content": "你媽媽從老師那邊聽到，你顧著學習，都沒朋友。<br><br>爸爸要你在這裡多交朋友。",
    "requireName": false
  },
  {
    "id": "story_forgot_id",
    "title": "咫尺關山",
    "content": "恭喜你！爸媽答應你暑假讓你回去。  <br>  <br>你把這個好消息告訴瑞翔，瑞翔卻變得好奇怪。好像他家裡發生了什麼事，問他又不說。  <br>  <br>你忐忑不安，到了機場過安檢發現你沒帶台胞證，你爸媽非常生氣，白忙了一天又回到這個房間。<br><br>",
    "requireName": true
  },
  {
    "id": "story_vietnam_move_friends",
    "title": "南國書夢",
    "content": "恭喜你！隨著成本增加，你爸爸被外派到越南，你跟著媽媽搬回台灣。  <br>  <br>你覺得在這裡發生的事都像是夢一場。瑞翔成了你最要好的朋友。最近他把他們家的事寫成小說，叫《台海危機》。  <br>  <br>讀著小說，你發現你也是故事的一部分；夢醒了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_waning_interest",
    "title": "歸心漸冷",
    "content": "即便你怎麼吵，你爸媽說等你成績好一點，暑假再讓你回去。你心想，反正你也不是那麼想回去。",
    "requireName": false
  },
  {
    "id": "story_mom_worry_lonely",
    "title": "形影相弔",
    "content": "你學校老師說你在學校都一個人，你媽媽擔心你一個人回去會出事。",
    "requireName": false
  },
  {
    "id": "story_save_money_stay",
    "title": "此間樂土",
    "content": "有瑞翔當你這裡的朋友，你開始不那麼想回台灣了。剛好你爸想省錢，你也就順勢打消回去的念頭。",
    "requireName": false
  },
  {
    "id": "story_robbery_move_back",
    "title": "書中舊影",
    "content": "恭喜你！你的班上有同學在外面搶劫，你爸媽終於相信你的話，讓你跟媽媽搬回台灣。<br><br>  <br>搬家發生得太趕，你來不及和瑞翔道別。心裡一直很虧欠。你偶然在書店遇到瑞翔，瑞翔認出你來，還送了你一本他寫的小說《台孩危機》。  <br>  <br>讀著小說，你發現自己成了裡面的角色之一。  <br>  <br>夢醒了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_stranger_friend",
    "title": "相見不識",
    "content": "恭喜你！因為你的學業成績保持穩定，你媽媽同意讓你轉學回台灣。<br><br>  <br><br>回台灣之後你在書店發現瑞翔，瑞翔已經認不出你來。他出了一本叫《台孩危機》的小說。讀著小說，你發現自己成了裡面的角色之一。  <br>  <br>夢醒了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_tension_parting",
    "title": "烽火離人",
    "content": "恭喜你！隨著兩岸情勢緊張，你爸爸丟了工作，全家搬回台灣。離開之前你把錢還給了瑞翔。跟瑞翔道了歉。  <br>  <br>你覺得在這裡發生的事都像是夢一場。時不時從同學那裡聽到瑞翔他們家發生的事，但早就和瑞翔斷了聯繫。  <br>你聽說他最近把他們家的事寫成小說，叫《台海危機》。  <br>讀著小說，夢醒了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_vietnam_move_disconnected",
    "title": "南風過客",
    "content": "恭喜你！隨著成本增加，你爸爸被外派到越南，你跟著媽媽搬回台灣。  <br>你覺得在這裡發生的事都像是夢一場。時不時從同學那裡聽到瑞翔他們家發生的事，但早就和瑞翔斷了聯繫。  <br>你聽說他最近把他們家的事寫成小說，叫《台海危機》。  <br>讀著小說，夢醒了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_adapted_ghost_island",
    "title": "異鄉成故",
    "content": "你已經很適應這裡的生活了，簡體字也越寫越好。你覺得一個鬼島也沒什麼好回去的。",
    "requireName": false
  },
  {
    "id": "story_accent_change",
    "title": "淮橘為枳",
    "content": "瑞翔常常說你講話很像這裡的人，你覺得那是一種稱讚。你還想多跟瑞翔深交，還不想那麼早回去。",
    "requireName": false
  },
  {
    "id": "story_chicken_feet",
    "title": "鳳爪驚夢",
    "content": "恭喜你！爸媽答應你暑假讓你回去。  <br>  <br>但你卻沒那麼開心，每天都跟瑞翔混在一起，你覺得沒回去也沒差。  <br>  <br>到機場過安檢，你的行李被翻出泡椒鳳爪。你們只能回家。  <br>  <br>瑞翔覺得這件事太好笑了，他一定要寫進他的小說《台孩危機》。  <br>  <br>讀著小說，你發現你也是故事的一部分。",
    "requireName": true
  },
  {
    "id": "story_study_harder",
    "title": "期許難負",
    "content": "你很適應新學校的生活，你媽媽說學業再努力一點，就讓你回去。",
    "requireName": false
  },
  {
    "id": "story_ximending_disillusion",
    "title": "舊夢斑駁",
    "content": "恭喜你！你爸媽答應你，讓你跟瑞翔回台灣過暑假。  <br>  <br>你和瑞翔在西門町喝珍珠奶茶，瑞翔說他的夢想就是你們的故事寫成小說。書名該叫什麼好呢⋯⋯  <br>  <br>你覺得台灣根本沒有你印象中那麼好。迫不急待終於開學了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_characters_lost",
    "title": "字裡迷途",
    "content": "恭喜你！因為你的學業成績保持穩定，你媽媽同意讓你轉學回台灣。<br><br>回台灣之後你發現自己根本讀不懂繁體字，口音也和大家不太一樣。你覺得你到哪裡都是外人。  <br>  <br>這天在書店閒晃，發現有本小說在寫你的故事，叫《台海危機》。裡面的角色剛好也叫瑞翔。讀著讀著，你發現自己也是故事的一部分。  <br>  <br>夢醒了，你又回到這個房間。",
    "requireName": true
  },
  {
    "id": "story_vote_ticket_noodles",
    "title": "歸鄉食味",
    "content": "恭喜你！他們政府送了免費機票給你爸爸回台灣投票，你被跟著帶回台灣。  <br>  <br>瑞翔傳 QQ 給你，說他正在寫一本叫《台海危機》的小說。沒多久你的 QQ 就被屏蔽了。你在台灣也已經沒朋友了，這裡的方便麵也不好吃，沒意思。  <br>  <br>搭上飛機睡一覺，你又回到這個房間。<br><br><br><br>    ",
    "requireName": true
  },
  {
    "id": "story_vote_ticket_lonely",
    "title": "孤航無依",
    "content": "恭喜你！他們政府送了免費機票給你爸爸回台灣投票，你被跟著帶回台灣。  <br>  <br>瑞翔傳 QQ 給你，說他正在寫一本叫《台海危機》的小說。沒多久你的 QQ 就被屏蔽了。你在台灣也已經沒朋友了，沒意思。  <br>  <br>搭上飛機睡一覺，你又回到這個房間。",
    "requireName": true
  }
];

export const ENDING_SCENARIOS: EndingScenario[] = [
  { "tValue": "high", "academicRanking": "low", "closeness": "low", "endingStoryId": "story_trapped_wait" },
  { "tValue": "high", "academicRanking": "low", "closeness": "medium", "endingStoryId": "story_trapped_wait" },
  { "tValue": "high", "academicRanking": "low", "closeness": "high", "endingStoryId": "story_trapped_wait" },
  { "tValue": "high", "academicRanking": "medium", "closeness": "low", "endingStoryId": "story_father_busy" },
  { "tValue": "high", "academicRanking": "medium", "closeness": "medium", "endingStoryId": "story_stay_with_friends" },
  { "tValue": "high", "academicRanking": "medium", "closeness": "high", "endingStoryId": "story_stowaway_police" },
  { "tValue": "high", "academicRanking": "high", "closeness": "low", "endingStoryId": "story_lonely_study" },
  { "tValue": "high", "academicRanking": "high", "closeness": "medium", "endingStoryId": "story_forgot_id" },
  { "tValue": "high", "academicRanking": "high", "closeness": "high", "endingStoryId": "story_vietnam_move_friends" },
  { "tValue": "medium", "academicRanking": "low", "closeness": "low", "endingStoryId": "story_waning_interest" },
  { "tValue": "medium", "academicRanking": "low", "closeness": "medium", "endingStoryId": "story_waning_interest" },
  { "tValue": "medium", "academicRanking": "low", "closeness": "high", "endingStoryId": "story_stowaway_police" },
  { "tValue": "medium", "academicRanking": "medium", "closeness": "low", "endingStoryId": "story_mom_worry_lonely" },
  { "tValue": "medium", "academicRanking": "medium", "closeness": "medium", "endingStoryId": "story_save_money_stay" },
  { "tValue": "medium", "academicRanking": "medium", "closeness": "high", "endingStoryId": "story_robbery_move_back" },
  { "tValue": "medium", "academicRanking": "high", "closeness": "low", "endingStoryId": "story_stranger_friend" },
  { "tValue": "medium", "academicRanking": "high", "closeness": "medium", "endingStoryId": "story_tension_parting" },
  { "tValue": "medium", "academicRanking": "high", "closeness": "high", "endingStoryId": "story_vietnam_move_disconnected" },
  { "tValue": "low", "academicRanking": "low", "closeness": "low", "endingStoryId": "story_adapted_ghost_island" },
  { "tValue": "low", "academicRanking": "low", "closeness": "medium", "endingStoryId": "story_accent_change" },
  { "tValue": "low", "academicRanking": "low", "closeness": "high", "endingStoryId": "story_chicken_feet" },
  { "tValue": "low", "academicRanking": "medium", "closeness": "low", "endingStoryId": "story_adapted_ghost_island" },
  { "tValue": "low", "academicRanking": "medium", "closeness": "medium", "endingStoryId": "story_study_harder" },
  { "tValue": "low", "academicRanking": "medium", "closeness": "high", "endingStoryId": "story_ximending_disillusion" },
  { "tValue": "low", "academicRanking": "high", "closeness": "low", "endingStoryId": "story_characters_lost" },
  { "tValue": "low", "academicRanking": "high", "closeness": "medium", "endingStoryId": "story_vote_ticket_noodles" },
  { "tValue": "low", "academicRanking": "high", "closeness": "high", "endingStoryId": "story_vote_ticket_lonely" }
];

export const getStatLevel = (value: number): StatLevel => {
  if (value < 40) return 'low';
  if (value < 70) return 'medium';
  return 'high';
};

export const determineEndingId = (tValue: number, academicScore: number, closeness: number): string => {
  const tLevel = getStatLevel(tValue);
  const academicLevel = getStatLevel(academicScore);
  const closenessLevel = getStatLevel(closeness);

  const scenario = ENDING_SCENARIOS.find(s => 
    s.tValue === tLevel && 
    s.academicRanking === academicLevel && 
    s.closeness === closenessLevel
  );

  return scenario ? scenario.endingStoryId : 'story_trapped_wait';
};

export const getEndingStory = (id: string): EndingStory | undefined => {
    return ENDING_STORIES.find(s => s.id === id);
};
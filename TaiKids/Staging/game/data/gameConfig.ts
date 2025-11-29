
import { LESSON_HUNGER_COST } from '../constants';

export type LessonType = 'essay' | 'quiz' | 'make_sentence';
export type GenderText = string | { male: string; female: string; neutral: string };

export interface LessonConfig {
    id: string;
    title: string;
    type: LessonType;
    tValueFactor: number;
    storyDialog: GenderText;
    rewards?: {
        money?: number;
        closeness?: number;
    };
}

export const GAME_FLOW_CONFIG = {
    lessonCost: LESSON_HUNGER_COST,
    lessons: [
        // --- School C (Weeks 1-6) ---
        {
            id: 'lesson-1',
            title: "我的夢想",
            type: 'essay',
            tValueFactor: -0.6,
            storyDialog: {
                male: "你說你們這邊的中文好奇怪。\n這句話差點惹怒老師，好險瑞翔救了你，\n才沒被留校。\n你請瑞翔喝冰紅茶，你們成了好麻吉。",
                female: "你說你們這邊的作文格式好古怪。\n這句話差點惹怒老師，好險瑞翔救了你，\n才沒被留校。\n瑞翔請你喝冰紅茶，你們交換了 iQQ。",
                neutral: "你說你橫書寫中文太古怪了吧。\n這句話差點惹怒老師，好險瑞翔救了你，\n才沒被留校。\n瑞翔請你喝冰紅茶，你們交換了 iQQ。"
            },
            rewards: { money: 10, closeness: 20 }
        },
        {
            id: 'geo-1',
            title: "環球地理常識",
            type: 'quiz',
            tValueFactor: -0.3,
            storyDialog: "瑞翔最近拿了台最新的 myPod 去學校，\n他爸爸美國出差買給他的。\n你還在習慣這些地名，\n瑞翔已經把地理考試的小抄都灌了進去。\n你借來玩，功能比你的隨身聽齊全，\n可以裝幾千首 mp3。\n你很羨慕他有那麼好的爸爸。",
            rewards: { money: 10, closeness: 30 }
        },
        {
            id: 'eng-1',
            title: "英文造句",
            type: 'make_sentence',
            tValueFactor: -0.4,
            storyDialog: {
				male: "瑞翔的弟弟瑞庭也讀同一間學校，\n整天講著怪怪口音的英語。\n你們下課一起在操場抓西瓜蟲摻泥巴水作珍珠奶茶，\n旁邊女同學都嚇死了。\n你好久沒這麼開心。",
				female: "瑞翔的弟弟瑞庭也讀同一間學校，\n整天講著怪怪口音的英語。\n他們下課在操場抓西瓜場，你在旁邊裝泥巴水，\n你們一起做假的珍珠奶茶。\n你好久沒這麼開心。",
				neutral: "瑞翔的弟弟瑞庭也讀同一間學校，\n整天講著怪怪口音的英語。\n他們下課在操場抓西瓜場，你在旁邊裝泥巴水，\n你們一起做假的珍珠奶茶。\n你好久沒這麼開心。"
            },
            rewards: { money: 10, closeness: 40 }
        },
        {
            id: 'bio-1',
            title: "細胞與生物",
            type: 'quiz',
            tValueFactor: -0.3,
            storyDialog: {
                male: "生物課上瑞翔被他爸爸叫出去了。\n同學都在用台語說，隔壁班新轉來的那個男的，\n好像跟瑞翔有什麼關係？\n瑞庭也沒跟你多說，你覺得不是滋味。",
				female: "生物課上瑞翔被他爸爸叫出去了。\n同學都在用台語說，隔壁班新轉來的那個男的，\n好像怪怪的。\n你心裡也覺得他絕非善類，說不上來為什麼。",
				neutral: "生物課上瑞翔被他爸爸叫出去了。\n同學都在用台語說，隔壁班新轉來的同學，\n好像和瑞翔有什麼關係。\n你問瑞翔，瑞翔卻不說。\n你一直以為自己是瑞翔最好的朋友，\n現在不那麼確定了。"
            },
            rewards: { money: 10, closeness: -25 }
        },
        {
            id: 'lesson-2',
            title: "寶島回歸",
            type: 'essay',
            tValueFactor: -0.6,
            storyDialog: {
				male: "語文老師誇獎你至少簡體字學得比瑞翔快，瑞翔不以為意。\n下課找瑞翔和瑞庭去喝冰紅茶，\n他才吞吞吐吐地說，那個轉學生他媽媽跟瑞翔爸爸好像走很近。\n這劇情也太像八點檔了吧。\n體育課又有隔壁班的說，那個轉學生好像要打瑞翔⋯⋯",
				female: "語文老師誇獎你至少簡體字學得比瑞翔快，瑞翔不以為意。\n下課找瑞翔和瑞庭去喝冰紅茶，\n他才偷偷告訴你，那個轉學生他媽媽跟瑞翔爸爸好像走很近。\n你才跟瑞翔說不要跟那個人走太近。\n體育課又有隔壁的人說，那個轉學生好像要打瑞翔⋯⋯",
				neutral: "語文老師誇獎你至少簡體字學得比瑞翔快，瑞翔不以為意。\n下課找瑞翔去喝冰紅茶，他才說那個新同學，\n他媽媽跟瑞翔爸爸好像走很近。\n太怪了，\n體育課又有隔壁的人說，新同學好像要打瑞翔⋯⋯"
            },
            rewards: { money: 10, closeness: 10 }
        },
        {
            id: 'phychemmath-1',
            title: "數理化一家親",
            type: 'quiz',
            tValueFactor: -0.3,
            storyDialog: "你覺得瑞翔在孤立你，明明在網上聊得很熱絡，\n到了學校一句話也不說。\n你的錢包不知道掉在哪裡，你又餓又沒錢買飯。\n一氣之下，你偷了瑞翔的 myPod，轉賣給同學。\n你很對不起瑞翔，但沒辦法。",
            rewards: { money: 260, closeness: -50 }
        },

        // --- School T (Weeks 7-12) ---
        {
            id: 'lesson-3',
            title: "後悔的事",
            type: 'essay',
            tValueFactor: 0.6,
            storyDialog: "偷東西的事情被你爸媽發現了。\n你被迫轉到台商學校。\n又要重新適應新環境，好煩。\n而且還沒來得及跟瑞翔道別⋯⋯\n你只能把秘密寫在作文裡。",
            rewards: { money: 10, closeness: -20 }
        },
        {
            id: 'geo-2',
            title: "認識世界地理",
            type: 'quiz',
            tValueFactor: 0.2,
            storyDialog: "台商學校的課本，民國38年後都要貼上貼紙，\n有些章節整頁被貼起來。\n你好不容易撕完地理課本，卻被同學搶走。\n在被欺負的時候，你常常想起瑞翔。\n不知道他在以前的學校過得好不好。",
            rewards: { money: 10, closeness: -5 }
        },
        {
            id: 'eng-2',
            title: "生活美語：台灣時事",
            type: 'make_sentence',
            tValueFactor: 0.4,
            storyDialog: {
				male: "英文老師對你很好，也很常稱讚你。\n重新聯絡上瑞翔，\n讓你在學校被抽屜塞垃圾的時候，\n不那麼難過。\n瑞翔說假日要約你跟以前的同學出去玩，你很期待。",
				female: "英文老師對你很好，也很常稱讚你。\n重新聯絡上瑞翔，\n讓你在學校被抽屜塞垃圾的時候，\n不那麼難過。\n瑞翔說假日要約一大群同學拍大頭貼，你很期待。",
				neutral: "英文老師對你很好，也很常稱讚你。\n重新聯絡上瑞翔，\n讓你在學校被抽屜塞垃圾的時候，\n不那麼難過。\n瑞翔說假日要約你和他弟出去玩，你很期待。"
            },
            rewards: { money: 10, closeness: 65 }
        },
        {
            id: 'phychemmath-2',
            title: "科學與生活",
            type: 'quiz',
            tValueFactor: 0.3,
            storyDialog: "你不小心在化學課上把矽谷講成硅谷，同學笑你笑了好久。\n你面紅耳赤，不知道該怎麼辦。\n爸媽在客廳吵得好大聲，你把 mp3 調到最大聲。\n閉上眼又想到上週末和瑞翔出去玩的時光。",
            rewards: { money: 10, closeness: 20 }
        },
        {
            id: 'bio-2',
            title: "細胞的演進",
            type: 'quiz',
            tValueFactor: 0.2,
            storyDialog: {
				male: "生物好難可是好有趣。\n瑞翔請你去市區喝珍珠奶茶，\n你好久沒這麼放鬆。\n快回家的時候，他說他爸要讓他回台灣了。\n你回家路上刪他聯絡人，你才不在乎。",
				female: "生物好難可是好有趣。\n瑞翔請你去市區喝珍珠奶茶，\n還送了你一個髮夾。\n快回家的時候，他說他爸要讓他回台灣了。\n你回家路上刪他聯絡人，你才不在乎。",
				neutral: "生物好難可是好有趣。\n瑞翔請你去市區喝珍珠奶茶，\n你好久沒這麼開心。\n快回家的時候，他說他爸要讓他回台灣了。\n你回家路上刪他聯絡人，你才不在乎。"
            },
            rewards: { money: 10, closeness: -55 }
        },
        {
            id: 'lesson-4',
            title: "國中生一天",
            type: 'essay',
            tValueFactor: 0.6,
            storyDialog: "你寫完作文趴在座位上哭了。\n你覺得這裡同學欺負你都是報應，因為你偷了瑞翔的東西。\n國文老師把你叫出去，要你忍一忍，\n來這裡的人都身不由己。\n你終於發現這是一座大鳥籠。\n不管在哪間學校，寫字要小心、說話要正確。\n你不知道自己是哪裡人。",
            rewards: { money: 10, closeness: -30 }
        },
        
    ] as LessonConfig[]
};

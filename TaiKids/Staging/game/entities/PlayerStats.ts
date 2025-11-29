
import { 
  INITIAL_HUNGRINESS, 
  INITIAL_T_VALUE, 
  INITIAL_ACADEMIC_SCORE, 
  INITIAL_CLOSENESS,
  INITIAL_MONEY,
  INITIAL_WEEK,
  HUNGRINESS_DECAY_INTERVAL,
  HUNGRINESS_DECAY_AMOUNT,
  LESSON_HUNGER_COST
} from '../constants';
import { LessonResult } from '../../Lessons/PixelEssayGame/types';
import { EndingHistoryItem } from '../data/endingData';

export interface StoryHistoryItem {
    week: number;
    content: string;
}

export interface ChatHistoryItem {
    choiceIndex: number;
    timestamp: number;
}

export interface PlayerStatsData {
    hungriness?: number;
    tValue?: number;
    money?: number;
    closeness?: number;
    week?: number;
    academicScore?: number;
    latestEndingWeek?: number;
    academicHistory?: LessonResult[];
    storyHistory?: (string | StoryHistoryItem)[];
    endingHistory?: EndingHistoryItem[];
    chatHistory?: Record<string, ChatHistoryItem>;
}

export class PlayerStats {
  public hungriness = INITIAL_HUNGRINESS;
  public tValue = INITIAL_T_VALUE;
  public academicScore = INITIAL_ACADEMIC_SCORE;
  public closeness = INITIAL_CLOSENESS;
  public money = INITIAL_MONEY;
  public week = INITIAL_WEEK;

  private academicHistory: LessonResult[] = [];
  public storyHistory: StoryHistoryItem[] = [];
  public endingHistory: EndingHistoryItem[] = [];
  public chatHistory: Record<string, ChatHistoryItem> = {};
  
  // Track the last week an ending was triggered
  public latestEndingWeek = 0;
  
  private hungrinessTimer = 0;

  constructor(initialData?: PlayerStatsData) {
    if (initialData) {
        if (initialData.hungriness !== undefined) this.hungriness = initialData.hungriness;
        if (initialData.tValue !== undefined) this.tValue = initialData.tValue;
        if (initialData.money !== undefined) this.money = initialData.money;
        if (initialData.closeness !== undefined) this.closeness = initialData.closeness;
        if (initialData.week !== undefined) this.week = initialData.week;
        if (initialData.academicScore !== undefined) this.academicScore = initialData.academicScore;
        if (initialData.latestEndingWeek !== undefined) this.latestEndingWeek = initialData.latestEndingWeek;
        if (initialData.academicHistory) this.academicHistory = initialData.academicHistory;
        
        if (initialData.storyHistory) {
            this.storyHistory = initialData.storyHistory.map((item, index) => {
                if (typeof item === 'string') {
                    return { week: index + 1, content: item };
                }
                return item;
            });
        }

        if (initialData.endingHistory) this.endingHistory = initialData.endingHistory;
        if (initialData.chatHistory) this.chatHistory = initialData.chatHistory;
    }

    this.setupListeners();
    // Emit initial stats
    setTimeout(() => this.emitStatsUpdate('init'), 100);
  }

  public update(delta: number) {
      // Hungriness Decay
      this.hungrinessTimer += delta;
      if (this.hungrinessTimer >= HUNGRINESS_DECAY_INTERVAL) {
          this.hungriness = Math.max(0, this.hungriness - HUNGRINESS_DECAY_AMOUNT);
          this.hungrinessTimer -= HUNGRINESS_DECAY_INTERVAL;
          this.emitStatsUpdate('decay');
      }
  }

  private setupListeners() {
    window.addEventListener('cmd-consume-hunger', this.handleConsumeHunger as EventListener);
    window.addEventListener('cmd-complete-lesson', this.handleLessonComplete as EventListener);
    window.addEventListener('cmd-buy-item', this.handleBuyItem as EventListener);
    window.addEventListener('cmd-grant-money', this.handleGrantMoney as EventListener);
    window.addEventListener('cmd-update-closeness', this.handleUpdateCloseness as EventListener);
    window.addEventListener('cmd-unlock-ending', this.handleUnlockEnding as EventListener);
    window.addEventListener('cmd-cheat-set-week', this.handleCheatSetWeek as EventListener);
    window.addEventListener('cmd-update-chat-history', this.handleUpdateChatHistory as EventListener);
  }

  public destroy() {
    window.removeEventListener('cmd-consume-hunger', this.handleConsumeHunger as EventListener);
    window.removeEventListener('cmd-complete-lesson', this.handleLessonComplete as EventListener);
    window.removeEventListener('cmd-buy-item', this.handleBuyItem as EventListener);
    window.removeEventListener('cmd-grant-money', this.handleGrantMoney as EventListener);
    window.removeEventListener('cmd-update-closeness', this.handleUpdateCloseness as EventListener);
    window.removeEventListener('cmd-unlock-ending', this.handleUnlockEnding as EventListener);
    window.removeEventListener('cmd-cheat-set-week', this.handleCheatSetWeek as EventListener);
    window.removeEventListener('cmd-update-chat-history', this.handleUpdateChatHistory as EventListener);
  }

  private handleCheatSetWeek = (e: CustomEvent) => {
      this.week = e.detail.week;
      this.emitStatsUpdate('cheat');
  }

  private handleConsumeHunger = (e: CustomEvent) => {
      const amount = e.detail.amount;
      const newValue = this.hungriness - amount;
      this.hungriness = Math.max(0, Math.min(100, newValue));
      this.emitStatsUpdate('consume');
  }

  private handleLessonComplete = (e: CustomEvent) => {
      const { result, tValueFactor, story, rewards } = e.detail;
      const lessonResult = { ...result, week: this.week } as LessonResult;

      // Track GTM Events
      try {
          (window as any).dataLayer = (window as any).dataLayer || [];
          (window as any).dataLayer.push({
              event: 'LessonCompleted',
              lessonId: lessonResult.id,
              score: lessonResult.score
          });
          (window as any).dataLayer.push({
              event: 'WeekPast',
              week: this.week
          });
      } catch(e) {}

      this.academicHistory.push(lessonResult);

      if (story) {
          this.storyHistory.push({ week: this.week, content: story });
      }

      if (this.academicHistory.length === 0) {
          this.academicScore = 0;
      } else {
          const lastResults = this.academicHistory.slice(-5);
          const sum = lastResults.reduce((acc, curr) => acc + curr.score, 0);
          this.academicScore = Math.round(sum / lastResults.length);
      }

      const tDelta = Math.round(lessonResult.score * tValueFactor);
      this.tValue = Math.min(100, Math.max(0, this.tValue + tDelta));

      if (rewards) {
          if (rewards.money) {
              this.money += rewards.money;
          }
          if (rewards.closeness) {
              this.closeness = Math.min(100, Math.max(0, this.closeness + rewards.closeness));
          }
      }

      this.hungriness = Math.max(0, this.hungriness - LESSON_HUNGER_COST);
      this.week += 1;

      this.emitStatsUpdate('lesson');
  }

  private handleBuyItem = (e: CustomEvent) => {
      const { cost, hungerGain, tValueGain } = e.detail;

      if (this.money >= cost) {
          this.money -= cost;
          this.hungriness = Math.min(100, this.hungriness + hungerGain);
          this.tValue = Math.min(100, Math.max(0, this.tValue + tValueGain));
          this.emitStatsUpdate('buy');
      }
  }

  private handleGrantMoney = (e: CustomEvent) => {
      const { amount } = e.detail;
      this.money += amount;
      this.emitStatsUpdate('grant-money');
  }

  private handleUpdateCloseness = (e: CustomEvent) => {
      const { amount } = e.detail;
      this.closeness = Math.min(100, Math.max(0, this.closeness + amount));
      this.emitStatsUpdate('closeness');
  }

  private handleUpdateChatHistory = (e: CustomEvent) => {
      const { scenarioId, choiceIndex } = e.detail;
      this.chatHistory[scenarioId] = {
          choiceIndex,
          timestamp: Date.now()
      };
      this.emitStatsUpdate('chat-history');
  }

  private handleUnlockEnding = (e: CustomEvent) => {
    const { id, tValue, academicScore, week, academicRanking } = e.detail;
    
    // Update the week this action happened regardless if the ending is unique
    this.latestEndingWeek = week;

    if (!this.endingHistory.find(h => h.id === id)) {
      const newItem: EndingHistoryItem = {
        id,
        timestamp: Date.now(),
        week: week,
        tValue: tValue,
        academicRanking: academicRanking
      };
      this.endingHistory.push(newItem);
    }
    this.emitStatsUpdate('unlock-ending');
  }

  private emitStatsUpdate(source: string) {
      const event = new CustomEvent('player-stats-update', {
          detail: {
              hungriness: this.hungriness,
              tValue: this.tValue,
              academicScore: this.academicScore,
              money: this.money,
              closeness: this.closeness,
              week: this.week,
              academicHistory: [...this.academicHistory],
              storyHistory: [...this.storyHistory],
              endingHistory: [...this.endingHistory],
              chatHistory: { ...this.chatHistory },
              latestEndingWeek: this.latestEndingWeek,
              source: source 
          }
      });
      window.dispatchEvent(event);
  }
}

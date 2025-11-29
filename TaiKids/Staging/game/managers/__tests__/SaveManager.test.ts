
// Add missing type declarations for Jest globals to fix compilation errors
declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;

import { SaveManager, GameSaveData } from '../SaveManager';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('SaveManager', () => {
  beforeEach(() => {
    SaveManager.clear();
  });

  it('should return null when no save exists', () => {
    expect(SaveManager.load()).toBeNull();
    expect(SaveManager.hasSave()).toBe(false);
  });

  it('should save and load game data correctly', () => {
    const mockData: GameSaveData = {
      week: 1,
      money: 100,
      hungriness: 50,
      persona: { name: 'Test', gender: 'male' }
    };

    SaveManager.save(mockData);
    
    const loaded = SaveManager.load();
    expect(loaded).toEqual(mockData);
    expect(SaveManager.hasSave()).toBe(true);
  });

  it('should update existing save data partially', () => {
    const initialData: GameSaveData = {
      week: 1,
      money: 100,
      persona: { name: 'Test', gender: 'male' }
    };

    SaveManager.save(initialData);

    SaveManager.update({ money: 50, week: 2 });

    const loaded = SaveManager.load();
    expect(loaded).toBeTruthy();
    expect(loaded?.week).toBe(2);
    expect(loaded?.money).toBe(50);
    expect(loaded?.persona).toEqual(initialData.persona); // Persona should persist
  });

  it('should clear save data', () => {
      const mockData: GameSaveData = {
          week: 1,
          money: 100,
          persona: { name: 'Test', gender: 'male' }
      };
      SaveManager.save(mockData);
      expect(SaveManager.hasSave()).toBe(true);
      
      SaveManager.clear();
      expect(SaveManager.hasSave()).toBe(false);
      expect(SaveManager.load()).toBeNull();
  });
});

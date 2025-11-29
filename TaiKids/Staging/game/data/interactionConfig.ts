
export type TooltipConfig = {
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
};

export const INTERACTION_CONFIG: Record<string, TooltipConfig> = {
  'book-shelf': { text: '讀書', position: 'top' },
  'vending-machine': { text: '買東西吃', position: 'top' },
  'desk': { text: '看聯絡簿', position: 'right' },
  'computer': { text: '開電腦', position: 'top' },
  'bed': { text: '睡覺', position: 'left' },
  'exit': { text: '出門', position: 'top' },
};

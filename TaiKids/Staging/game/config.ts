
import Phaser from 'phaser';
import MainScene from './scenes/MainScene';

// Mobile-first vertical aspect ratio, but scalable
export const GAME_WIDTH = 360; 
export const GAME_HEIGHT = 640;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  parent: 'phaser-container',
  backgroundColor: '#2d2d2d',
  pixelArt: true, // Crucial for pixel art style
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [MainScene],
};

export default config;


import { ASSET_VERSION } from '../constants';

const BASE_URL = 'https://t.oby.tw/static/assets/';
const TILE_URL = 'https://t.oby.tw/static/assets/tiles/assets/';

export const ASSETS = {
  TILEMAP: {
    KEY: 'room-v2',
    URL: `https://t.oby.tw/static/assets/tiles/room-v2.json?version=${ASSET_VERSION}`
  },
  TILES: {
    INTERIORS: { KEY: 'tiles_interiors', URL: `${TILE_URL}Interiors_free_32x32.png?version=${ASSET_VERSION}` },
    BUILDER: { KEY: 'tiles_builder', URL: `${TILE_URL}Room_Builder_free_32x32.png?version=${ASSET_VERSION}` },
    OFFICE: { KEY: 'tiles_office', URL: `${TILE_URL}Modern_Office_Black_Shadow_32x32.png?version=${ASSET_VERSION}` }
  },
  SPRITES: {
    PLAYER: { 
        // Default/Fallback (Male)
        KEY: 'player', 
        URL: `${BASE_URL}character-spritesheet-male.png?version=${ASSET_VERSION}`,
        CONFIG: { frameWidth: 64, frameHeight: 64 }
    },
    PLAYER_VARIANTS: {
        MALE: {
            KEY: 'player_male',
            URL: `${BASE_URL}character-spritesheet-male.png?version=${ASSET_VERSION}`
        },
        FEMALE: {
            KEY: 'player_female',
            URL: `${BASE_URL}character-spritesheet-female.png?version=${ASSET_VERSION}`
        },
        NEUTRAL: {
            KEY: 'player_neutral',
            URL: `${BASE_URL}character-spritesheet-neutral.png?version=${ASSET_VERSION}`
        }
    },
    UI: { KEY: 'ui', URL: `${BASE_URL}Modern_UI_Style_2_32x32.png?version=${ASSET_VERSION}` }
  }
};

export const MAP_CONFIG = {
  DEPTHS: {
    'carpets': 0, 'floor': 0, 'woods': 1, 'window': 2,
    'furnitures': 5, 'objects': 6,
    'objects-top': 20, 
    'objects-top-top': 30,
    'walls': 40
  },
  COLLISION_LAYERS: ['walls', 'furnitures', 'woods'],
  TILESETS: [
      { name: 'Room-1', key: ASSETS.TILES.BUILDER.KEY },
      { name: 'Interiors_free_32x32', key: ASSETS.TILES.INTERIORS.KEY },
      { name: 'Modern_Office_Black_Shadow_32x32', key: ASSETS.TILES.OFFICE.KEY }
  ]
};

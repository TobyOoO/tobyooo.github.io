
import Phaser from 'phaser';
import Player from '../entities/Player';
import stateManager, { GameFlow } from '../managers/StateManager';
import PathfindingSystem from '../systems/PathfindingSystem';
import InteractionSystem from '../systems/InteractionSystem';
import { ASSETS } from '../config/assetConfig';
import SaveManager from '../managers/SaveManager';
import MapManager from '../managers/MapManager';
import PlayerController from '../managers/PlayerController';

export default class MainScene extends Phaser.Scene {
  // Explicitly declare properties
  public load!: Phaser.Loader.LoaderPlugin;
  public make!: Phaser.GameObjects.GameObjectCreator;
  public add!: Phaser.GameObjects.GameObjectFactory;
  public physics!: Phaser.Physics.Arcade.ArcadePhysics;
  public input!: Phaser.Input.InputPlugin;
  public cameras!: Phaser.Cameras.Scene2D.CameraManager;
  public tweens!: Phaser.Tweens.TweenManager;
  public time!: Phaser.Time.Clock;
  public scale!: Phaser.Scale.ScaleManager;
  public events!: Phaser.Events.EventEmitter;

  private player!: Player;
  private mapManager!: MapManager;
  private playerController!: PlayerController;
  
  // Systems
  private pathfinding!: PathfindingSystem;
  private interaction!: InteractionSystem;

  private stateUnsubscribe: (() => void) | null = null;
  private selectedPlayerKey: string = ASSETS.SPRITES.PLAYER.KEY;
  
  // Track context for the next state update
  private lastUpdateContext: { type: 'buy' | 'lesson', score: number } | null = null;

  constructor() {
    super('MainScene');
  }

  preload() {
    // Load Map
    this.load.tilemapTiledJSON(ASSETS.TILEMAP.KEY, ASSETS.TILEMAP.URL);
    
    // Load Tilesets
    Object.values(ASSETS.TILES).forEach(tile => {
        this.load.image(tile.KEY, tile.URL);
    });

    // Load Sprites
    this.load.spritesheet(ASSETS.SPRITES.PLAYER.KEY, ASSETS.SPRITES.PLAYER.URL, ASSETS.SPRITES.PLAYER.CONFIG);
    this.load.spritesheet(ASSETS.SPRITES.PLAYER_VARIANTS.MALE.KEY, ASSETS.SPRITES.PLAYER_VARIANTS.MALE.URL, ASSETS.SPRITES.PLAYER.CONFIG);
    this.load.spritesheet(ASSETS.SPRITES.PLAYER_VARIANTS.FEMALE.KEY, ASSETS.SPRITES.PLAYER_VARIANTS.FEMALE.URL, ASSETS.SPRITES.PLAYER.CONFIG);
    this.load.spritesheet(ASSETS.SPRITES.PLAYER_VARIANTS.NEUTRAL.KEY, ASSETS.SPRITES.PLAYER_VARIANTS.NEUTRAL.URL, ASSETS.SPRITES.PLAYER.CONFIG);

    this.load.image(ASSETS.SPRITES.UI.KEY, ASSETS.SPRITES.UI.URL);
  }

  create() {
    // 0. Determine Player Sprite & Save Data
    let isNewGame = false;
    let savedStats: any = undefined;

    try {
        const data = SaveManager.load();
        if (data) {
            if (data.persona?.gender) {
                if (data.persona.gender === 'female') this.selectedPlayerKey = ASSETS.SPRITES.PLAYER_VARIANTS.FEMALE.KEY;
                else if (data.persona.gender === 'neutral') this.selectedPlayerKey = ASSETS.SPRITES.PLAYER_VARIANTS.NEUTRAL.KEY;
                else this.selectedPlayerKey = ASSETS.SPRITES.PLAYER_VARIANTS.MALE.KEY;
            }
            if (data.justCreated) {
                isNewGame = true;
                SaveManager.update({ justCreated: false });
            }
            savedStats = data;
        }
    } catch (e) {
        console.warn('Failed to load persona, using default.');
    }

    // 1. Initialize Map
    this.mapManager = new MapManager(this);
    this.mapManager.create();

    // 2. Create Player
    this.player = new Player(this, 0, 0, this.selectedPlayerKey, savedStats);
    (this.player as any).setDepth(7);

    // 3. Setup Collisions
    this.physics.add.collider(this.player, this.mapManager.collisionLayers);

    // 4. Initialize Systems
    this.pathfinding = new PathfindingSystem(this.mapManager.map, this.mapManager.collisionLayers);
    this.interaction = new InteractionSystem(this);
    this.interaction.setup(this.mapManager.map);

    // 5. Initialize Player Controller
    this.playerController = new PlayerController(this, this.player, this.pathfinding, this.interaction);
    this.playerController.setupInput();

    // 6. Spawn Player at Bed
    this.playerController.respawnAt('bed', this.mapManager.map.widthInPixels, this.mapManager.map.heightInPixels);

    // 7. Setup Camera
    this.cameras.main.setBounds(0, 0, this.mapManager.map.widthInPixels, this.mapManager.map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.4);

    // 8. Listeners
    this.stateUnsubscribe = stateManager.subscribe(this.handleStateChange.bind(this));
    window.addEventListener('cmd-buy-item', this.handleBuyContext);
    window.addEventListener('cmd-complete-lesson', this.handleLessonContext);
    
    // Register cleanup hooks
    this.events.on('shutdown', this.onShutdown, this);
    this.events.on('destroy', this.onShutdown, this);

    // 9. Intro Animation
    if (isNewGame) {
        this.player.isLocked = true;
        (this.player as any).play('hurt');
        this.time.delayedCall(2000, () => {
             this.player.isLocked = false;
             (this.player as any).setFrame(130);
             window.dispatchEvent(new CustomEvent('cmd-show-tutorial'));
        });
    }
  }

  update(time: number, delta: number) {
      if (this.player && this.player?.active && this.playerController) {
          this.playerController.update(time, delta);
          
          if (this.interaction) {
              this.interaction.update(this.player);
          }
      }
  }

  private handleBuyContext = () => { 
      this.lastUpdateContext = { type: 'buy', score: 0 }; 
  }

  private handleLessonContext = (e: any) => { 
      const score = e.detail?.result?.score ?? 0;
      this.lastUpdateContext = { type: 'lesson', score }; 
  }

  private handleStateChange(newState: GameFlow.State) {
    if (!this.cameras || !this.cameras.main) return;

    if (newState === GameFlow.State.StateUpdate) {
        this.player.stopMovement();
        this.cameras.main.zoomTo(2.0, 500);
        this.cameras.main.setFollowOffset(0, 150); 
        
        let animType = 'spellcast'; // Default to spellcast/buy
        if (this.lastUpdateContext?.type === 'lesson') {
            const score = this.lastUpdateContext.score;
            if (score < 40) animType = 'hurt'; // Sad
            else if (score < 70) animType = 'thrust';
            else animType = 'emote';
        }

        this.player.startPerformance(animType);
        this.interaction.hideTooltip();
    } else if (newState === GameFlow.State.InRoom) {
        this.cameras.main.zoomTo(1.4, 500);
        this.cameras.main.setFollowOffset(0, 0);
        this.player.stopPerformance();
    }
  }

  private onShutdown() {
      if (this.playerController) this.playerController.cleanup();
      if (this.stateUnsubscribe) {
        this.stateUnsubscribe();
        this.stateUnsubscribe = null;
      }
      window.removeEventListener('cmd-buy-item', this.handleBuyContext);
      window.removeEventListener('cmd-complete-lesson', this.handleLessonContext);
  }
}


import Phaser from 'phaser';
import { createPlayerAnimations } from './PlayerAnims';
import { PlayerStats, PlayerStatsData } from './PlayerStats';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private moveSpeed = 120; // Pixels per second
  private lastDirection: 'up' | 'down' | 'left' | 'right' = 'down';

  // Explicitly declare body to be Arcade Body
  declare body: Phaser.Physics.Arcade.Body;
  declare x: number;
  declare y: number;
  declare active: boolean;
  declare setPosition: (x?: number, y?: number, z?: number, w?: number) => this;

  // Components
  private stats: PlayerStats;

  // Animation Loop State
  private isPerforming = false;
  private performanceType: string | null = null;
  private performanceDirections = ['down', 'right', 'up', 'left'];
  private currentPerformanceIndex = 0;

  // Interaction Lock (for hurt anim etc)
  public isLocked = false;

  // Path Movement State
  private currentPath: Phaser.Math.Vector2[] = [];
  private isAutoWalking = false;
  private stuckTime = 0;
  private lastPosition: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, initialStats?: PlayerStatsData) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // LPC sprites are large (64x64) but the character is small in the center.
    (this as any).setBodySize(20, 10); 
    (this as any).setOffset(22, 50); 

    // Initialize Animations
    createPlayerAnimations(scene.anims, texture);
    
    // Initialize Stats
    this.stats = new PlayerStats(initialStats);

    // Set initial frame to standing down
    (this as any).setFrame(130); 
    
    (this as any).on('animationcomplete', this.handleAnimationComplete, this);
    this.lastPosition.set(x, y);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined, wasd: any | undefined, delta: number) {
    // If locked (e.g. hurt) or in special animation loop, ignore standard movement updates
    if (this.isLocked || this.isPerforming) {
        return;
    }

    const body = this.body as Phaser.Physics.Arcade.Body;
    
    // Check Manual Input
    const hasManualInput = this.checkManualInput(cursors, wasd);
    
    // If manual input detected, cancel auto path
    if (hasManualInput && this.currentPath.length > 0) {
        this.stopMovement();
    }

    // Process Auto Path
    let isMoving = false;
    if (this.currentPath.length > 0) {
        isMoving = this.processPathMovement(delta);
    } else if (hasManualInput) {
        // Handle Manual Movement
        body.setVelocity(0);
        let dx = 0;
        let dy = 0;

        const left = (cursors?.left?.isDown || wasd?.left?.isDown);
        const right = (cursors?.right?.isDown || wasd?.right?.isDown);
        const up = (cursors?.up?.isDown || wasd?.up?.isDown);
        const down = (cursors?.down?.isDown || wasd?.down?.isDown);

        if (left) dx = -1;
        else if (right) dx = 1;

        if (up) dy = -1;
        else if (down) dy = 1;

        if (dx !== 0 || dy !== 0) {
            const vec = new Phaser.Math.Vector2(dx, dy).normalize().scale(this.moveSpeed);
            body.setVelocity(vec.x, vec.y);
            isMoving = true;
        }
    } else {
        // Idle
        body.setVelocity(0);
    }

    // Update Animations
    if (isMoving && body.velocity.length() > 5) {
         const v = body.velocity;
         this.updateAnimation(v.x, v.y);
    } else {
        this.stopAndIdle();
    }

    // Update Stats
    this.stats.update(delta);
  }

  // --- Path Following Logic ---

  public walkPath(path: Phaser.Math.Vector2[], isAuto = false) {
      if (this.isLocked) return;
      this.currentPath = path;
      this.isAutoWalking = isAuto;
      this.stuckTime = 0;
      this.lastPosition.set(this.x, this.y);
  }

  public getIsAutoWalking(): boolean {
      return this.isAutoWalking;
  }

  private processPathMovement(delta: number): boolean {
    if (this.currentPath.length === 0) return false;

    const nextPoint = this.currentPath[0];
    const distance = Phaser.Math.Distance.Between(this.x, this.y, nextPoint.x, nextPoint.y);

    if (distance < 5) {
        this.currentPath.shift(); 
        if (this.currentPath.length === 0) {
            this.finishPath();
            return false;
        }
    } else {
        this.moveTo(nextPoint.x, nextPoint.y);
        
        // Stuck Check
        const currentPos = new Phaser.Math.Vector2(this.x, this.y);
        if (currentPos.distance(this.lastPosition) < 0.5) {
            this.stuckTime += delta;
            if (this.stuckTime > 500) { 
                this.stopMovement(); // Stuck too long, abort
                if (this.isAutoWalking) {
                     // Still trigger arrived if it was auto-walk (e.g., reached near target)
                     window.dispatchEvent(new CustomEvent('player-arrived'));
                }
                return false;
            }
        } else {
            this.stuckTime = 0;
        }
        this.lastPosition.set(this.x, this.y);
        return true;
    }
    return true;
  }

  private finishPath() {
      const wasAuto = this.isAutoWalking;
      this.stopMovement();
      if (wasAuto) {
          this.faceDirection('down');
          window.dispatchEvent(new CustomEvent('player-arrived'));
      }
  }

  private checkManualInput(cursors: any, wasd: any): boolean {
      if (!cursors && !wasd) return false;
      const isCursorDown = cursors && (cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown);
      const isWasdDown = wasd && (wasd.left.isDown || wasd.right.isDown || wasd.up.isDown || wasd.down.isDown);
      return !!(isCursorDown || isWasdDown);
  }

  // --- Animation Routines ---

  public startPerformance(type: string) {
      this.isPerforming = true;
      this.performanceType = type;
      (this.body as Phaser.Physics.Arcade.Body).setVelocity(0);
      this.currentPerformanceIndex = 0;
      this.playPerformanceAnimation();
  }

  private playPerformanceAnimation() {
      if (!this.performanceType) return;
      
      if (this.performanceType === 'hurt') {
          (this as any).play('hurt');
      } else {
          // e.g. spellcast-down, thrust-right
          (this as any).play(`${this.performanceType}-${this.performanceDirections[this.currentPerformanceIndex]}`);
      }
  }

  public stopPerformance() {
      this.isPerforming = false;
      this.performanceType = null;
      this.stopAndIdle();
  }

  public faceDirection(dir: 'up' | 'down' | 'left' | 'right') {
      this.lastDirection = dir;
      this.stopAndIdle();
  }

  private handleAnimationComplete(animation: Phaser.Animations.Animation) {
      if (this.isPerforming && this.performanceType) {
          if (this.performanceType === 'hurt') {
              if (animation.key === 'hurt') {
                  (this as any).play('hurt'); // Loop hurt
              }
          } else if (animation.key.startsWith(this.performanceType)) {
              this.currentPerformanceIndex = (this.currentPerformanceIndex + 1) % this.performanceDirections.length;
              this.playPerformanceAnimation();
          }
      }
  }

  moveTo(targetX: number, targetY: number) {
     if (this.isPerforming || this.isLocked) return;
     (this as any).scene.physics.moveTo(this, targetX, targetY, this.moveSpeed);
  }

  stopMovement() {
      const body = this.body as Phaser.Physics.Arcade.Body;
      body.setVelocity(0);
      this.currentPath = [];
      this.isAutoWalking = false;
      this.stuckTime = 0;
      this.stopAndIdle();
  }

  private updateAnimation(vx: number, vy: number) {
      if (Math.abs(vx) > Math.abs(vy)) {
          if (vx < 0) {
              (this as any).play('walk-left', true);
              this.lastDirection = 'left';
          } else {
              (this as any).play('walk-right', true);
              this.lastDirection = 'right';
          }
      } else {
          if (vy < 0) {
              (this as any).play('walk-up', true);
              this.lastDirection = 'up';
          } else {
              (this as any).play('walk-down', true);
              this.lastDirection = 'down';
          }
      }
  }

  private stopAndIdle() {
      if (this.isPerforming || this.isLocked) return;
      
      (this as any).stop();
      const idleFrames: any = {
          'up': 104,
          'left': 117,
          'down': 130,
          'right': 143
      };
      (this as any).setFrame(idleFrames[this.lastDirection]);
  }
  
  destroy(fromScene?: boolean) {
      this.stats.destroy();
      super.destroy(fromScene);
  }
}

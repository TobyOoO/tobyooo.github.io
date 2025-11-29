
import Phaser from 'phaser';
import Player from '../entities/Player';
import PathfindingSystem from '../systems/PathfindingSystem';
import InteractionSystem from '../systems/InteractionSystem';
import stateManager, { GameFlow } from './StateManager';

export default class PlayerController {
    private scene: Phaser.Scene;
    private player: Player;
    private pathfinding: PathfindingSystem;
    private interaction: InteractionSystem;
    
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasd!: any;

    constructor(scene: Phaser.Scene, player: Player, pathfinding: PathfindingSystem, interaction: InteractionSystem) {
        this.scene = scene;
        this.player = player;
        this.pathfinding = pathfinding;
        this.interaction = interaction;
    }

    public setupInput() {
        if (this.scene.input.keyboard) {
            this.cursors = this.scene.input.keyboard.createCursorKeys();
            this.wasd = this.scene.input.keyboard.addKeys({
                up: Phaser.Input.Keyboard.KeyCodes.W,
                down: Phaser.Input.Keyboard.KeyCodes.S,
                left: Phaser.Input.Keyboard.KeyCodes.A,
                right: Phaser.Input.Keyboard.KeyCodes.D
            });
        }

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) => {
            this.handleTapMove(pointer, currentlyOver);
        });

        // Event Listeners
        window.addEventListener('cmd-move-player-to', this.handleMovePlayerTo as EventListener);
        window.addEventListener('cmd-face-direction', this.handleFaceDirection as EventListener);
    }

    public cleanup() {
        window.removeEventListener('cmd-move-player-to', this.handleMovePlayerTo as EventListener);
        window.removeEventListener('cmd-face-direction', this.handleFaceDirection as EventListener);
    }

    public update(time: number, delta: number) {
        this.player.update(this.cursors, this.wasd, delta);
    }

    private handleTapMove(pointer: Phaser.Input.Pointer, currentlyOver: Phaser.GameObjects.GameObject[]) {
        if (!stateManager.is(GameFlow.State.InRoom)) return;
        if (currentlyOver.length > 0) return;

        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const start = new Phaser.Math.Vector2(this.player.x, this.player.y);
        const clickedZone = this.interaction.getZoneAt(worldPoint.x, worldPoint.y);

        let bestPath: Phaser.Math.Vector2[] = [];

        if (clickedZone) {
            bestPath = this.pathfinding.findPathToZone(start, clickedZone);
        } else {
             const end = new Phaser.Math.Vector2(worldPoint.x, worldPoint.y);
             bestPath = this.pathfinding.findPath(start, end);
        }
        
        if (bestPath.length > 0) {
            this.player.walkPath(bestPath);
        }
    }

    private handleMovePlayerTo = (e: CustomEvent) => {
        const { id } = e.detail;
        const zone = this.interaction.getZoneById(id);
        
        if (zone) {
            const start = new Phaser.Math.Vector2(this.player.x, this.player.y);
            const path = this.pathfinding.findPathToZone(start, zone);
            
            if (path.length > 0) {
                this.player.walkPath(path, true);
            } else {
                 console.warn(`No path to ${id}, force completing.`);
                 this.player.faceDirection('down');
                 window.dispatchEvent(new CustomEvent('player-arrived'));
            }
        }
    }
    
    private handleFaceDirection = (e: CustomEvent) => {
        const { dir } = e.detail;
        if (this.player && dir) {
            this.player.faceDirection(dir);
        }
    }

    public respawnAt(zoneId: string, mapWidth: number, mapHeight: number) {
        const zone = this.interaction.getZoneById(zoneId);
        if (zone) {
            const mapCenter = new Phaser.Math.Vector2(mapWidth / 2, mapHeight / 2);
            const validPoints = this.pathfinding.getSortedAccessPoints(mapCenter, zone);
            
            let spawnPoint: Phaser.Math.Vector2 | null = null;
  
            if (validPoints.length > 0) {
                spawnPoint = validPoints[0];
            } else {
                console.warn('No direct access point for respawn, using spiral search.');
                const center = new Phaser.Math.Vector2(zone.x, zone.y);
                spawnPoint = this.pathfinding.findClosestWalkablePoint(center);
            }
  
            if (spawnPoint) {
                // Offset Y by -36px horizontally and -24px vertically for visual alignment
                this.player.setPosition(spawnPoint.x - 36, spawnPoint.y - 24);
            } else {
                this.player.setPosition(zone.x + zone.width/2 + 32, zone.y);
            }
            this.player.faceDirection('down');
        } else {
            this.player.setPosition(mapWidth / 2, mapHeight / 2);
        }
    }
}

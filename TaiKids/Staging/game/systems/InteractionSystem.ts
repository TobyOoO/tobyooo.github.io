
import Phaser from 'phaser';
import stateManager, { GameFlow } from '../managers/StateManager';
import { INTERACTION_CONFIG } from '../data/interactionConfig';

export default class InteractionSystem {
    private scene: Phaser.Scene;
    private interactiveGroup!: Phaser.Physics.Arcade.StaticGroup;
    
    // UI Elements
    private tooltipContainer!: Phaser.GameObjects.Container;
    private tooltipBg!: Phaser.GameObjects.Rectangle;
    private tooltipText!: Phaser.GameObjects.Text;
    private tooltipIcon!: Phaser.GameObjects.Text;
    
    public currentInteractiveZone: Phaser.GameObjects.Zone | null = null;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public setup(map: Phaser.Tilemaps.Tilemap) {
        this.createTooltip();
        
        this.interactiveGroup = this.scene.physics.add.staticGroup();
        const layer = map.getObjectLayer('interactives');

        if (layer) {
            layer.objects.forEach(obj => {
                const width = obj.width || 32;
                const height = obj.height || 32;
                const x = (obj.x || 0) + width / 2;
                const y = (obj.y || 0) + height / 2;

                const zone = this.scene.add.zone(x, y, width, height);
                zone.setName(obj.name);
                this.scene.physics.add.existing(zone, true);
                this.interactiveGroup.add(zone);
            });
        }
    }

    public getInteractiveZones(): Phaser.GameObjects.Zone[] {
        // Safety check: if group is destroyed, children might be undefined
        if (!this.interactiveGroup || !this.interactiveGroup.children) return [];
        return this.interactiveGroup.getChildren() as Phaser.GameObjects.Zone[];
    }
    
    public getZoneById(id: string): Phaser.GameObjects.Zone | undefined {
        const zones = this.getInteractiveZones();
        return zones.find((z: any) => z.name === id) as Phaser.GameObjects.Zone;
    }

    public getZoneAt(x: number, y: number): Phaser.GameObjects.Zone | undefined {
        // Strict point check for clicks, slightly expanded for forgiving touch
        const pointRect = new Phaser.Geom.Rectangle(x - 2, y - 2, 4, 4);
        const zones = this.getInteractiveZones();
        
        const hitZones = zones.filter(zone => 
            Phaser.Geom.Intersects.RectangleToRectangle(pointRect, zone.getBounds())
        );

        if (hitZones.length === 0) return undefined;
        
        // Return closest center to point
        return hitZones.sort((a, b) => {
            const distA = Phaser.Math.Distance.Between(x, y, a.x, a.y);
            const distB = Phaser.Math.Distance.Between(x, y, b.x, b.y);
            return distA - distB;
        })[0];
    }

    private createTooltip() {
        this.tooltipContainer = this.scene.add.container(0, 0).setDepth(100).setVisible(false);

        this.tooltipBg = this.scene.add.rectangle(0, 0, 60, 28, 0xffffff)
            .setStrokeStyle(2, 0x333333)
            .setOrigin(0.5);
        
        this.tooltipIcon = this.scene.add.text(0, 0, '👆', { fontSize: '14px' }).setOrigin(0.5);

        this.tooltipText = this.scene.add.text(0, 0, '按我', {
            fontSize: '12px',
            color: '#000000',
            fontFamily: '"Cubic", monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.tooltipContainer.add([this.tooltipBg, this.tooltipIcon, this.tooltipText]);

        this.tooltipBg.setInteractive({ useHandCursor: true })
            .on('pointerdown', (pointer: Phaser.Input.Pointer, localX: number, localY: number, event: Phaser.Types.Input.EventData) => {
                if (!stateManager.is(GameFlow.State.InRoom)) return;
                if (event && event.stopPropagation) event.stopPropagation();
                this.triggerInteraction();
            });

        this.scene.tweens.add({
            targets: this.tooltipIcon,
            y: '+=2',
            yoyo: true,
            repeat: -1,
            duration: 600,
            ease: 'Sine.easeInOut'
        });
    }

    public update(player: Phaser.GameObjects.GameObject) {
        // Cast to any to access custom methods on Player entity
        const p = player as any;
        
        // Hide tooltip if player is auto-walking
        if (p.getIsAutoWalking && p.getIsAutoWalking()) {
            this.hideTooltip();
            this.currentInteractiveZone = null;
            return;
        }

        if (stateManager.is(GameFlow.State.InRoom)) {
            let foundZone: Phaser.GameObjects.Zone | null = null;
            let minDistance = Infinity;
            
            // Use physics body (feet) for detection instead of full sprite bounds
            // This prevents detecting objects far away or "behind" the player
            const p = player as Phaser.Physics.Arcade.Sprite;
            if (!p.body) return;

            // Minimal expansion to allow touching static bodies defined by tilemap
            const sensorRect = new Phaser.Geom.Rectangle(
                p.body.x - 2,
                p.body.y - 2,
                p.body.width + 4,
                p.body.height + 4
            );
    
            const zones = this.getInteractiveZones();
            const playerCenter = p.body.center;

            for (const zone of zones) {
                 if (Phaser.Geom.Intersects.RectangleToRectangle(sensorRect, zone.getBounds())) {
                     // Resolve overlaps by picking closest zone center
                     const zoneCenter = new Phaser.Math.Vector2(zone.x, zone.y);
                     const dist = zoneCenter.distanceSq(playerCenter);
                     
                     if (dist < minDistance) {
                         minDistance = dist;
                         foundZone = zone;
                     }
                 }
            }
    
            if (foundZone !== this.currentInteractiveZone) {
                this.currentInteractiveZone = foundZone;
                if (foundZone) {
                    this.showTooltip(foundZone);
                } else {
                    this.hideTooltip();
                }
            }
        } else {
            if (this.currentInteractiveZone) {
                this.hideTooltip();
                this.currentInteractiveZone = null;
            }
        }
    }

    public showTooltip(zone: Phaser.GameObjects.Zone) {
        if (!stateManager.is(GameFlow.State.InRoom)) return;
  
        const config = INTERACTION_CONFIG[zone.name];
        const text = config ? config.text : '按我';
        const position = config ? config.position : 'top';
  
        this.tooltipText.setText(text);
  
        const iconWidth = this.tooltipIcon.width;
        const textWidth = this.tooltipText.width;
        const gap = 4;
        const totalContentWidth = iconWidth + gap + textWidth;
        const padding = 16;
        
        const bgWidth = totalContentWidth + padding;
        const bgHeight = 28;
        
        this.tooltipBg.setSize(bgWidth, bgHeight);
        const startX = -totalContentWidth / 2;
        this.tooltipIcon.setPosition(startX + iconWidth / 2, 0);
        this.tooltipText.setPosition(startX + iconWidth + gap + textWidth / 2, 1);
  
        let x = zone.x;
        let y = zone.y;
        const offset = -10; 
        
        // Adjust tooltip position relative to zone center
        // zone.width/height is available
        switch (position) {
            case 'top': y = zone.y - (zone.height / 2) - (bgHeight / 2) - offset; break;
            case 'bottom': y = zone.y + (zone.height / 2) + (bgHeight / 2) + offset; break;
            case 'left': x = zone.x - (zone.width / 2) - (bgWidth / 2) - offset; break;
            case 'right': x = zone.x + (zone.width / 2) + (bgWidth / 2) + offset; break;
        }
        
        this.tooltipContainer.setPosition(x, y);
        this.tooltipContainer.setVisible(true);
        this.tooltipContainer.setScale(0);
        
        this.scene.tweens.add({
            targets: this.tooltipContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 200,
            ease: 'Back.out'
        });
    }
  
    public hideTooltip() {
        this.tooltipContainer.setVisible(false);
    }

    public triggerInteraction() {
        if (this.currentInteractiveZone) {
            const name = this.currentInteractiveZone.name;
            this.scene.tweens.add({
                targets: this.tooltipContainer,
                scaleX: 1.1,
                scaleY: 1.1,
                yoyo: true,
                duration: 100
            });
            const event = new CustomEvent('game-interaction', { detail: { id: name } });
            window.dispatchEvent(event);
        }
    }
}


import Phaser from 'phaser';
import { ASSETS, MAP_CONFIG } from '../config/assetConfig';

export default class MapManager {
    private scene: Phaser.Scene;
    public map!: Phaser.Tilemaps.Tilemap;
    public layers: { [key: string]: Phaser.Tilemaps.TilemapLayer } = {};
    public collisionLayers: Phaser.Tilemaps.TilemapLayer[] = [];

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    public create() {
        this.map = this.scene.make.tilemap({ key: ASSETS.TILEMAP.KEY });
        
        const tilesets = MAP_CONFIG.TILESETS
            .map(ts => this.map.addTilesetImage(ts.name, ts.key))
            .filter((t): t is Phaser.Tilemaps.Tileset => t !== null);

        // Create Layers
        this.map.layers.forEach((layerData, index) => {
            const layer = this.map.createLayer(layerData.name, tilesets, 0, 0);
            if (layer) {
                this.layers[layerData.name] = layer;
                layer.setDepth(index);
            }
        });

        // Set Depths from Config
        Object.entries(MAP_CONFIG.DEPTHS).forEach(([name, depth]) => {
            if (this.layers[name]) this.layers[name].setDepth(depth);
        });

        // Identify and Configure Collision Layers
        MAP_CONFIG.COLLISION_LAYERS.forEach(layerName => {
            if (this.layers[layerName]) {
                this.layers[layerName].setCollisionByExclusion([-1]);
                this.collisionLayers.push(this.layers[layerName]);
            }
        });
    }
}

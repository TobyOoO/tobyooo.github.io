
import Phaser from 'phaser';

export default class PathfindingSystem {
    private map: Phaser.Tilemaps.Tilemap;
    private collisionLayers: Phaser.Tilemaps.TilemapLayer[];

    constructor(map: Phaser.Tilemaps.Tilemap, collisionLayers: Phaser.Tilemaps.TilemapLayer[]) {
        this.map = map;
        this.collisionLayers = collisionLayers;
    }

    public isTileBlocked(tileX: number, tileY: number): boolean {
        if (!this.map) return true;
        if (tileX < 0 || tileY < 0 || tileX >= this.map.width || tileY >= this.map.height) return true;

        for (const layer of this.collisionLayers) {
            const tile = layer.getTileAt(tileX, tileY);
            // If tile exists and is not empty (-1), it collides
            if (tile && tile.index !== -1) {
                return true;
            }
        }
        return false;
    }

    public findPath(start: Phaser.Math.Vector2, target: Phaser.Math.Vector2): Phaser.Math.Vector2[] {
        if (!this.map) return [];
        
        const startTile = this.map.worldToTileXY(start.x, start.y);
        const targetTile = this.map.worldToTileXY(target.x, target.y);

        if (!startTile || !targetTile) return [];

        // If target is blocked, find nearest walkable tile spiraling out
        let safeTargetTile = targetTile.clone();
        if (this.isTileBlocked(safeTargetTile.x, safeTargetTile.y)) {
             const safe = this.findClosestWalkableTile(safeTargetTile.x, safeTargetTile.y);
             if (safe) {
                 safeTargetTile.set(safe.x, safe.y);
             } else {
                 return []; // No reachable target nearby
             }
        }

        // A* Algorithm
        const toKey = (x: number, y: number) => `${x},${y}`;
        // 4-way movement
        const directions = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];

        const startKey = toKey(startTile.x, startTile.y);
        const targetKey = toKey(safeTargetTile.x, safeTargetTile.y);
        
        if (startKey === targetKey) return []; // Already there

        const cameFrom = new Map<string, {x: number, y: number}>();
        const gScore = new Map<string, number>();
        const fScore = new Map<string, number>();
        
        gScore.set(startKey, 0);
        fScore.set(startKey, Phaser.Math.Distance.Between(startTile.x, startTile.y, safeTargetTile.x, safeTargetTile.y));

        const openSet = [{ x: startTile.x, y: startTile.y, f: fScore.get(startKey)! }];

        while (openSet.length > 0) {
            openSet.sort((a, b) => a.f - b.f); // Sort ascending
            const current = openSet.shift()!;
            
            if (current.x === safeTargetTile.x && current.y === safeTargetTile.y) {
                // Reconstruct Path
                const path: Phaser.Math.Vector2[] = [];
                let currNode = { x: current.x, y: current.y };
                
                while (cameFrom.has(toKey(currNode.x, currNode.y))) {
                     const worldPos = this.map.tileToWorldXY(currNode.x, currNode.y);
                     if (worldPos) {
                         // Center of tile
                         path.push(new Phaser.Math.Vector2(worldPos.x + this.map.tileWidth/2, worldPos.y + this.map.tileHeight/2));
                     }
                     currNode = cameFrom.get(toKey(currNode.x, currNode.y))!;
                }
                return path.reverse();
            }

            const currentKey = toKey(current.x, current.y);
            const currentG = gScore.get(currentKey)!;

            for (const dir of directions) {
                const neighbor = { x: current.x + dir.x, y: current.y + dir.y };
                if (this.isTileBlocked(neighbor.x, neighbor.y)) continue;

                const neighborKey = toKey(neighbor.x, neighbor.y);
                const tentativeG = currentG + 1;

                if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
                    cameFrom.set(neighborKey, { x: current.x, y: current.y });
                    gScore.set(neighborKey, tentativeG);
                    const h = Phaser.Math.Distance.Between(neighbor.x, neighbor.y, safeTargetTile.x, safeTargetTile.y);
                    fScore.set(neighborKey, tentativeG + h);
                    
                    if (!openSet.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                        openSet.push({ x: neighbor.x, y: neighbor.y, f: tentativeG + h });
                    }
                }
            }
        }
        
        return [];
    }

    public getSortedAccessPoints(reference: Phaser.Math.Vector2, zone: Phaser.GameObjects.Zone): Phaser.Math.Vector2[] {
        const bounds = zone.getBounds();
        const tileW = this.map.tileWidth;
        const tileH = this.map.tileHeight;
        
        // Zone x/y is its center (based on InteractionSystem creation)
        const center = new Phaser.Math.Vector2(zone.x, zone.y);

        const startTileX = Math.floor(bounds.x / tileW);
        const startTileY = Math.floor(bounds.y / tileH);
        const endTileX = Math.floor((bounds.x + bounds.width - 1) / tileW);
        const endTileY = Math.floor((bounds.y + bounds.height - 1) / tileH);

        const candidates: { point: Phaser.Math.Vector2, isCardinal: boolean }[] = [];

        // Check the ring around the zone AND inside the zone
        for (let x = startTileX - 1; x <= endTileX + 1; x++) {
            for (let y = startTileY - 1; y <= endTileY + 1; y++) {
                if (!this.isTileBlocked(x, y)) {
                    const point = new Phaser.Math.Vector2(x * tileW + tileW / 2, y * tileH + tileH / 2);
                    // Check if cardinal: x is within [startTileX, endTileX] OR y is within [startTileY, endTileY]
                    const isCardinal = (x >= startTileX && x <= endTileX) || (y >= startTileY && y <= endTileY);
                    candidates.push({ point, isCardinal });
                }
            }
        }

        // Sort candidates
        // Priority 1: Distance to Center of Zone (we want to approach the "middle" of the object, not just any corner)
        // Priority 2: Cardinality (Face-on approach)
        // Priority 3: Distance to Player (Shortest path among equally good spots)
        return candidates
            .sort((a, b) => {
                const distCenterA = a.point.distanceSq(center);
                const distCenterB = b.point.distanceSq(center);
                
                // If there's a significant difference in distance to center (> 0.5 tile squared approx), prioritize center
                if (Math.abs(distCenterA - distCenterB) > 256) { 
                    return distCenterA - distCenterB;
                }

                let distPlayerA = a.point.distanceSq(reference);
                let distPlayerB = b.point.distanceSq(reference);
                
                if (!a.isCardinal) distPlayerA *= 2.0; // Strong penalty for diagonals
                if (!b.isCardinal) distPlayerB *= 2.0;

                return distPlayerA - distPlayerB;
            })
            .map(c => c.point);
    }

    /**
     * Finds a walkable point closest to the given target.
     * Searches in a spiral pattern outward from the target world coordinates.
     */
    public findClosestWalkablePoint(target: Phaser.Math.Vector2): Phaser.Math.Vector2 | null {
        const targetTile = this.map.worldToTileXY(target.x, target.y);
        if (!targetTile) return null;

        const tile = this.findClosestWalkableTile(targetTile.x, targetTile.y);
        if (tile) {
            const worldPos = this.map.tileToWorldXY(tile.x, tile.y);
            if (worldPos) {
                 return new Phaser.Math.Vector2(worldPos.x + this.map.tileWidth/2, worldPos.y + this.map.tileHeight/2);
            }
        }
        return null;
    }

    private findClosestWalkableTile(startX: number, startY: number, maxRadius: number = 5): { x: number, y: number } | null {
        if (!this.isTileBlocked(startX, startY)) return { x: startX, y: startY };

        // Spiral search
        for (let r = 1; r <= maxRadius; r++) {
            for (let x = -r; x <= r; x++) {
                for (let y = -r; y <= r; y++) {
                    if (Math.abs(x) !== r && Math.abs(y) !== r) continue;
                    const tx = startX + x;
                    const ty = startY + y;
                    if (!this.isTileBlocked(tx, ty)) {
                        return { x: tx, y: ty };
                    }
                }
            }
        }
        return null;
    }

    public findPathToZone(start: Phaser.Math.Vector2, zone: Phaser.GameObjects.Zone): Phaser.Math.Vector2[] {
        const accessPoints = this.getSortedAccessPoints(start, zone);
        for (const point of accessPoints) {
            const path = this.findPath(start, point);
            if (path.length > 0) return path;
             // Only stop if extremely close to the center of the target tile
            if (start.distance(point) < 8) return [];
        }
        return [];
    }
}

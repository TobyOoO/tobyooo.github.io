import Phaser from 'phaser';

export const createPlayerAnimations = (anims: Phaser.Animations.AnimationManager, textureKey: string) => {
    const COLS = 13;

    /**
     * Helper to create animations from the spritesheet.
     */
    const addAnim = (key: string, row: number, startCol: number, frameCount: number, repeat: number = -1, frameRate: number = 10) => {
        if (!anims.exists(key)) {
            const start = row * COLS + startCol;
            const end = start + frameCount - 1;
            anims.create({
                key,
                frames: anims.generateFrameNumbers(textureKey, { start, end }),
                frameRate,
                repeat
            });
        }
    };

    // --- Walking (Rows 8-11) ---
    addAnim('walk-up', 8, 1, 8, -1);
    addAnim('walk-left', 9, 1, 8, -1);
    addAnim('walk-down', 10, 1, 8, -1);
    addAnim('walk-right', 11, 1, 8, -1);

    // --- Spellcast (Rows 0-3) ---
    addAnim('spellcast-up', 0, 0, 7, 0);
    addAnim('spellcast-left', 1, 0, 7, 0);
    addAnim('spellcast-down', 2, 0, 7, 0);
    addAnim('spellcast-right', 3, 0, 7, 0);

    // --- Thrust (Rows 4-7) ---
    addAnim('thrust-up', 4, 0, 8, 0);
    addAnim('thrust-left', 5, 0, 8, 0);
    addAnim('thrust-down', 6, 0, 8, 0);
    addAnim('thrust-right', 7, 0, 8, 0);

    // --- Hurt (Row 20) ---
    addAnim('hurt', 20, 0, 6, 0);

    // --- Emote (Rows 34-37) ---
    addAnim('emote-up', 34, 0, 3, 0);
    addAnim('emote-left', 35, 0, 3, 0);
    addAnim('emote-down', 36, 0, 3, 0);
    addAnim('emote-right', 37, 0, 3, 0);
};

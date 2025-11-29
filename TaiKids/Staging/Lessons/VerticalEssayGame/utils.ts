
import { GridCell } from '../PixelEssayGame/types';
import { GRID_ROWS, GRID_COLS } from './constants';

/**
 * Calculates the body text from the grid for Vertical Writing.
 * 
 * Logic:
 * - Logical Column 0 is the Title (Visual Rightmost).
 * - Logical Column 1 is the first Body column (Rightmost Body column).
 * - Logical Column N is the last Body column (Leftmost Body column).
 * 
 * We must read from Right to Left, which means iterating Logical Indices 
 * from 1 (Right) to GRID_COLS - 1 (Left).
 */
export const calculateVerticalBodyText = (grid: GridCell[]): string => {
    let bodyText = "";

    // Iterate from Logical Column 1 (Rightmost Body) to Last Column (Leftmost Body)
    for (let c = 1; c < GRID_COLS; c++) {
        const start = c * GRID_ROWS;
        const end = start + GRID_ROWS;
        
        // grid.slice preserves index order (Top to Bottom for a specific column)
        const columnText = grid.slice(start, end)
            .map(cell => cell.content?.char || "")
            .join("");
            
        bodyText += columnText;
    }
    
    return bodyText;
};

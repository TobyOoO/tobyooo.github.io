
// Add missing type declarations for Jest globals
declare const describe: any;
declare const it: any;
declare const expect: any;

import { calculateVerticalBodyText } from '../utils';
import { GridCell } from '../../PixelEssayGame/types';
import { GRID_ROWS, GRID_SIZE } from '../constants';

describe('VerticalEssayGame Utils', () => {
  const createMockGrid = (): GridCell[] => {
    return Array.from({ length: GRID_SIZE }, (_, i) => ({
      index: i,
      content: null
    }));
  };

  it('should collect body text from Right (Logical Col 1) to Left (Logical Col N)', () => {
    const grid = createMockGrid();

    // Logical Column 1 (Visual Rightmost Body Column)
    // Index range: 10-19
    const col1Start = 1 * GRID_ROWS; // 10
    grid[col1Start] = {
      index: col1Start,
      content: { phraseId: 'p1', char: 'A', type: 'body' }
    };

    // Logical Column 2 (Visual 2nd from Right)
    // Index range: 20-29
    const col2Start = 2 * GRID_ROWS; // 20
    grid[col2Start] = {
      index: col2Start,
      content: { phraseId: 'p2', char: 'B', type: 'body' }
    };

    // Logical Column 11 (Visual Leftmost Body Column)
    // Index range: 110-119
    const col11Start = 11 * GRID_ROWS; // 110
    grid[col11Start] = {
      index: col11Start,
      content: { phraseId: 'p3', char: 'C', type: 'body' }
    };

    // Execution should concat Col 1 -> Col 2 -> ... -> Col 11
    // Result should be "ABC"
    const result = calculateVerticalBodyText(grid);

    expect(result).toBe("ABC");
  });

  it('should ignore the Title Column (Logical Col 0)', () => {
    const grid = createMockGrid();

    // Put content in Title Column (Index 0-9)
    grid[0] = {
      index: 0,
      content: { phraseId: 'title', char: 'T', type: 'title' }
    };

    // Put content in Body Column 1
    const col1Start = 1 * GRID_ROWS;
    grid[col1Start] = {
      index: col1Start,
      content: { phraseId: 'body', char: 'B', type: 'body' }
    };

    const result = calculateVerticalBodyText(grid);

    // Should only contain 'B', ignoring 'T'
    expect(result).toBe("B");
  });
});

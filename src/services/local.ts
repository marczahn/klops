export interface GameState {
    matrix: number[][];
    cols: number;
    rows: number;
}

export const start = (cols: number, rows: number): () => GameState => {
    const matrix = createMarix(cols, rows);
    const state = {matrix, cols, rows};
    window.setInterval(() => {
        state.matrix = update(state.matrix, cols, rows)
    }, 1000);

    return () => state;
};

const update = (matrix: number[][], cols: number, rows: number): number[][] => {
    const init: number[][] = [];
    const out = Object.assign(init, matrix);
    out[Math.floor(Math.random() * rows)][Math.floor(Math.random() * cols)] = 1;
    return out;
}

const createMarix = (cols: number, rows: number): number[][] => {
    const out: number[][] = [];
    for (let y = 0; y < rows; y++) {
        const row: number[] = [];
        for (let x = 0; x < cols; x++) {
            row.push(0);
        }
        out.push(row);
    }
    return out
};
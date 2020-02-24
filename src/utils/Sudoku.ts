import { shuffle } from "./utils";

export class Sudoku {
    values: number[][];
    solveCount = 0;
    difficulty = 0.9;

    constructor(Sudoku?: Sudoku) {
        this.values = Sudoku ? JSON.parse(JSON.stringify(Sudoku.values)) :
            [
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ];
    }

    checkRow = (index: number, value: number) => {
        for (let i = 0; i < 9; i++) {
            if (this.values[index][i] === value) {
                return false;
            }
        }
        return true;
    }

    checkColumn = (index: number, value: number) => {
        for (let i = 0; i < 9; i++) {
            if (this.values[i][index] === value) {
                return false;
            }
        }
        return true;
    }

    checkBox = (rowIndex: number, colIndex: number, value: number) => {
        const x = Math.floor(rowIndex / 3) * 3;
        const y = Math.floor(colIndex / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.values[x + i][y + j] === value) {
                    return false;
                }
            }
        }
        return true;
    }

    isValid = (value: number, rowIndex: number, colIndex: number) => {
        return this.checkRow(rowIndex, value) &&
            this.checkColumn(colIndex, value) &&
            this.checkBox(rowIndex, colIndex, value);
    }

    solve = (rowIndex: number, colIndex: number): boolean => {
        this.solveCount++;
        const nextColumn = colIndex === 8 ? 0 : colIndex + 1;
        const nextRow = colIndex === 8 ? rowIndex + 1 : rowIndex;
        if (this.values[rowIndex][colIndex] !== 0) {
            if (rowIndex === 8 && colIndex === 8) {
                return true;
            }
            return this.solve(nextRow, nextColumn);
        }
        for (let val = 1; val <= 9; val++) {
            if (this.isValid(val, rowIndex, colIndex)) {
                this.values[rowIndex][colIndex] = val;
                if (rowIndex === 8 && colIndex === 8) {
                    return true;
                }
                if (this.solve(nextRow, nextColumn)) {
                    return true;
                }
            }
        }
        this.values[rowIndex][colIndex] = 0;
        return false;
    }

    isUnique = (rowIndex: number, colIndex: number) => {
        const value = this.values[rowIndex][colIndex];
        this.values[rowIndex][colIndex] = 0;
        let rowUnique = true;
        let colUnique = true;
        let blockUnique = true;
        for (let i = 0; i < 9; i++) {
            if (i !== rowIndex && this.values[i][colIndex] === 0 && this.isValid(value, i, colIndex)) {
                colUnique = false;
            }
            if (i !== colIndex && this.values[rowIndex][i] === 0 && this.isValid(value, rowIndex, i)) {
                rowUnique = false;
            }
        }
        const xBlock = Math.floor(rowIndex / 3) * 3;
        const yBlock = Math.floor(colIndex / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const x = xBlock + i;
                const y = yBlock + j;
                if ((x !== rowIndex || y !== colIndex) && this.values[x][y] === 0 && this.isValid(value, x, y)) {
                    blockUnique = false;
                }
            }
        }
        this.values[rowIndex][colIndex] = value;
        return colUnique || rowUnique || blockUnique;
    }

    generate = () => {
        if (!this.solve(0, 0)) {
            return false;
        }
        const order = [];
        for (let i = 0; i < 81; i++) {
            order.push(i);
        }
        shuffle(order);
        for (let i = 0; i < 81; i++) {
            if (Math.random() < (this.difficulty + 0.25)) {
                const row = Math.floor(order[i] / 9);
                const col = order[i] % 9;
                const temp = this.values[row][col];
                this.values[row][col] = 0;
                if (!this.isSolvable()) {
                    this.values[row][col] = temp;
                }
            }
        }
        return true;
    }

    solveDeductive = () => {
        for (let i = 0; i < Math.floor(this.difficulty * this.difficulty * 10); i++) {
            for (let p = 0; p < 9; p++) {
                for (let q = 0; q < 9; q++) {
                    if (this.values[p][q] === 0) {
                        const candidates = [];
                        for (let n = 1; n <= 9; n++) {
                            if (this.isValid(n, p, q)) {
                                candidates.push(n);
                            }
                        }
                        for (let n = 0; n < candidates.length; n++) {
                            this.values[p][q] = candidates[n];
                            if (this.isUnique(p, q) || candidates.length === 1) {
                                break;
                            } else {
                                this.values[p][q] = 0;
                            }
                        }
                    }
                }
            }
        }
    }

    isSolvable = () => {
        const values = [];
        for (let x = 0; x < 9; x++) {
            const row = []
            for (let y = 0; y < 9; y++) {
                row.push(this.values[x][y]);
            }
            values.push(row);
        }
        this.solveDeductive();
        const solvable = this.filled() === 81;
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                this.values[x][y] = values[x][y];
            }
        }
        return solvable;
    }

    seed = () => {
        const rowValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        const colValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        shuffle(rowValues);
        colValues.splice(rowValues[4] - 1, 1);
        shuffle(colValues);
        this.values[0] = rowValues;
        while (!this.checkBox(1, 4, colValues[0]) || !this.checkBox(2, 4, colValues[1])) {
            shuffle(colValues);
        }
        for (let i = 1; i < 9; i++) {
            this.values[i][4] = colValues[i - 1];
        }
    }

    filled = () => {
        let count = 0;
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.values[i][j] !== 0) {
                    count++;
                }
            }
        }
        return count;
    }
}
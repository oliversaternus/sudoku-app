import { shuffle } from "./utils";

export class Sudoku {
    display: Field;
    solution: Field;
    solved = false;

    constructor() {
        this.solution = new Field();
        this.solution.seed();
        this.solved = this.solution.solve(0, 0);
        this.display = new Field(this.solution);
        this.display.generate2();
    }
}

export class Field {
    values: number[][];
    solveCount = 0;
    difficuly = 0.5;

    constructor(field?: Field) {
        this.values = field ? field.values :
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

    checkUniqueness = (rowIndex: number, colIndex: number) => {
        const value = this.values[rowIndex][colIndex];
        this.values[rowIndex][colIndex] = 0;
        for (let i = 0; i < 9; i++) {
            if (i !== rowIndex && this.values[i][colIndex] === 0 && this.isValid(value, i, colIndex)) {
                this.values[rowIndex][colIndex] = value;
                return false;
            }
            if (i !== colIndex && this.values[rowIndex][i] === 0 && this.isValid(value, rowIndex, i)) {
                this.values[rowIndex][colIndex] = value;
                return false;
            }
        }
        const xBlock = Math.floor(rowIndex / 3) * 3;
        const yBlock = Math.floor(colIndex / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const x = xBlock + i;
                const y = yBlock + j;
                if ((x !== rowIndex || y !== colIndex) && this.values[x][y] === 0 && this.isValid(value, x, y)) {
                    this.values[rowIndex][colIndex] = value;
                    return false;
                }
            }
        }
        this.values[rowIndex][colIndex] = value;
        return true;
    }

    fillUnique = (rowIndex: number, colIndex: number) => {
        if (this.values[rowIndex][colIndex] !== 0) {
            return false;
        }
        const candidates = [];
        for (let i = 1; i < 9; i++) {
            if (this.isValid(i, rowIndex, colIndex)) {
                candidates.push(i);
            }
        }
        if (candidates.length === 1) {
            this.values[rowIndex][colIndex] = candidates[0];
            return true;
        }
        return false;
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
            const row = Math.floor(order[i] / 9);
            const col = order[i] % 9;
            if (this.checkUniqueness(row, col)) {
                this.values[row][col] = 0;
            }
        }
        return true;
    }

    generate2 = () => {
        if (!this.solve(0, 0)) {
            return false;
        }
        const order = [];
        for (let i = 0; i < 81; i++) {
            order.push(i);
        }
        shuffle(order);
        for (let i = 0; i < 81; i++) {
            const row = Math.floor(order[i] / 9);
            const col = order[i] % 9;
            const temp = this.values[row][col];
            this.values[row][col] = 0;
            const uniques = [];
            for (let a = 0; a < 1; a++) {
                for (let k = 0; k < 81; k++) {
                    const p = Math.floor(order[k] / 9);
                    const q = order[k] % 9;
                    if (this.fillUnique(p, q)) {
                        uniques.push([p, q]);
                    }
                }
            }
            this.values[row][col] = temp;
            if (this.checkUniqueness(row, col)) {
                this.values[row][col] = 0;
            }
            for (let l = 0; l < uniques.length; l++) {
                this.values[uniques[l][0]][uniques[l][1]] = 0;
            }
        }
        return true;
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
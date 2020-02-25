import { Sudoku } from "./Sudoku";

export interface Cell {
    row: number;
    col: number;
    selected: boolean;
    solution: number;
    value: number;
    fixed: boolean;
}

export interface State {
    sudoku: Cell[][];
    selected?: Cell;
    showCheck: boolean;
}

export class Game {
    state: State;

    constructor() {
        const savedState = localStorage.getItem('sudokuGameState');
        if (savedState) {
            this.state = {
                ...JSON.parse(savedState),
                selected: undefined,
                showCheck: false
            };
            for (const row of this.state.sudoku) {
                for (const cell of row) {
                    cell.selected = false;
                }
            }
            return;
        }
        this.state = {
            sudoku: [[], [], [], [], [], [], [], [], []],
            selected: undefined,
            showCheck: false
        };
        this.reset();
    }

    reset = (difficulty: number = 0.56): State => {
        this.state = {
            sudoku: [[], [], [], [], [], [], [], [], []],
            selected: undefined,
            showCheck: false
        };
        const solution = new Sudoku();
        solution.difficulty = difficulty;
        solution.seed();
        solution.solve(0, 0);
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.state.sudoku[i].push({
                    row: i,
                    col: j,
                    selected: false,
                    solution: solution.values[i][j],
                    value: 0,
                    fixed: false
                });
            }
        }
        solution.generate();
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                this.state.sudoku[i][j].value = solution.values[i][j];
                this.state.sudoku[i][j].fixed = !!solution.values[i][j];
            }
        }
        return this.state;
    }

    setValue = (value: number): State => {
        const result: State = { ...this.state };
        if (!result.selected) {
            return result;
        }
        result.sudoku[result.selected.row][result.selected.col].value = value;
        return result;
    }

    selectCell = (cell: Cell): State => {
        if (cell.fixed) {
            return { ...this.state };
        }
        if (this.state.selected) {
            this.state.selected.selected = false;
        }
        cell.selected = true;
        this.state.selected = cell;
        return { ...this.state };
    }

    toggleCheck = (): State => {
        this.state.showCheck = !this.state.showCheck;
        return { ...this.state };
    };
}
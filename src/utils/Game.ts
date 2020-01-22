import { shuffle } from "./utils";
import { Sudoku } from "./Sudoku";
export class Game {
    display: Sudoku;
    solution: Sudoku;
    initial: Sudoku;
    solved = false;

    constructor() {
        this.solution = new Sudoku();
        this.solution.seed();
        this.solved = this.solution.solve(0, 0);
        this.display = new Sudoku(this.solution);
        this.display.generate();
        this.initial = new Sudoku(this.display);
    }

    reset = (difficulty: number = 0.56) => {
        this.solution = new Sudoku();
        this.solution.seed();
        this.solved = this.solution.solve(0, 0);
        this.display = new Sudoku(this.solution);
        this.display.difficulty = difficulty;
        this.display.generate();
        this.initial = new Sudoku(this.display);
    }

    setCell = (row: number, col: number, value: number) => {
        if (this.initial.values[row][col] === 0) {
            this.display.values[row][col] = value;
        }
    };

    check = (): number[][] => {
        const result = [
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
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.display.values[i][j] === this.solution.values[i][j] || this.display.values[i][j] === 0) {
                    result[i][j] = 1;
                }
            }
        }
        return result;
    };

    hint = () => {
        const coordinates = [];
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.display.values[i][j] === 0) {
                    coordinates.push([i, j]);
                }
            }
        }
        if (coordinates.length === 0) {
            return;
        }
        shuffle(coordinates);
        this.display.values[coordinates[0][0]][coordinates[0][1]] = this.solution.values[coordinates[0][0]][coordinates[0][1]]
    };
}
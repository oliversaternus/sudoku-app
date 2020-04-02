import React from 'react';
import { Game, State } from '../../utils/Game';
import classes from "./Field.module.css";
import clsx from 'clsx';

interface FieldProps {
    alterGameState: (state: State) => void;
    game: Game;
    gameState: State;
    size: number;
    mobile?: boolean;
}

const Field: React.FC<FieldProps> = (props) => {
    const { alterGameState, game, gameState, mobile, size } = props;

    return (
        <div
            className={classes.tableWrapper}
            style={{ height: size - 2, width: size - 2 }}
        >
            <table
                className={classes.square}
                style={{ height: size, width: size }}
            >
                <tbody>
                    {gameState.sudoku.map((row, rowIndex: number) =>
                        <tr
                            key={rowIndex}
                            className={classes.row}
                        >{
                                row.map((cell, colIndex: number) =>
                                    <td
                                        key={colIndex}
                                        className={clsx({
                                            [classes.cell]: true,
                                            [classes.selected]: cell.selected,
                                            [classes.fixed]: cell.fixed,
                                            [classes.editable]: !cell.fixed
                                        }, gameState.showCheck && !cell.fixed && cell.value && {
                                            [classes.correct]: cell.value === cell.solution,
                                            [classes.false]: cell.value !== cell.solution
                                        })}
                                        style={{ fontSize: size / 16 }}
                                        onClick={() => alterGameState(game.selectCell(cell))}
                                    >
                                        {cell.value || ''}
                                    </td>
                                )
                            }
                        </tr>)}
                </tbody>
            </table>
        </div>
    );
};

export default Field;

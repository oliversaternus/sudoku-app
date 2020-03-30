import React from 'react';
import { Game, State } from '../../utils/Game';
import classes from "./Home.module.css";
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
        <div className={classes.container}>
            <table
                className={classes.square}
            >
                <tbody className={classes.squareContent}>
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
                                            [classes.fixed]: cell.fixed
                                        }, gameState.showCheck && !cell.fixed && cell.value && {
                                            [classes.correct]: cell.value === cell.solution,
                                            [classes.false]: cell.value !== cell.solution
                                        })}
                                        style={{ fontSize: size / 16, width: size / 9, height: size / 9 }}
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

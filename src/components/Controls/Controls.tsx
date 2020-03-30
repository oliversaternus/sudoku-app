import {  IonIcon } from '@ionic/react';
import { sync, help, trash } from 'ionicons/icons'
import React from 'react';
import { Game, State } from '../../utils/Game';
import classes from "./Controls.module.css";

interface ControlsProps {
    alterGameState: (state: State) => void;
    setModalOpen: (value: boolean) => void;
    game: Game;
    gameState: State;
    mobile?: boolean;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Controls: React.FC<ControlsProps> = (props) => {
    const { alterGameState, setModalOpen, game, gameState, mobile } = props;

    return (
        <div className={classes.selectContainer}>
            <div className={classes.selectRow}>
                {
                    numbers.map(num =>
                        <div
                            key={num}
                            style={num === 1 ? { borderLeft: '1px solid #202020' } : {}}
                            onClick={() => alterGameState(game.setValue(num))}
                            className={classes.selectButton}
                        >
                            {num}
                        </div>)
                }
            </div>
            <div
                className={classes.selectRow}
                style={{ justifyContent: 'flex-start' }}
            >
                <div
                    className={classes.specialButton}
                    style={gameState.showCheck ? { backgroundColor: '#2a58a8', borderLeft: '1px solid #202020' } : { borderLeft: '1px solid #202020' }}
                    onClick={() => alterGameState(game.toggleCheck())}
                >
                    <IonIcon
                        style={{ fill: gameState.showCheck ? '#ffffff' : '#202020', width: 28, height: 28 }}
                        icon={help}
                    />
                </div>
                <div
                    className={classes.specialButton}
                    onClick={() => setModalOpen(true)}
                >
                    <IonIcon
                        className={classes.iconMid}
                        icon={sync}
                    />
                </div>
                <div
                    className={classes.specialButton}
                    onClick={() => alterGameState(game.setValue(0))}
                >
                    <IonIcon
                        className={classes.iconSmall}
                        icon={trash}
                    />
                </div>
            </div>
        </div>
    );
};

export default Controls;

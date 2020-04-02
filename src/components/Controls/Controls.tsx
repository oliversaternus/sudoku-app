import { IonIcon, IonButton } from '@ionic/react';
import { sync, help, trash } from 'ionicons/icons'
import React from 'react';
import Eraser from '../Icons/Eraser';
import Invention from '../Icons/Invention';
import { Game, State } from '../../utils/Game';
import classes from './Controls.module.css';
import clsx from 'clsx';

interface ControlsProps {
    alterGameState: (state: State) => void;
    setModalOpen: (value: boolean) => void;
    game: Game;
    gameState: State;
    mobile?: boolean;
    width: number;
    height: number;
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const Controls: React.FC<ControlsProps> = (props) => {
    const { alterGameState, setModalOpen, game, gameState, mobile, height, width } = props;

    return (
        <div className={clsx(classes.selectContainer, mobile && classes.selectContainerMobile)} style={{ height, width }}>
            <IonButton onClick={() => setModalOpen(true)} color="primary" style={{ width: '100%' }} >New Game</IonButton>
            <div className={clsx(classes.selectNum, mobile && classes.selectNumMobile)}>
                {
                    numbers.map(num =>
                        <div
                            key={num}
                            onClick={() => alterGameState(game.setValue(num))}
                            style={
                                {
                                    ...(num === 1 && mobile ? { borderLeft: '1px solid #a0a7af' } : {}),
                                    ...((num - 1) % 3 === 0 && !mobile ? { borderLeft: '1px solid #a0a7af' } : {}),
                                    ...(num < 7 && !mobile ? { borderBottom: 'none' } : {}),
                                    ...(mobile ? { width: Math.floor(width / 9), height: Math.floor(width / 9) } : {})
                                }}
                            className={clsx(classes.selectButton, mobile && classes.selectButtonMobile)}
                        >
                            {num}
                        </div>)
                }
            </div>
            <div
                className={mobile ? classes.buttonRowMobile : classes.buttonRow}
            >
                <IonButton color="secondary" style={{ width: '50%' }} onClick={() => alterGameState(game.toggleCheck())}>
                    <Invention className={classes.iconSmall} style={gameState.showCheck ? { fill: '#ffb133' } : {}} />
                </IonButton>
                <IonButton color="secondary" style={{ width: '50%' }} onClick={() => alterGameState(game.setValue(0))}>
                    <Eraser style={{ width: 22, height: 22 }} className={classes.iconSmall} />
                </IonButton>
            </div>
        </div >
    );
};

export default Controls;

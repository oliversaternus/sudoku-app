import { IonIcon, IonModal } from '@ionic/react';
import { close, star } from 'ionicons/icons'
import React from 'react';
import { Game, State } from '../../utils/Game';
import classes from "./Modal.module.css";

interface ModalProps {
    alterGameState: (state: State) => void;
    game: Game;
    open: boolean;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = (props) => {
    const { alterGameState, game, open, onClose } = props;

    const newGame = (difficulty: number) => () => {
        alterGameState(game.reset(difficulty));
        onClose();
    };

    return (
        <IonModal isOpen={open}>
            <div className={classes.modalContent}>
                <IonIcon
                    className={classes.modalClose}
                    icon={close}
                    onClick={() => onClose()}
                />
                <div className={classes.modalTitle}>Select Difficulty</div>
                <div className={classes.modalDifficulty} onClick={newGame(0.44)}>
                    <div className={classes.starContainer}>
                        <IonIcon icon={star} />
                    </div>
                    {'Easy'}
                </div>
                <div className={classes.modalDifficulty} onClick={newGame(0.56)}>
                    <div className={classes.starContainer}>
                        <IonIcon icon={star} />
                        <IonIcon icon={star} />
                    </div>
                    {'Medium'}
                </div>
                <div className={classes.modalDifficulty} onClick={newGame(0.9)}>
                    <div className={classes.starContainer}>
                        <IonIcon icon={star} />
                        <IonIcon icon={star} />
                        <IonIcon icon={star} />
                    </div>
                    {'Hard'}
                </div>
            </div>
        </IonModal>
    );
};

export default Modal;

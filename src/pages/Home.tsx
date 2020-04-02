import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Game, State } from '../utils/Game';
import classes from "./Home.module.css";
import Field from '../components/Field/Field';
import Controls from '../components/Controls/Controls';
import clsx from 'clsx';

const game = new Game();

const roundSize = (num: number) => {
  console.log(Math.floor(num / 4) * 4);
  return Math.floor(num / 4) * 4;
};

const Home: React.FC = () => {
  const [gameState, setGameState] = useState(game.state);
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight - 56 });
  const [modalOpen, setModalOpen] = useState(false);
  const mobile = size.width < 720;

  const onResize = () => {
    setSize({ width: window.innerWidth, height: window.innerHeight - 56 });
  };
  const alterGameState = (state: State) => {
    localStorage.setItem('sudokuGameState', JSON.stringify(state));
    setGameState(state);
  };
  const newGame = (difficulty: number) => () => {
    alterGameState(game.reset(difficulty));
    setModalOpen(false);
};

  useEffect(() => window.addEventListener('resize', onResize), []);
  useEffect(() => () => window.removeEventListener('resize', onResize), []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Sudoku</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={clsx(classes.content, mobile ? classes.mobile : classes.fullscreen)}>
          <Field
            game={game}
            gameState={gameState}
            alterGameState={alterGameState}
            size={roundSize(mobile ? (size.width < 385 ? size.width - 24 : 360) : 448)}
            mobile={mobile}
          />
          <Controls
            game={game}
            gameState={gameState}
            alterGameState={alterGameState}
            setModalOpen={setModalOpen}
            mobile={mobile}
            width={mobile ? (size.width < 385 ? size.width - 24 : 360) : 180}
            height={mobile ? 148 : 448}
          />
          <IonAlert
            isOpen={modalOpen}
            onDidDismiss={() => setModalOpen(false)}
            header={'New Game'}
            message={'Select the difficulty level for the new Sudoku.'}
            mode="md"
            buttons={[
                {
                    text: 'Easy',
                    handler: newGame(0.44)
                },
                {
                    text: 'Medium',
                    handler: newGame(0.56)
                },
                {
                    text: 'Hard',
                    handler: newGame(0.9)
                }
            ]} />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

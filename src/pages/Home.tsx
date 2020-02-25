import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonModal } from '@ionic/react';
import { sync, help, trash, close } from 'ionicons/icons'
import React, { useEffect, useState } from 'react';
import { Game, State } from '../utils/Game';
import classes from "./Home.module.css";
import clsx from 'clsx';

const game = new Game();

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const calcFieldDimension = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  let result = height - 200;
  if (width < (height - 170)) {
    result = width - 32;
  }
  return result > 480 ? 480 : result;
}

const Home: React.FC = () => {
  const [gameState, setGameState] = useState(game.state);
  const [maxSize, setMaxSize] = useState(calcFieldDimension());
  const [modalOpen, setModalOpen] = useState(false);

  const onResize = () => { setMaxSize(calcFieldDimension()) };
  const alterGameState = (state: State) => {
    localStorage.setItem('sudokuGameState', JSON.stringify(state));
    setGameState(state);
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
                        style={{ fontSize: maxSize / 16, width: maxSize / 9, height: maxSize / 9 }}
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
        <IonModal isOpen={modalOpen}>
          <div className={classes.modalContent}>
            <IonIcon
              className={classes.modalClose}
              icon={close}
              onClick={() => setModalOpen(false)}
            />
            <div className={classes.modalTitle}>New Sudoku</div>
            <div className={classes.modalDifficulty} onClick={() => { alterGameState(game.reset(0.44)); setModalOpen(false); }}>Easy</div>
            <div className={classes.modalDifficulty} onClick={() => { alterGameState(game.reset(0.56)); setModalOpen(false); }}>Medium</div>
            <div className={classes.modalDifficulty} onClick={() => { alterGameState(game.reset(0.9)); setModalOpen(false); }}>Hard</div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;

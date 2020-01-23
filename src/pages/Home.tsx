import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { sync, close, help } from 'ionicons/icons'
import React, { useEffect, useState } from 'react';
import { Game } from '../utils/Game';
import classes from "./Home.module.css";
import clsx from 'clsx';

const game = new Game();

console.log(game.state);

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

  const onResize = () => { setMaxSize(calcFieldDimension()) };

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
          <div
            className={classes.square}
            style={{ width: maxSize - 2, height: maxSize - 2 }}
          >
            {gameState.sudoku.map((row, rowIndex: number) =>
              <div
                key={rowIndex}
                className={classes.row}
                style={rowIndex && (rowIndex % 3 === 0) ? { marginTop: 2.5 } : {}}
              >{
                  row.map((cell, colIndex: number) =>
                    <div
                      key={colIndex}
                      className={clsx({
                        [classes.cell]: true,
                        [classes.selected]: cell.selected,
                        [classes.fixed]: cell.fixed
                      }, gameState.showCheck && !cell.fixed && cell.value && {
                        [classes.correct]: cell.value === cell.solution,
                        [classes.false]: cell.value !== cell.solution
                      })}
                      style={colIndex && (colIndex % 3 === 0) ? { marginLeft: 2.5, fontSize: maxSize / 16 } : { fontSize: maxSize / 16 }}
                      onClick={() => setGameState(game.selectCell(cell))}
                    >
                      {cell.value || ''}
                    </div>
                  )
                }
              </div>)}
          </div>
        </div>
        <div className={classes.selectContainer}>
          <div className={classes.selectRow}>
            {
              numbers.map(num =>
                <div
                  key={num}
                  onClick={() => setGameState(game.setValue(num))}
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
              className={classes.selectButton}
              style={{ position: 'absolute', right: 6, top: 6 }}
              onClick={() => setGameState(game.setValue(0))}
            >
              <IonIcon
                className={classes.iconSmall}
                icon={close}
              />
            </div>
            <div
              className={classes.selectButton}
              onClick={() => setGameState(game.reset())}
            >
              <IonIcon
                className={classes.iconMid}
                icon={sync}
              />
            </div>
            <div
              className={classes.selectButton}
              style={gameState.showCheck ? { backgroundColor: '#2a58a8' } : {}}
              onClick={() => setGameState(game.toggleCheck())}
            >
              <IonIcon
                style={{ fill: gameState.showCheck ? '#ffffff' : '#202020', width: 28, height: 28 }}
                icon={help}
              />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

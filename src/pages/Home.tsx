import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { sync, close, help } from 'ionicons/icons'
import React, { useEffect, useState } from 'react';
import { Game, State } from '../utils/Game';
import classes from "./Home.module.css";

const styles: any = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100% - 114px)',
    backgroundColor: '#e8eff3'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'calc((100% - 5px) / 9)'
  },
  cell: {
    width: 'calc((100% - 5px) / 9 - 1px)',
    height: 'calc(100% - 1px)',
    margin: 0.5,
    border: '0px solid black',
    color: 'black',
    transition: 'all 0.225s linear',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  correct: {
    backgroundColor: 'green',
    color: '#ffffff'
  },
  false: {
    backgroundColor: 'red',
    color: '#ffffff'
  },
  selected: {
    backgroundColor: '#3880ff',
    color: '#ffffff'
  },
  fixed: {
    cursor: 'auto',
    backgroundColor: '#d8e2f0'
  },
  square: {
    backgroundColor: 'black',
    boxShadow: '0px 0px 12px rgba(0,0,0,0.7)'
  },
  selectContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 114,
    backgroundColor: '#3880ff',
    boxShadow: '0px 0px 4px rgba(0,0,0,0.48)',
    display: 'flex',
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  selectRow: {
    width: '100%',
    maxWidth: 396,
    display: 'flex',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'relative'
  },
  selectButton: {
    width: 40,
    height: 40,
    margin: 2,
    fontSize: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    cursor: 'pointer'
  }
};

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
          <div style={{ ...styles.square, width: maxSize - 2, height: maxSize - 2, padding: 1, paddingRight: 0.5, paddingLeft: 1.5 }}>
            {gameState.sudoku.map((row, rowIndex: number) => {
              const rowStyle = rowIndex && (rowIndex % 3 === 0) ? { ...styles.row, marginTop: 2.5 } : styles.row;
              return (
                <div key={rowIndex} style={rowStyle}>{
                  row.map((cell, colIndex: number) => {
                    const isCorrect = cell.value === cell.solution;
                    let cellStyle = gameState.selected === cell ? { ...styles.cell, ...styles.selected } : styles.cell;
                    cellStyle = cell.fixed ? { ...cellStyle, ...styles.fixed } : cellStyle;
                    cellStyle = colIndex && (colIndex % 3 === 0) ? { ...cellStyle, marginLeft: 2.5 } : cellStyle;
                    cellStyle = (cell.value && !cell.fixed && gameState.showCheck) ? (isCorrect ? { ...cellStyle, ...styles.correct } : { ...cellStyle, ...styles.false }) : cellStyle;
                    return (
                      <div key={colIndex} style={{ ...cellStyle, fontSize: maxSize / 16 }} onClick={() => setGameState(game.selectCell(cell))}>
                        {cell.value || ''}
                      </div>)
                  })}
                </div>)
            })}
          </div>
        </div>
        <div className={classes.selectContainer}>
          <div className={classes.selectRow}>
            {
              numbers.map(num =>
                <div key={num} onClick={() => setGameState(game.setValue(num))} style={styles.selectButton}>
                  {num}
                </div>)
            }
          </div>
          <div style={{ ...styles.selectRow, justifyContent: 'flex-start' }}>
            <div style={{ ...styles.selectButton, position: 'absolute', right: 6, top: 6 }} onClick={() => setGameState(game.setValue(0))}>
              <IonIcon style={{ fill: '#202020', width: 28, height: 28 }} icon={close} />
            </div>
            <div onClick={() => setGameState(game.reset())} style={styles.selectButton}>
              <IonIcon style={{ fill: '#202020', width: 32, height: 32 }} icon={sync} />
            </div>
            <div style={{ ...styles.selectButton, ...(gameState.showCheck ? { backgroundColor: '#2a58a8' } : {}) }} onClick={() => setGameState(game.toggleCheck())}>
              <IonIcon style={{ fill: gameState.showCheck ? '#ffffff' : '#202020', width: 28, height: 28 }} icon={help} />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

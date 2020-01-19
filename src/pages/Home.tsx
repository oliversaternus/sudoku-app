import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Game } from '../utils/Game';

const styles: any = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    width: 'calc(100% - 2px)',
    height: 'calc(100% / 9)'
  },
  cell: {
    width: 'calc(100% / 9)',
    height: '100%',
    border: '1px solid black',
    color: 'black',
    transition: 'all 0.225s linear',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  selected: {
    backgroundColor: 'lightblue'
  },
  fixed: {
    cursor: 'auto'
  }
};

const game = new Game();

const calcFieldDimension = () => {
  const height = window.innerHeight;
  const width = window.innerWidth;
  if (width < (height - 56)) {
    return width - 32;
  }
  return height - 88;
}

const setField = (row: number, col: number, value: number): number[][] => {
  game.setCell(row, col, value);
  return game.display.values;
}

const Square: React.FC<{ size: number }> = (props) => {
  return (
    <div style={{ width: props.size, height: props.size }}>
      {props.children}
    </div>);
}

const Home: React.FC = () => {
  const [fields, setFields] = useState(game.display.values);
  const [selected, setSelected] = useState([-1, -1]);
  const [maxSize, setMaxSize] = useState(calcFieldDimension());

  const onResize = () => { setMaxSize(calcFieldDimension()) };

  useEffect(() => window.addEventListener('resize', onResize), []);
  useEffect(() => () => window.removeEventListener('resize', onResize), []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sudoku</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={styles.container}>
          <Square size={maxSize}>
            {fields.map((row, rowIndex: number) =>
              <div key={rowIndex} style={styles.row}>{
                row.map((cell, colIndex: number) => {
                  const isFixed = game.initial.values[rowIndex][colIndex] !== 0;
                  const isSelected = rowIndex === selected[0] && colIndex === selected[1];
                  let cellStyle = isSelected ? { ...styles.cell, ...styles.selected } : styles.cell;
                  cellStyle = isFixed ? { ...cellStyle, ...styles.fixed } : cellStyle;
                  return (
                    <div key={colIndex} style={{ ...cellStyle, fontSize: maxSize / 16 }} onClick={() => !isFixed && setSelected([rowIndex, colIndex])}>
                      {cell || ''}
                    </div>)
                })
              }</div>)}
          </Square>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

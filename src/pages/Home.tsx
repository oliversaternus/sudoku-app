import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { sync, undo, help } from 'ionicons/icons'
import React, { useEffect, useState } from 'react';
import { Game } from '../utils/Game';

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
    display: 'flex',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'flex-end'
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
  if (width < (height - 170)) {
    return width - 32;
  }
  return height - 200;
}

const setField = (row: number, col: number, value: number): number[][] => {
  if (row === -1 || col === -1) {
    return game.display.values;
  }
  game.setCell(row, col, value);
  return game.display.values;
}

const reset = (): number[][] => {
  game.reset();
  return game.display.values;
}

const Square: React.FC<{ size: number }> = (props) => {
  return (
    <div style={{ ...styles.square, width: props.size - 2, height: props.size - 2, padding: 1, paddingRight: 0.5, paddingLeft: 1.5 }}>
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
        <IonToolbar color="primary">
          <IonTitle>Sudoku</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={styles.container}>
          <Square size={maxSize}>
            {fields.map((row, rowIndex: number) => {
              const rowStyle = rowIndex && (rowIndex % 3 === 0) ? { ...styles.row, marginTop: 2.5 } : styles.row;
              return (
                <div key={rowIndex} style={rowStyle}>{
                  row.map((cell, colIndex: number) => {
                    const isFixed = game.initial.values[rowIndex][colIndex] !== 0;
                    const isSelected = rowIndex === selected[0] && colIndex === selected[1];
                    let cellStyle = isSelected ? { ...styles.cell, ...styles.selected } : styles.cell;
                    cellStyle = isFixed ? { ...cellStyle, ...styles.fixed } : cellStyle;
                    cellStyle = colIndex && (colIndex % 3 === 0) ? { ...cellStyle, marginLeft: 2.5 } : cellStyle;
                    return (
                      <div key={colIndex} style={{ ...cellStyle, fontSize: maxSize / 16 }} onClick={() => !isFixed && setSelected([rowIndex, colIndex])}>
                        {cell || ''}
                      </div>)
                  })}
                </div>)
            })}
          </Square>
        </div>
        <div style={styles.selectContainer}>
          <div style={styles.selectRow}>
            {
              numbers.map(num =>
                <div key={num} onClick={() => setFields([...setField(selected[0], selected[1], num)])} style={styles.selectButton}>
                  {num}
                </div>)
            }
          </div>
          <div style={{ ...styles.selectRow, justifyContent: 'flex-end' }}>
            <div onClick={() => { setSelected([-1, -1]); setFields([...reset()]) }} style={styles.selectButton}>
              <IonIcon style={{ fill: '#202020', width: 32, height: 32 }} icon={sync} />
            </div>
            <div style={styles.selectButton}>
              <IonIcon style={{ fill: '#202020', width: 28, height: 28 }} icon={undo} />
            </div>
            <div style={styles.selectButton}>
              <IonIcon style={{ fill: '#202020', width: 28, height: 28 }} icon={help} />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

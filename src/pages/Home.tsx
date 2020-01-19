import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';
import { Game } from '../utils/Sudoku';

const sudoku = new Game();

const setField = (row: number, col: number, value: number): number[][] => {
  sudoku.display.values[row][col] = value;
  return sudoku.display.values;
}

const Home: React.FC = () => {
  const [fields, setFields] = useState(sudoku.display.values);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sudoku</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {JSON.stringify(fields, null, 4)}
      </IonContent>
    </IonPage>
  );
};

export default Home;

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { Sudoku } from '../utils/Sudoku';

const sudoku = new Sudoku();
console.log(sudoku.solution.values);
console.log(sudoku.display.values);
console.log(sudoku.display.filled());


const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sudoku</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        This is a Sudoku App.
      </IonContent>
    </IonPage>
  );
};

export default Home;

import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { CameraResultType, Plugins } from '@capacitor/core';
import { OCR, OCRSourceType, OCRResult } from '@ionic-native/ocr';

import { createWorker } from 'tesseract.js';
import image from '../original.jpg';

//declare var mltext: any;

const { Camera } = Plugins;

const Home: React.FC = () => {
  const worker = createWorker({
    logger: m => console.log(m),
  });

  const doOCR = async (photo: any) => {
    try {
      //alert(photo.webPath);
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(photo.webPath);
      //alert(text);
      setOcr(text as any);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  // const doOCR2 = (photo: any) => {
  //   mltext.getText((recognizedText: any) => {
  //     alert(recognizedText.blocks.blocktext);
  //     setOcr(recognizedText.blocks.blocktext);
  //   }, (message: any) => {
  //     alert('Failed because: ' + message);
  //   }, {imgType : 0, imgSrc : photo.webPath});
  // }

  const doOCR3 = (photo: any) => {
    OCR.recText(OCRSourceType.NORMFILEURL, photo.path)
    .then((res: OCRResult) => {
      //alert(res.blocks.blocktext);
      setOcr(res.lines.linetext as any);
    })
    .catch((error: any) => alert(error));
  }


  const [ocr, setOcr] = useState(['Recognizing...']);
  const [image, setImage] = useState('');

  const handleOpenCamera = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri
    });
    setImage(photo.webPath as any);
    doOCR3(photo);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        {ocr && ocr.map((line) => <p>{line}</p>)}
        {image && <img src={image}/>}
        <IonButton onClick={handleOpenCamera}>Open Camera</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Home;

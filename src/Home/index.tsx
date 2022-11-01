import { useState, useEffect, useRef } from 'react';
import { Camera,CameraType, } from 'expo-camera'
import { Image, SafeAreaView, ScrollView, TextInput, TouchableOpacity, View, Text } from 'react-native';
import {captureRef} from 'react-native-view-shot'
import * as Sharing from 'expo-sharing'


import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PositionChoice } from '../components/PositionChoice';

import { styles } from './styles';
import { POSITIONS, PositionProps } from '../utils/positions';

export function Home() {
  const [photo, setPhotoURI] = useState<null | string>(null)
  const [positionSelected, setPositionSelected] = useState<PositionProps>(POSITIONS[0]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

const cameraRef = useRef<Camera>(null);
const screenShotRef = useRef(null);

async function handleTakePicture(){
  const photo = await cameraRef.current.takePictureAsync();1
  setPhotoURI(photo.uri)
}

async function shareScreenShot(){
  const screenShot = await captureRef(screenShotRef)
  await Sharing.shareAsync("file://" + screenShot)
}

useEffect(()=>{
Camera.requestCameraPermissionsAsync().then(res => setHasCameraPermission(res.granted))
},[])



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.sticker }ref={screenShotRef}>
          <Header position={positionSelected} />

          <View style={styles.picture}>

{ 
            hasCameraPermission && !photo ?  <Camera
            ref={cameraRef}
            type={CameraType.front}
            style={styles.camera}
            ratio={'1:1'}
            />:
            <Image source={{ uri: photo ? photo : 'https://preview.redd.it/zcgs03lgoy351.png?width=288&format=png&auto=webp&s=d9bf4b46713d7fdbf11b82a8e364ceee79724a9c' }} 
            style={styles.camera} 
            onLoad={shareScreenShot}
            />
}
            <View style={styles.player}>
              <TextInput
                placeholder="Digite seu nome aqui"
                style={styles.name}
              />
            </View>
          </View>
        </View>

        <PositionChoice
          onChangePosition={setPositionSelected}
          positionSelected={positionSelected}
        />
        <TouchableOpacity onPress={()=>setPhotoURI(null)}>
          <Text style={styles.retry}>Nova Foto</Text>
        </TouchableOpacity>

        <Button title="Compartilhar" onPress={handleTakePicture}/>
      </ScrollView>
    </SafeAreaView>
  );
}
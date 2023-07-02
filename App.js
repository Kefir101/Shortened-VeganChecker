import * as React from "react";
import { OCR, parse } from "./helperFunctions";
import { StyleSheet, Text, View, Button} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
export default function App() {

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }
  let takePic = async () => {
    let options = {
      quality: 0.4,
      base64: true,
      exif: false
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    const OCRoutput = await OCR(newPhoto.base64);
    //ERROR in parse function (one line function)
    const score_ADI_BoxOutline = await parse(OCRoutput[0].text);
  };
  return (
    <>
      <Camera style={styles.container} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Button color='green' title="Take Pic" onPress={takePic} />
        </View>
        <StatusBar style="auto" />
      </Camera>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    position: 'absolute',
    top: 15,
    marginRight: 'auto',
    left: 12,
    width: 52,
    height: 52,
  },
  buttonContainer: {
    backgroundColor: '#fff',
    width: 100,
    borderRadius: 100,
    bottom: 11
  },
});
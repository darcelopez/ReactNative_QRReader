/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import Animated, {
//   useAnimatedProps,
//   useSharedValue,
// } from 'react-native-reanimated';

import React, { useEffect, useRef, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
} from 'react-native-vision-camera';

import DropDownPicker from 'react-native-dropdown-picker';

// import { scanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';

// const AnimatedText = Animated.createAnimatedComponent(TextInput);


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const camera = useRef(null);
  const [cameraPermission, setCameraPermission] = useState();
  const [open, setOpen] = useState(false);
  const [currentExample, setCurrentExample] = useState('take-photo');
  const [photoPath, setPhotoPath] = useState();
  const [snapshotPath, setSnapshotPath] = useState();
  // const [videoPath, setVideoPath] = useState();
  // const detectorResult = useSharedValue('');

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermission();
      setCameraPermission(cameraPermissionStatus);
      console.log('setCameraPermission -> ', cameraPermissionStatus);
    })();
  }, []);

  const devices = useCameraDevices();
  const cameraDevice = devices.front;

  // const frameProcessor = useFrameProcessor(frame => {
  //   'worklet';
  //   const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
  //   const barcodesStr = detectedBarcodes
  //     .map(barcode => barcode.displayValue)
  //     .join('');
  //   console.log('Barcodes:', barcodesStr);
  //   detectorResult.value = barcodesStr;
  // }, [])

  
  // const animatedTextProps = useAnimatedProps(
  //   () => ({ text: detectorResult.value }),
  //   [detectorResult.value],
  // );

  const handleChangePicketSelect = value => {
    console.log('handleChangePicketSelect...');
    console.log(value);
    setPhotoPath(null);
    setSnapshotPath(null);
    // setVideoPath(null);
    setCurrentExample(value);
  };

  // Photos
  const handleTakePhoto = async () => {
    try {
      console.log('handleTakePhoto....')
      const photo = await camera.current.takePhoto({
        flash: 'on',
      });
      console.log(photo);
      console.log(photo.path);
      setPhotoPath(photo.path);
    } catch (e) {
      console.log(e);
    }
  };

  const renderTakingPhoto = () => {
    return (
      <View>
        <Camera
          ref={camera}
          style={[styles.camera, styles.photoAndVideoCamera]}
          device={cameraDevice}
          isActive
          photo
        />
        <TouchableOpacity style={styles.btn} onPress={handleTakePhoto}>
          <Text style={styles.btnText}>Take Photo</Text>
        </TouchableOpacity>
        {photoPath && (
          <Image style={styles.image} source={{ uri: photoPath }} />
        )}
      </View>
    );
  };

  // SnapShoot
  const handleTakeSnapshot = async () => {
    try {
      const snapshot = await camera.current.takeSnapshot({
        quality: 85,
        skipMetadata: true,
      });
      setSnapshotPath(snapshot.path);
    } catch (e) {
      console.log(e);
    }
  };

  const renderTakingSnapshot = () => {
    return (
      <View>
        <Camera
          ref={camera}
          style={[styles.camera, styles.photoAndVideoCamera]}
          device={cameraDevice}
          isActive
          photo
        />
        <TouchableOpacity style={styles.btn} onPress={handleTakeSnapshot}>
          <Text style={styles.btnText}>Take Snapshot</Text>
        </TouchableOpacity>
        {snapshotPath && (
          <Image style={styles.image} source={{ uri: snapshotPath }} />
        )}
      </View>
    );
  };

  // Code Scanner
  // const renderCodeScanner = () => {
  //   return (
  //     <View>
  //       <Camera
  //         style={styles.camera}
  //         device={cameraDevice}
  //         isActive
  //         frameProcessor={frameProcessor}
  //         frameProcessorFps={5}
  //       />
  //       <AnimatedText
  //         style={styles.barcodeText}
  //         animatedProps={animatedTextProps}
  //         editable={false}
  //         multiline
  //       />
  //     </View>
  //   );
  // };


  const renderContent = () => {
    if (cameraDevice == null) {
      return <ActivityIndicator size="large" color="#1C6758" />;
    }
    if (cameraPermission !== 'authorized') {
      return null;
    }
    switch (currentExample) {
      case 'take-photo':
        return renderTakingPhoto();
      // case 'record-video':
      //   return renderRecordingVideo();
      case 'take-snapshot':
        return renderTakingSnapshot();
      // case 'code-scanner':
      //   return renderCodeScanner();
      default:
        return null;
    }
  };
  

  if (cameraDevice == null) return <View><Text>Loading camera</Text></View>


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View style={styles.screen}>
    <SafeAreaView style={styles.saveArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>React Native Camera Libraries</Text>
      </View>
    </SafeAreaView>

    <View style={styles.caption}>
      <Text style={styles.captionText}>
        Welcome To React-Native-Vision-Camera Tutorial
      </Text>
    </View>

    <View style={styles.dropdownPickerWrapper}>
      <DropDownPicker
        open={open}
        value={currentExample}
        items={[
          { label: 'Take Photo', value: 'take-photo' },
          // { label: 'Record Video', value: 'record-video' },
          { label: 'Take Snapshot', value: 'take-snapshot' },
          // { label: 'Code Scanner', value: 'code-scanner' },
        ]}
        setOpen={setOpen}
        setValue={handleChangePicketSelect}
      />
    </View>

    {renderContent()}
  </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textblock:{
    marginTop: 32,
    marginBottom: 32,
    paddingVertical: 24,
    paddingBottom: 50
  },

  screen: {
    flex: 1,
    backgroundColor: '#EEF2E6',
  },
  saveArea: {
    backgroundColor: '#3D8361',
  },
  header: {
    height: 50,
    backgroundColor: '#3D8361',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 20,
  },
  caption: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionText: {
    color: '#100F0F',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    height: 460,
    width: '92%',
    alignSelf: 'center',
  },
  photoAndVideoCamera: {
    height: 360,
  },
  barcodeText: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    textAlign: 'center',
    color: '#100F0F',
    fontSize: 24,
  },
  pickerSelect: {
    paddingVertical: 12,
  },
  image: {
    marginHorizontal: 16,
    paddingTop: 8,
    width: 80,
    height: 80,
  },
  dropdownPickerWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 9,
  },
  btnGroup: {
    margin: 16,
    flexDirection: 'row',
  },
  btn: {
    backgroundColor: '#63995f',
    margin: 13,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
  video: {
    marginHorizontal: 16,
    height: 100,
    width: 80,
    position: 'absolute',
    right: 0,
    bottom: -80,
  },
});

export default App;

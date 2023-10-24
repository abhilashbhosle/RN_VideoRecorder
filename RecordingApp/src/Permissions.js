import { Platform,Alert, Linking } from "react-native";
import { request, PERMISSIONS,check, openSettings,RESULTS } from 'react-native-permissions';

export const requestPermissions=async()=>{
    if (Platform.OS === 'android') {
        await request(PERMISSIONS.ANDROID.CAMERA);
        await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      } else {
        await request(PERMISSIONS.IOS.CAMERA);
        await request(PERMISSIONS.IOS.MICROPHONE);
      }
}
export const checkCameraAndMicrophonePermissions = async () => {
    const cameraPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;
    const microphonePermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.RECORD_AUDIO : PERMISSIONS.IOS.MICROPHONE;
  
    const [cameraStatus, microphoneStatus] = await Promise.all([
      check(cameraPermission),
      check(microphonePermission),
    ]);
  
    if (cameraStatus === RESULTS.GRANTED && microphoneStatus === RESULTS.GRANTED) {
     return true
    } else {
      // Permissions are not granted.
      console.log('Camera and microphone permissions are not granted.');
  
      Alert.alert(
        'App might be missing few required permissions',
        'This app requires access to the camera and microphone for recording.',
        [
          {
            text: 'Open Settings',
            onPress: () => {
              openSettings()
            },
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Permission denied'),
          },
        ],
      );
    }
  };
  


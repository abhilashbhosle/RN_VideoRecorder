import { View, Text, Button, ImageBackground, useWindowDimensions, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { checkCameraAndMicrophonePermissions, requestPermissions } from './Permissions'
import { Camera, useCameraDevice } from 'react-native-vision-camera'
import VideoScreen from './Video'
import { navigateToTrimmer } from "react-native-k4l-video-trimmer";

export default function Home() {
    const camRef = useRef(null)
    const window = useWindowDimensions()
    const [recording, setRecording] = useState(false)
    const [cameraPosition, setCameraPosition] = useState('front');
    const devices = useCameraDevice(cameraPosition);
    const [video, setVideo] = useState(null)

    // ======ASKING FOR CAMERA/MICROPHONE PERMISSIONS=======//
    useEffect(() => {
        requestPermissions()
    }, [])

    const startRecord = async () => {
        // =======CHECK WHETHER PERMISSIONS GRANTED OR DENIED======//
        let checkPermission = await checkCameraAndMicrophonePermissions()
        if (checkPermission) {
            try {
                setRecording(true)
                camRef.current.startRecording({
                    onRecordingFinished: (video) => setVideo(video),
                    onRecordingError: (error) => console.error(error)
                })
            } catch (error) {
                throw error
            }
        }
    }
    const stopRecord = async () => {
        console.log('entered in stop record')
        setRecording(false);
        await camRef.current.stopRecording()
    };
    console.log(video)
    return (
        <ImageBackground source={require('./assets/homebg.jpg')}
            style={{
                ...styles.bg, height: window.height,
                width: window.width,
            }}
        >
            {
                !video ?
                    <>
                        <Camera style={{
                            height: recording ? window.height - 80 : 0,
                            width: window.width
                        }}
                            ref={camRef}
                            video={true}
                            audio={true}
                            device={devices}
                            isActive={recording}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                title={recording ? "Stop Recording" : "Start Recording"}
                                color="#333"
                                onPress={recording ? stopRecord : startRecord}
                            />
                            <Button
                                title='FlipCam'
                                color="#666"
                                onPress={() => {
                                    if (cameraPosition == 'front') {
                                        setCameraPosition('back')
                                    } else {
                                        setCameraPosition('front')
                                    }
                                }}
                            />

                        </View>
                    </>
                    :
                    <View style={{position:'absolute',top:20,left:20}}>
                    <VideoScreen videoPath={video.path} />
                    <View style={{position:'absolute',right:50}}>
                    <Button
                                title='close'
                                color="#666"
                                onPress={() => {
                                    setVideo(null)
                                }}
                            />
                            </View>
                    </View>
            }

        </ImageBackground>
    )
}
const styles = StyleSheet.create({
    bg: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 50
    },
})
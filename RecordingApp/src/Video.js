import React from 'react'
import Video from 'react-native-video';
import { useWindowDimensions } from 'react-native';

export default function VideoScreen({videoPath}) {
  const window=useWindowDimensions()
  return (
    <Video source={{uri: videoPath}}
    style={{width:window.width,height:window.height}} 
    />
  )
}
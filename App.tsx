import React, {useRef, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  RNSvgaPlayer,
  SvgaPlayerRef,
  SvgaErrorEvent,
} from 'react-native-svga-player';
const App = () => {
  const svgaPlayerRef = useRef<SvgaPlayerRef>(null);
  //播放网络资源
  const [source, setSource] = useState(
    'https://raw.githubusercontent.com/yyued/SVGAPlayer-iOS/master/SVGAPlayer/Samples/Goddess.svga',
  );
  //播放本地资源
  // const [source, setSource] = useState(
  //   'homePage_studyPlanner_computer_welcome.svga',
  // );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Svga</Text>
        <RNSvgaPlayer
          ref={svgaPlayerRef}
          source={source}
          autoPlay={true}
          loops={0} // 循环次数，默认 0无限循环
          clearsAfterStop={false} // 停止后清空画布，默认 true
          style={styles.svgaStyle}
          onFinished={() => {
            console.log('播放完成');
          }} // 播放完成回调
          onLoaded={() => {
            console.log('动画加载完成');
          }}
          onError={(event: SvgaErrorEvent) => {
            console.error('播放错误:', event.error); // 播放错误回调
          }} // 播放错误回调
          onFrame={event => {
            console.log('当前帧:', event.value); // 帧变化回调
          }}
          onPercentage={event => {
            console.log('当前百分比:', event.value); // 百分比变化回调
          }}
        />
        <View style={styles.flexAround}>
          <Button
            title="开始动画"
            onPress={() => {
              svgaPlayerRef.current?.startAnimation();
            }}
          />
          <Button
            title="暂停动画"
            onPress={() => {
              svgaPlayerRef.current?.pauseAnimation();
            }}
          />
          <Button
            title="停止动画"
            onPress={() => {
              svgaPlayerRef.current?.stopAnimation();
            }}
          />
        </View>
        <View style={[styles.flexAround, {marginTop: 20}]}>
          <Button
            title="手动加载动画"
            onPress={() => {
              setSource('homePage_studyPlanner_computer_welcome.svga');
            }}
          />
          <Button
            title="指定帧开始"
            onPress={() => {
              svgaPlayerRef.current?.stepToFrame(140, true);
            }}
          />
          <Button
            title="指定百分比开始"
            onPress={() => {
              svgaPlayerRef.current?.stepToPercentage(0.4, true);
            }}
          />
        </View>
        <View style={[styles.flexAround, {marginTop: 20}]}>
          <Button
            title="指定范围内开始播放，可选择反向播放"
            onPress={() => {
              svgaPlayerRef.current?.startAnimationWithRange(10, 30, false); // 从第10帧播放30帧，正向
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default App;
const styles = StyleSheet.create({
  flexAround: {flexDirection: 'row', justifyContent: 'space-around'},
  container: {
    flex: 1,
  },
  svgaStyle: {
    width: 150,
    height: 150,
    marginTop: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    marginTop: 80,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

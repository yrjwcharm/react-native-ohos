import React, {useRef} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNSvgaPlayer from 'react-native-svga-player';
const files = ['Goddess', 'Rocket', 'heartbeat', 'rose_2.0.0'];
const App = () => {
  const svgaPlayerRef = useRef<RNSvgaPlayer>(null);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.welcome}>Svga</Text>
        <View style={styles.container}>
          {files.map(f => (
            <View key={f} style={styles.containerW}>
              <RNSvgaPlayer
                style={{width: 150, height: 150}}
                source={`https://raw.githubusercontent.com/yyued/SVGAPlayer-iOS/master/SVGAPlayer/Samples/${f}.svga`}
              />
              <Text>{f}</Text>
            </View>
          ))}
        </View>
        {/* 播放本地资源： tips:注意 ios svga动画不需要后缀名 harmony和android都需要*/}
        <RNSvgaPlayer
          ref={svgaPlayerRef}
          style={styles.localSvga}
          source={
            Platform.OS === 'ios'
              ? 'homePage_studyPlanner_computer_welcome'
              : 'homePage_studyPlanner_computer_welcome.svga'
          }
          onFinished={() => {
            console.log('onFinished');
          }}
          onFrame={value => {
            console.log('onFrame', value);
          }}
          onPercentage={value => {
            console.log('onPercent', value);
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
              svgaPlayerRef.current?.load(
                'https://raw.githubusercontent.com/yyued/SVGAPlayer-iOS/master/SVGAPlayer/Samples/Goddess.svga',
              );
            }}
          />
          <Button
            title="指定帧开始"
            onPress={() => {
              svgaPlayerRef.current?.stepToFrame(20, true);
            }}
          />
          <Button
            title="指定百分比开始"
            onPress={() => {
              svgaPlayerRef.current?.stepToPercentage(0.5, true);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default App;
const styles = StyleSheet.create({
  containerW: {
    width: '45%',
  },
  flexAround: {flexDirection: 'row', justifyContent: 'space-around'},
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  localSvga: {
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

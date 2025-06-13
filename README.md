#### 1.react-native Svga 动画播放器 适配 Android/ios/Harmony 三端 DEMO 示例 基于 0.72.5 版本

### 点击下载观看效果

<https://github.com/yrjwcharm/react-native-ohos/raw/refs/heads/feature/rnoh/svgaplayer/harmony/svgaplayer.mp4>

## react-native Harmony

##### 仓库地址：

**https://gitcode.com/yrjwcharm/react-native-ohos-svgaplayer**

## react-native Android/Ios

##### 仓库地址：

**https://github.com/BANG88/react-native-svga-player**

> 由于 react-native-svga-player[`android/ios`] 很久没有被维护，本项目已修复好 android/ios 相关原生布丁 patch[`react-native-svga-player+1.1.0.patch`]安装会自动应用

### 安装

```javascript
yarn add react-native-svga-player

yarn add react-native-ohos-svgaplayer

```

#### 因为 react-native-ohos-svgaplayer 库有设置 Alias 别名 所以三端可以统一使用 `import RNSvgaPlayer from 'react-native-svga-player';`导入

导入

```typescript
import React from 'react';
import {
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
        <RNSvgaPlayer
          style={styles.localSvga}
          source={
            Platform.OS === 'ios'
              ? 'homePage_studyPlanner_computer_welcome'
              : 'homePage_studyPlanner_computer_welcome.svga'
          }
          onFinished={() => {
            console.log('onFinished');
          }}
          onFrame={(e: any) => {
            // console.log('onPercentage', e.nativeEvent.value);
          }}
          onPercentage={(e: any) => {
            // console.log('onPercentage', e.nativeEvent.value);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
export default App;
const styles = StyleSheet.create({
  containerW: {
    width: '45%',
  },
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
```

### 运行 android/ios

`npm start`

### 运行 harmony

`npm run harmony`

[下载观看 DEMO 效果](https://github.com/yrjwcharm/react-native-ohos/raw/refs/heads/feature/rnoh/svgaplayer/images/svga.mp4)

#### 播放远程动画三端是统一的

```javascript
<RNSvgaPlayer
  style={{width: 150, height: 150}}
  source={`https://raw.githubusercontent.com/yyued/SVGAPlayer-iOS/master/SVGAPlayer/Samples/${f}.svga`}
/>
```

#### 播放本地资源路径

- android： 需要把 svga 文件放置于 android 主工程 app/src/main/assets 文件夹下： 例如：`android/app/src/main/assets/homePage_studyPlanner_computer_welcome.svga`，没有 assets 目录需要手动创建

- ios: 在 Xcode 项目中右键选择 Add Files to "YourProject"...

  - 选择你的 .svga 文件（如 homePage_studyPlanner_computer_welcome.svga）
  - 确保勾选目标 Target​​（否则文件不会被打包进 App）

- harmony: 需要把 svga 文件放置于主 entry hap 目录 entry/src/main/ets/resources/rawfile/文件夹下：例如：`entry/src/main/ets/resources/rawfile/homePage_studyPlanner_computer_welcome.svga`,没有 rawfile 需要手动创建

##### 最后，在 RN 项目中调用，播放 ios 需要注意不需要加后缀名.svga

```js
{
  /* 播放本地资源： tips:注意 ios svga动画不需要后缀名[库作者封装时的要求] harmony和android都需要*/
}
<RNSvgaPlayer
  style={styles.localSvga}
  source={
    Platform.OS === 'ios'
      ? 'homePage_studyPlanner_computer_welcome'
      : 'homePage_studyPlanner_computer_welcome.svga'
  }
  onFinished={() => {
    console.log('onFinished');
  }}
  onFrame={(e: any) => {
    // console.log('onPercentage', e.nativeEvent.value);
  }}
  onPercentage={(e: any) => {
    // console.log('onPercentage', e.nativeEvent.value);
  }}
/>;
```

### 完整实例

```javascript
import React from 'react';
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
  const svgaPlayerRef = React.useRef < RNSvgaPlayer > null;
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
```

#### 运行 demo

- git clone https://github.com/yrjwcharm/react-native-ohos.git
- git checkout feature/rnoh/svgaplayer

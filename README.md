b## **这是一款使用 ReactNative 加载 Svga 动画的播放器插件** [Android/ios/harmony 三端统一]

> ### 版本：latest

<p align="center">
    <a href="https://github.com/wonday/react-native-pdf/blob/master/LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" />
    </a>
</p>

> [!TIP] [Github 地址](https://github.com/yrjwcharm/react-native-svga-player)

#### 1.react-native Svga 动画播放器 适配 Android/ios/Harmony 基于 0.72.5 版本

## react-native Harmony

##### 仓库地址：

**https://github.com/yrjwcharm/react-native-ohos-svgaplayer**

## react-native Android/iOS

##### 仓库地址：

**https://github.com/yrjwcharm/rn-newarch-svga-player**

**_这里默认你的项目 android/ios 都启用了新架构支持_**

### 安装

`yarn add rn-newarch-svga-player`

`yarn add react-native-ohos-svgaplayer`

> 为了统一使用 react-native-svga-player 库名导入。你还需要把 rn-newarch-svga-player 库修改下，react-native-ohos-svgaplayer 不用修改，因为它已经设置过别名 alias 了

```diff
+  "dependencies": {
    "@react-native-oh/react-native-harmony": "0.72.48",
    "patch-package": "^8.0.0",
    "postinstall-postinstall": "^2.1.0",
    "react": "18.2.0",
    "react-native": "0.72.5",
-    "rn-newarch-svga-player":"^1.0.7"
+   "react-native-svga-player":"npm:rn-newarch-svga-player@1.0.7",
    "react-native-ohos-svgaplayer": "^1.1.7"
  },

@Builder
function buildCustomComponent(ctx: ComponentBuilderContext) {
+  if (ctx.componentName === SvgaPlayerView.NAME) {
+   SvgaPlayerView({
+     ctx: ctx.rnComponentContext,
+     tag: ctx.tag
+   })
+ }
 ...
}
...
```

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

[点击下载观看效果](https://github.com/yrjwcharm/react-native-ohos/raw/refs/heads/feature/rnoh/svgaplayer/harmony/svgaplayer.mp4)

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

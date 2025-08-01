## **这是一款使用 ReactNative 加载 Svga 动画的播放器插件[Android/ios/harmony 三端统一]**

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

> [!TIP] 注意 ⚠️：这里默认你的项目 android/ios 都启用了新架构 Fabric<https://reactnative.cn/docs/0.72/the-new-architecture/use-app-template> 支持,如需旧架构支持[请移步这里](https://github.com/yrjwcharm/react-native-svga-player)

### 安装

`yarn add rn-newarch-svga-player`

`yarn add react-native-ohos-svgaplayer`

android 需要

```bash
 ./gradlew generateCodegenArtifactsFromSchema
```

ios 需要

```bash
  cd ios
  bundle install && bundle exec pod install
```

> 为了统一使用 react-native-svga-player 库名导入。你还需要把 rn-newarch-svga-player 库修改下，react-native-ohos-svgaplayer 不用修改，因为它已经设置过别名 alias 了

```diff
+  "dependencies": {
    "@react-native-oh/react-native-harmony": "0.72.48",
    "patch-package": "^8.0.0",
    "postinstall-postinstall": "^2.1.0",
    "react": "18.2.0",
    "react-native": "0.72.5",
-    "rn-newarch-svga-player":"^1.1.2"
+   "react-native-svga-player":"npm:rn-newarch-svga-player@1.1.2",
    "react-native-ohos-svgaplayer": "^1.1.14"
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

```js
<RNSvgaPlayer
  style={styles.localSvga}
  source={'homePage_studyPlanner_computer_welcome.svga'}
  onFinished={() => {
    console.log('onFinished');
  }}
  onFrame={(e: any) => {
    // console.log('onPercentage', e.value);
  }}
  onPercentage={(e: any) => {
    // console.log('onPercentage', e.value);
  }}
/>
```

### 完整实例

```javascript
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
  const svgaPlayerRef = useRef < SvgaPlayerRef > null;
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
          loops={1} // 循环次数，默认 0无限循环
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
```

import React, {useEffect} from 'react';
import {
  Button,
  DeviceEventEmitter,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import OpenFile from 'react-native-doc-viewer';
import {getBase64ImagePath} from './imgbase64';
const App = () => {
  //[TIP:]两种监听下载进度事件
  useEffect(() => {
    //监听下载进度事件
    const progressSubscription = DeviceEventEmitter.addListener(
      'RNDownloaderProgress',
      event => {
        // 添加事件处理
        console.log('Download progress:', event.progress);
      },
    );
    // const eventEmitter = new NativeEventEmitter(NativeModules.RNDocViewer);
    // const subscription = eventEmitter.addListener(
    //   'RNDownloaderProgress',
    //   event => {
    //     console.log('Download progress:', event.progress);
    //   },
    // );
    return () => {
      // 清理事件监听器
      progressSubscription && progressSubscription.remove();
      // subscription && subscription.remove();
    };
  }, []);
  const previewImage = () => {
    OpenFile.openDoc(
      [
        {
          url: 'https://i.gsxcdn.com/2015162519_i828z3ug.jpeg',
          cache: true,
        },
      ],
      (error: any, url: string) => {
        if (error) {
          console.error('Error opening image file:', error);
        } else {
          console.log(url);
        }
      },
    );
  };
  const previewWord = () => {
    OpenFile.openDoc(
      [
        {
          url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
          cache: false,
        },
      ],
      (error: any, url: string) => {
        if (error) {
        } else {
          console.log(url);
        }
      },
    );
  };
  const previewBase64 = () => {
    OpenFile.openDocb64(
      [
        {
          base64: getBase64ImagePath(),
          fileName: 'example',
          fileType: 'jpg',
          cache: true,
        },
      ],
      (error: string, url: string) => {
        if (error) {
          console.error('Error opening base64 file:', error);
        } else {
          console.log(url);
        }
      },
    );
  };
  const previewXML = () => {
    OpenFile.openDocBinaryinUrl(
      [
        {
          url: 'https://storage.googleapis.com/need-sure/example',
          fileName: 'example',
          fileType: 'xml',
          cache: false,
        },
      ],
      (error: any, url: string) => {
        if (error) {
          console.error('Error opening XML file:', error);
        } else {
          console.log(url);
        }
      },
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Button onPress={previewImage} title="预览图片" />
      <Button onPress={previewWord} title="预览word文档" />
      <Button onPress={previewBase64} title="base64打开预览" />
      <Button onPress={previewXML} title="预览XML" />
    </SafeAreaView>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

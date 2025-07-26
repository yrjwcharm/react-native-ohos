import React, {useState} from 'react';
import {Button, SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import OpenFile from 'react-native-ohos-docviewer';
import {getBase64ImagePath} from './imgbase64';
const App = () => {
  const previewImage = () => {
    OpenFile.openDoc(
      [
        {
          url: 'https://i.gsxcdn.com/2015162519_i828z3ug.jpeg',
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
  const previewWord = () => {
    OpenFile.openDoc(
      [
        {
          url: 'https://calibre-ebook.com/downloads/demos/demo.docx',
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
  const previewXML = () => {
    OpenFile.openDocBinaryinUrl(
      [
        {
          url: 'https://storage.googleapis.com/need-sure/example',
          fileName: 'example',
          fileType: 'xml',
        },
      ],
      (error: any, url: string) => {
        if (error) {
          console.log('Error opening XML file:', error);
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

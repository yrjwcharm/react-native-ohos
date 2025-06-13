import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
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

import React, {useState} from 'react';
import {
  Button,
  View,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import {RTNCalculator} from '@rtn-calculator';
const App = () => {
  const [result, setResult] = useState<number | null>(null);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View>
        <Text style={{marginLeft: 20, marginTop: 20}}>
          3+7={result ?? '??'}
        </Text>
        <Button
          title="计算"
          onPress={async () => {
            const value = await RTNCalculator?.add(3, 7);
            setResult(value ?? 0);
          }}
        />
      </View>
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

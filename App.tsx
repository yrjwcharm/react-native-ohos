import {RTNCalculator} from '@rtn/calculator';
import React, {useState} from 'react';
import {Button, SafeAreaView, StatusBar, StyleSheet, Text} from 'react-native';

const App = () => {
  const [result, setResult] = useState<number | null>(null);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Text style={styles.resultLabel}>3+7={result ?? '??'}</Text>
      <Button
        title="计算获取结果"
        onPress={async () => {
          try {
            const value = await RTNCalculator?.add(3, 7);
            setResult(value ?? 0);
          } catch (e) {}
        }}
      />
    </SafeAreaView>
  );
};
export default App;
const styles = StyleSheet.create({
  resultLabel: {
    fontSize: 20,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});

import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non deleniti
        quod, adipisci dicta porro, dolores itaque illo accusamus excepturi
        voluptatum ipsam, placeat voluptate eaque ad. Aliquam, unde libero. Nam,
        voluptatem!
      </Text>
    </SafeAreaView>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});

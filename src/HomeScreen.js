// HomeScreen.js
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Habit Screen"
        onPress={() => navigation.navigate('Habit')}
      />
      {/* <Button
        title="Set Alarm"
        onPress={() => navigation.navigate('Alarm')}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
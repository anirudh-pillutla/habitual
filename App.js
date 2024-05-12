import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SunriseAlarmScreen from './src/newAlarmScreen';
import RitualScreen from './src/RitualScreen';
import RitualsListScreen from './src/RitualsListScreen';
import { useKeepAwake } from 'expo-keep-awake';

// AsyncStorage.clear().then(() => console.log('AsyncStorage is now clear'));

const Stack = createNativeStackNavigator();

function App() {
  useKeepAwake(); // This will keep the app awake
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Alarm">
        <Stack.Screen name="Alarm" component={SunriseAlarmScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Habit" component={RitualScreen} options={{ headerShown: false }} />
        <Stack.Screen 
          name="Habits" 
          component={RitualsListScreen} 
          options={{
            headerTitle: props => <CustomHeaderTitle {...props} title="Habits" />,
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerTransparent: true,
            headerTitleAlign: 'center'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const CustomHeaderTitle = ({ title }) => {
  return (
    <View style={styles.customHeader}>
      <Text style={styles.customHeaderText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // ... other styles
  customHeader: {
    // Style your header title here
  },
  customHeaderText: {
    fontSize: 22,
    color: '#000', // or any color that matches your design
  },
});
export default App;

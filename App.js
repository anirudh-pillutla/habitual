import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import AlarmScreen from './src/AlarmScreen';
import RitualScreen from './src/RitualScreen';
import RitualsListScreen from './src/RitualsListScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

AsyncStorage.clear().then(() => console.log('AsyncStorage is now clear'));

const Stack = createNativeStackNavigator();

function App() {
  const handleStateChange = (state) => {
    console.log("Current Navigation State:", state);
  };
  return (
    <NavigationContainer onStateChange={handleStateChange}>
      <Stack.Navigator initialRouteName="Alarm">
        <Stack.Screen name="Alarm" component={AlarmScreen} />
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

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';

function AlarmScreen({ navigation }) {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [sunriseTime, setSunriseTime] = useState('');

  const handleSetAlarm = async () => {
    if (!latitude.trim() || !longitude.trim()) {
      Alert.alert("Invalid Input", "Please enter valid latitude and longitude.");
      return;
    }

    const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === 'OK') {
        setSunriseTime(data.results.sunrise);
        console.log('Sunrise time in UTC:', data.results.sunrise);
        Alert.alert("Success", `Sunrise time is at ${data.results.sunrise} (UTC)`);
      } else {
        throw new Error(data.status);
      }
    } catch (error) {
      console.error('Failed to fetch sunrise time:', error);
      Alert.alert("Error", "Failed to fetch sunrise time.");
    }
  };

  const validateInput = (text, setType) => {
    const validNumberRegex = /^-?\d*\.?\d*$/; // Regex to allow numbers, negative sign, and decimal
    if (validNumberRegex.test(text)) {
      setType(text);
    }
  };

  return (
    <View style={styles.container}>
        <TextInput
        style={styles.input}
        placeholder="Enter Latitude (e.g., -74.0060)"
        keyboardType="numbers-and-punctuation" // Change this for iOS to allow negative and decimal input
        value={latitude}
        onChangeText={text => validateInput(text, setLatitude)}
        />
        <TextInput
        style={styles.input}
        placeholder="Enter Longitude (e.g., 40.7128)"
        keyboardType="numbers-and-punctuation" // Change this for iOS to allow negative and decimal input
        value={longitude}
        onChangeText={text => validateInput(text, setLong)}
        />
      <Button
        title="Fetch Sunrise Time"
        onPress={handleSetAlarm}
      />
      {sunriseTime && <Text style={styles.sunriseText}>Sunrise Time (UTC): {sunriseTime}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  sunriseText: {
    marginTop: 20,
    fontSize: 16,
    color: 'black'
  }
});

export default AlarmScreen;

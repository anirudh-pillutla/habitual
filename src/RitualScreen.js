import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ImageBackground, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HabitScreen({ navigation, route }) {
  const [habitName, setHabitName] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (route.params?.habitName && route.params?.timer !== undefined) {
      setHabitName(route.params.habitName);
      setTimer(route.params.timer);
    } else {
      setHabitName('');
      setTimer(0);
    }
    return () => clearInterval(intervalRef.current);
  }, [route.params]);

  // Handler to dismiss the keyboard
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const startTimer = () => {
    if (!timerOn) {
      setTimerOn(true);
      intervalRef.current = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (timerOn) {
      clearInterval(intervalRef.current);
      setTimerOn(false);
    }
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimerOn(false);
    setTimer(0);
  };

  const saveTimer = async () => {
    try {
        const newRitual = { name: habitName, time: timer };
        let savedRituals = await AsyncStorage.getItem('rituals');
        savedRituals = savedRituals ? JSON.parse(savedRituals) : [];

        // Check if a ritual with the same name already exists
        const existingIndex = savedRituals.findIndex(r => r.name === habitName);

        if (existingIndex !== -1) {
            // Update existing ritual's time
            savedRituals[existingIndex].time = timer;
        } else {
            // Add new ritual since it does not exist
            savedRituals.push(newRitual);
        }

        await AsyncStorage.setItem('rituals', JSON.stringify(savedRituals));
        navigation.navigate('Habits');
    } catch (e) {
        console.error(e);
    }
};

  const formatTime = () => {
    const getTwoDigits = (num) => num.toString().padStart(2, '0');
    const hours = getTwoDigits(Math.floor(timer / 3600));
    const minutes = getTwoDigits(Math.floor((timer % 3600) / 60));
    const seconds = getTwoDigits(timer % 60);
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <ImageBackground
        source={require('../assets/new_app_background.png')} // Replace with the correct path to your background image
        resizeMode="cover"
        style={styles.container}
      >
        <View style={styles.container}>
          <TextInput
            style={styles.habitInput}
            onChangeText={setHabitName}
            value={habitName}
            placeholder="Name"
            placeholderTextColor="#C0C0C0"
          />
          <Text style={styles.timer}>{formatTime()}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={startTimer} style={[styles.button, styles.startButton]}>
              <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={stopTimer} style={[styles.button, styles.stopButton]}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={resetTimer} style={[styles.button, styles.resetButton]}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={saveTimer} style={[styles.button, styles.saveButton]}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Habits')}
        style={styles.habitsButton}>
          <Text style={styles.habitsButtonText}>Habits</Text>
        </TouchableOpacity>
        <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.navigate('Habits')}
            >
                <Text style={styles.buttonText}>Back to Main</Text>
        </TouchableOpacity>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // A translucent white background
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  habitInput: {
    color: '#000', // Dark text for contrast
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
  },
  timer: {
    color: '#000', // Dark text for contrast
    fontSize: 48,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#FFF', // White buttons for contrast
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000', // Dark text for contrast
  },
  habitsButton: {
    backgroundColor: '#FFF', // White button for contrast
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: 'absolute',
    bottom: 110,
  },
  habitsButtonText: {
    color: '#000', // Dark text for contrast
  },
  homeButton: {
    position: 'absolute',
    bottom: 30,  // 20 pixels from the bottom of the screen
    backgroundColor: '#FFF', // Feel free to change the color to match your theme
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});

export default HabitScreen;
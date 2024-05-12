import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, Modal, Keyboard, TouchableOpacity, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const soundObject = new Audio.Sound();

function SunriseAlarmScreen() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [sunriseTime, setSunriseTime] = useState('');
    const [localSunriseTime, setLocalSunriseTime] = useState('');
    const [minutesBefore, setMinutesBefore] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    async function playSound() {
        try {
            await soundObject.loadAsync(require('../assets/SlowMorning.mp3'), { shouldPlay: true });
            await soundObject.setIsLoopingAsync(true);
            await soundObject.playAsync();
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    }

    async function stopSound() {
        await AsyncStorage.removeItem('alarmTime');
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
        setModalVisible(false); // Hide the modal when the sound is stopped
    }

    useEffect(() => {
        const loadSavedCoordinates = async () => {
            const savedLatitude = await AsyncStorage.getItem('latitude');
            const savedLongitude = await AsyncStorage.getItem('longitude');
            if (savedLatitude !== null) {
                setLatitude(savedLatitude);
            }
            if (savedLongitude !== null) {
                setLongitude(savedLongitude);
            }
        };

        loadSavedCoordinates();
    }, []);

    useEffect(() => {
        const checkAlarm = async () => {
            const storedTime = await AsyncStorage.getItem('alarmTime');
            if (storedTime) {
                const alarmTime = new Date(storedTime);
                if (new Date() >= alarmTime) {
                    playSound(); // Function to play sound, defined elsewhere
                    setModalVisible(true);
                }
            }
        };

        const interval = setInterval(() => {
            checkAlarm();
        }, 60000); // Check every minute to see if it's time to play the sound

        return () => clearInterval(interval);
    }, []);

    const handleSetLatLong = async () => {
        try {
            await AsyncStorage.setItem('latitude', latitude);
            await AsyncStorage.setItem('longitude', longitude);
            fetchSunriseTime();
        } catch (error) {
            Alert.alert("Error", "Failed to save latitude and longitude.");
        }
    };

    const fetchSunriseTime = async () => {
        const url = `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'OK') {
                const utcSunriseTime = new Date(data.results.sunrise);
                const localSunriseTime = new Date(utcSunriseTime.getTime() + utcSunriseTime.getTimezoneOffset() * 60000 + new Date().getTimezoneOffset() * -60000);
                const currentTime = new Date();
                if (currentTime > localSunriseTime) {  
                    console.log('Current Time is greater than local sunrise time');
                    localSunriseTime.setDate(localSunriseTime.getDate() + 1);
                    utcSunriseTime.setDate(utcSunriseTime.getDate() + 1);
                }
                setLocalSunriseTime(localSunriseTime.toLocaleTimeString());
                setSunriseTime(utcSunriseTime.toISOString());
                await AsyncStorage.setItem('sunriseTime', localSunriseTime.toISOString());
            } else {
                Alert.alert("Error", "Failed to fetch sunrise time.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch sunrise time from API.");
        }
    };

    const saveAlarmTime = async (time) => {
        await AsyncStorage.setItem('alarmTime', time.toISOString());
    };

    const handleSetAlarm = async () => {
        minutes = 0
        if (minutesBefore) {
            minutes = parseInt(minutesBefore)
        }
        // Assuming the sunriseTime has already been adjusted for timezone and parsed to Date object
        const storedSunriseTime = await AsyncStorage.getItem('sunriseTime');
        if (storedSunriseTime) {
            const adjustedSunriseTime = new Date(storedSunriseTime);
            adjustedSunriseTime.setMinutes(adjustedSunriseTime.getMinutes() - minutes);
            await saveAlarmTime(adjustedSunriseTime); // Save the alarm time to AsyncStorage
            Alert.alert("Alarm Set", `Alarm set for ${adjustedSunriseTime.toLocaleTimeString()}`);
        }
        
        // Here you would set the actual alarm, the code for which depends on your alarm setting logic
    };

    // Handler to dismiss the keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ImageBackground
        source={require('../assets/alarm-background.png')} // The same image used in the main screen
        style={styles.backgroundImage}
        resizeMode="cover"
        >
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Latitude"
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType="numbers-and-punctuation"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Longitude"
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType="numbers-and-punctuation"
                />
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={handleSetLatLong} style={[styles.button, styles.startButton]}>
                        <Text style={styles.buttonText}>Set Lat / Long</Text>
                    </TouchableOpacity>
                </View>
                {sunriseTime ? <Text>Sunrise Time: {localSunriseTime}</Text> : null}
                <TextInput
                    style={styles.input}
                    placeholder="Minutes before sunrise"
                    value={minutesBefore}
                    onChangeText={setMinutesBefore}
                    keyboardType="numeric"
                />
                <Button
                    title="Set Alarm"
                    onPress={handleSetAlarm}
                />
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Alarm is ringing!</Text>
                            <Button
                                title="Stop Alarm"
                                onPress={stopSound}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    input: {
        flexDirection: 'row',
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: 'white',
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});

export default SunriseAlarmScreen;

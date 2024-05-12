import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Alert, Platform, Modal, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const soundObject = new Audio.Sound();

function CustomTimeAlarmScreen() {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
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
        setModalVisible(false); // Hide the modal when the sound is stopped
        await AsyncStorage.removeItem('alarmTime');
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
    }

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

    // Function to handle changes from the date-time picker
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    // Function to display the date-time picker
    const showTimepicker = () => {
        setShowDatePicker(true);
    };

    const saveAlarmTime = async (time) => {
        await AsyncStorage.setItem('alarmTime', time.toISOString());
    };

    // Button handler to set the alarm
    const handleSetAlarm = async () => {
        await saveAlarmTime(date); // Save the alarm time to AsyncStorage
        Alert.alert('Alarm Set', `Alarm is set for ${date.toLocaleTimeString()}.`);
    };

    return (
        <View style={styles.container}>
            <Button
                title="Set Alarm Time"
                onPress={showTimepicker}
            />
            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                />
            )}
            <Button
                title="Confirm Alarm"
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
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

export default CustomTimeAlarmScreen;

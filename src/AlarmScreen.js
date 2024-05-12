import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';

function AlarmScreen() {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [minutesBeforeSunrise, setMinutesBeforeSunrise] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    async function fetchSunriseTime(lat, lng) {
        const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === 'OK') {
                return new Date(data.results.sunrise);
            } else {
                throw new Error(data.status);
            }
        } catch (error) {
            console.error('Error fetching sunrise time:', error);
            Alert.alert('Error', 'Failed to fetch sunrise time.');
            return null;
        }
    }

    async function scheduleSunriseAlarm(sunriseTime, minutesBefore) {
        const time = new Date(sunriseTime.getTime() - minutesBefore * 60000);
    }

    const handleSetAlarm = async () => {
        if (!latitude || !longitude || !minutesBeforeSunrise) {
            Alert.alert('Error', 'Please enter all fields.');
            return;
        }
        const sunriseTime = await fetchSunriseTime(latitude, longitude);
        if (sunriseTime) {
            await scheduleSunriseAlarm(sunriseTime, parseInt(minutesBeforeSunrise, 10));
            Alert.alert('Alarm Set', `Alarm is set for ${minutesBeforeSunrise} minutes before sunrise.`);
        }
    };

    const saveLatitude = async (latitude) => {
        await AsyncStorage.setItem('latitude', latitude);
    };

    const saveLongitude = async (longitude) => {
        await AsyncStorage.setItem('longitude', longitude);
    };

    // Handler to dismiss the keyboard
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Latitude"
                keyboardType="numbers-and-punctuation"
                value={latitude}
                onChangeText={setLatitude}
            />
            <TextInput
                style={styles.input}
                placeholder="Longitude"
                keyboardType="numbers-and-punctuation"
                value={longitude}
                onChangeText={setLongitude}
            />
                        <Button
                title="Set Alarm"
                onPress={handleSetAlarm}
            />
            <TextInput
                style={styles.input}
                placeholder="Minutes before sunrise"
                keyboardType="numeric"
                value={minutesBeforeSunrise}
                onChangeText={setMinutesBeforeSunrise}
            />
            <Button
                title="Set Alarm"
                onPress={handleSetAlarm}
            />
        </View>
        </TouchableWithoutFeedback>
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
    }
});

export default AlarmScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RitualsListScreen({ navigation }) {
  const [rituals, setRituals] = useState([]);

  useEffect(() => {
    const getRituals = async () => {
      try {
        const storedRituals = await AsyncStorage.getItem('rituals');
        if (storedRituals) setRituals(JSON.parse(storedRituals));
      } catch (e) {
        console.error('Failed to load rituals');
      }
    };

    getRituals();
  }, []);

  const deleteRitual = async (index) => {
    let updatedRituals = [...rituals];
    updatedRituals.splice(index, 1);
    setRituals(updatedRituals);
    await AsyncStorage.setItem('rituals', JSON.stringify(updatedRituals));
  };

  const renderItem = ({ item, index }) => {
    const formatTime = (time) => {
      const hours = Math.floor(time / 3600);
      const minutes = Math.floor((time % 3600) / 60);
      const seconds = time % 60;
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  
    return (
      <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Habit', { habitName: item.name, timer: item.time })}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardTime}>{formatTime(item.time)}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteRitual(index)}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/second_screen_1.png')} // The same image used in the main screen
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FlatList
          data={rituals}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Habit', { habitName: '', timer: 0 })}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
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
    padding: 20,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 80, // Enough to avoid overlap with the header
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent white card
    borderRadius: 10,
    paddingVertical: 20, // Adjusted for reasonable height
    paddingHorizontal: 16,
    marginVertical: 8,
    width: '95%', // Adjust the width to take up most of the screen
    alignSelf: 'center', // Center the card horizontally
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5, // Elevation for Android
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4, // Optional: if you want to put some space between title and time
  },
  cardTime: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker background for the delete button for better visibility
    padding: 5,
    borderRadius: 15,
  },
  deleteButtonText: {
    color: '#fff', // White text for contrast
    fontSize: 18,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white to match the main screen
    padding: 10,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center', // Center the button within the full view
  },
  addButtonText: {
    fontSize: 20,
    color: '#000', // Dark text for contrast
  },
});

export default RitualsListScreen;
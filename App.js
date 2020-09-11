import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import MainCard from './components/MainCard';
import InfoCard from './components/InfoCard';
import * as Location from 'expo-location';
import getCurrentWeather from './api/ConsultApi';

export default function App() {

  const [darkTheme, setDarkTheme] = useState(true);
  const [currentTemperature, setCurrentTemperature] = useState();
  const [location, setLocationName] = useState();
  const [currentHour, setCurrentHour] = useState();

  const [wind, setWind] = useState();
  const [humidity, setHumidity] = useState();
  const [tempMin, setTempMin] = useState();
  const [tempMax, setTempMax] = useState();
  const [description, setDescription] = useState();

  const [locationCoords, setLocationCoords] = useState([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: darkTheme ? '#303030' : '#f2f2f2',
      alignItems: 'center',
    },
    refreshButton: {
      position: 'absolute',
      marginTop: 30,
      // marginLeft: 10,
      alignSelf: 'flex-start',
    },
    temperature: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 10,
    },
    temperatureText: {
      color: darkTheme ? '#e0e0e0' : 'black',
      fontSize: 50,
    },
    temperatureTextDescription: {
      color: darkTheme ? '#e0e0e0' : 'black',
      fontSize: 10,
    },
    cardView: {
      color: darkTheme ? 'black' : 'white',
      margin: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    info: {
      alignItems: 'center',
      backgroundColor: darkTheme ? '#424242' : '#818181',
      borderRadius: 20,
      width: 350,
      height: 200,
    },
    infoText: {
      color: darkTheme ? '#e0e0e0' : 'white',
      margin: 10,
      fontSize: 20,
      fontWeight: 'bold',
    },
    infoCards: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    themeButton: {
      marginTop: 15,
      alignSelf: "flex-end",
      // marginLeft: 300,
      // alignItems: 'center',
      justifyContent: 'center',
      width: 70,
      height: 50,
      borderRadius: 25
    },
    squareButton: {
      backgroundColor: darkTheme ? '#f2f2f2' : '#8f8f8f',
      justifyContent: 'center',
      borderRadius: 20,
      marginLeft: 20,
      width: 50,
      height: 25,
    },
    circleButton: {
      backgroundColor: darkTheme ? '#303030' : '#f2f2f2',
      alignSelf: darkTheme ? 'flex-end' : 'flex-start',
      margin: 5,
      width: 20,
      height: 20,
      borderRadius: 50,
    }

  });

  async function getLocation() {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    } else {
      let location = await Location.getCurrentPositionAsync({});
      await setLocationCoords(location.coords);
    }
  }

  async function setCurrentWeather() {

    await getLocation();

    let date = new Date();
    setCurrentHour(date.getHours() + ':' + date.getMinutes());

    const data = await getCurrentWeather(locationCoords);

    setCurrentTemperature(convertKelvinInC(data[0]));
    setTempMin(convertKelvinInC(data[1]));
    setTempMax(convertKelvinInC(data[2]));
    setLocationName(data[3]);
    setWind(data[4]);
    setHumidity(data[5]);
    setDescription(data[6]);
  }

  function convertKelvinInC(kelvin) {
    return parseInt(kelvin - 273);
  }

  useEffect(() => {
    // getLocation()
    setCurrentWeather();
  }, [])

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={() => setCurrentWeather()} style={styles.refreshButton}>
        <EvilIcons name="refresh" size={40} color={darkTheme ? 'white' : 'black'} />
      </TouchableOpacity>

      <View style={styles.themeButton}>
        <View style={styles.squareButton}>
          <TouchableOpacity style={styles.circleButton} onPress={() => darkTheme ? setDarkTheme(false) : setDarkTheme(true)}></TouchableOpacity>
        </View>
      </View>

      <Feather name="sun" size={40} color="orange" />

      <Text style={styles.temperatureTextDescription}>{description}</Text>

      <View style={styles.temperature}>
        <Text style={styles.temperatureText}>{currentTemperature}</Text>
        <Text style={[styles.temperatureText, { fontSize: 14 }]}>ºC</Text>
      </View>

      <Text style={[styles.temperatureText, { fontSize: 14 }]}>{location}, {currentHour}</Text>

      <View style={styles.cardView}>
        <MainCard title={'Manhã'} backgroundColor={darkTheme ? '#ff873d' : '#cc6e30'} temperature={'21º'} icon={'morning'}></MainCard>
        <MainCard title={'Tarde'} backgroundColor={darkTheme ? '#D29600' : '#FCC63F'} temperature={'25º'} icon={'afternoon'}></MainCard>
        <MainCard title={'Noite'} backgroundColor={darkTheme ? '#008081' : '#38B7B8'} temperature={'18º'} icon={'night'}></MainCard>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>Informações adicionais</Text>
        <View style={styles.infoCards}>
          <InfoCard title={'Vento'} value={wind + ' km/h'}></InfoCard>
          <InfoCard title={'Umidade'} value={humidity + '%'}></InfoCard>
          <InfoCard title={'Temp. Min'} value={tempMin + 'º'}></InfoCard>
          <InfoCard title={'Temp. Máx'} value={tempMax + 'º'}></InfoCard>
        </View>
      </View>



    </View>
  );
}


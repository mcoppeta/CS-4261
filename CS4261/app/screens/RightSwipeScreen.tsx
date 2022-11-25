import React, { useEffect, useState } from 'react'
import { ImageBackground, Text, View } from 'react-native'
import TinderCard from 'react-tinder-card'
import { api } from "../services/api/api_yelp"
import * as Location from 'expo-location';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'white'
  },
  header: {
    color: 'black',
    fontSize: 30,
    marginBottom: 30,
  },
  infoText: {
    height: 28,
    justifyContent: 'center',
    display: 'flex',
    zIndex: -100,
  }
}

const pullRestaurant = async (id, setRestaurant) => {
  await api.getRestaurant(id).then((r) => {
    setRestaurant(r)});
}

const distToRestaurant = (yourLat, yourLon, rLat, rLon) => {
  var rad = 6371
  var dLat = (rLat - yourLat) * (Math.PI / 180);
  var dLon = (rLon - yourLon) * (Math.PI / 180);
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(yourLat * (Math.PI / 180)) * Math.cos(rLat * (Math.PI / 180)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var toMiles = 0.62137
  return c * rad * toMiles;
}

const getLocation = (setLocation, setErrorMsg) => {
  (async () => {
    /*
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    */

    //Location.setGoogleApiKey(apiKey);

    let { coords } = await Location.getCurrentPositionAsync();

    setLocation(coords);
  })();
};

function RestaurantDetails(props) {
  
  console.log('IN DETAILS\n') //todo delete
  console.log(JSON.stringify(props.data, null, 2))
  const data = props.data
  const rcoords = props.data.coordinates
  var dist = distToRestaurant(props.lat, props.lon, rcoords.latitude, rcoords.longitude)
  var strdist = (Math.round(dist * 1000) / 1000).toFixed(3);

  return (
    <>
      <Text style={styles.header}>{data.name}</Text>
      <Text style={styles.header}>Rating: {data.rating} / 5</Text>
      <Text style={styles.header}>{data.name}</Text>
      <Text style={styles.header}>Dist: {strdist} miles</Text>
    </>
  );
}

function Simple(props) {

  const [restaurant, setRestaurant] = useState(false);

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    getLocation(setLocation, setErrorMsg)
    pullRestaurant(props.identification, setRestaurant)
  }, [])

  return (
    <View style={styles.container}>
      {!restaurant ? 
        <Text style={styles.header}>loading...</Text>
      :
        <RestaurantDetails data={restaurant} lat={location['latitude']} lon={location['longitude']} />
      }
    </View>
  )
}

export default Simple
import React, { useEffect, useState } from 'react'
import { Platform, Linking, Image, Text, View, Pressable, Alert, ScrollView, SafeAreaView } from 'react-native'
import TinderCard from 'react-tinder-card'
import { api } from "../services/api/api_yelp"
import * as Location from 'expo-location';

const styles = {
  background: {
    backgroundColor: 'white',
    height: '100%',
  },
  container: {
    display: 'flex',
    //alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: '10%',
    width: '100%',
    height: '95%',
    backgroundColor: 'white'
  },
  aligned: {
    height: '30%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  header: {
    color: 'black',
    fontSize: 30,
    marginBottom: 30,
  },
  title: {
    color: 'black',
    fontSize: 40,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: '5%',
  },
  nonimage: {
    backgroundColor: 'white',
    width: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  infoText: {
    height: 28,
    //justifyContent: 'center',
    //display: 'flex',
    zIndex: -100,
  },
  cardImage: {
    width: '90%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: '10%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sidebyside: {
    width: '80%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#e5e5e5',
    borderRadius: 20,
    marginBottom: '10%',
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    padding: '5%',
    color: 'black',
    fontSize: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    display: 'flex',
    alignItems: 'flex-start',
    marginLeft: '5%',
    marginBottom: '10%',
  },
  catHeader: {
    color: 'black',
    fontSize: 30,
    //marginBottom: 30,
  },
  cats: {
    marginLeft: '20%',
    marginTop: '5%',
    fontSize: 20,
  },
  catlink: {
    marginLeft: '20%',
    marginTop: '5%',
    fontSize: 20,
    color: 'blue',
  },
  sav: {
    flex: 1,
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
    
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    

    //Location.setGoogleApiKey(apiKey);

    let { coords } = await Location.getCurrentPositionAsync();

    setLocation(coords);
  })();
};

function RestaurantDetails(props) {
  const data = props.data
  const rcoords = props.data.coordinates
  var dist = distToRestaurant(props.lat, props.lon, rcoords.latitude, rcoords.longitude)
  var strdist = (Math.round(dist * 1000) / 1000).toFixed(3);

  var categories = props.data.categories.map((e)=>e.title)

  const addr = data.location.display_address[0] + ', ' + data.location.display_address[1]

  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='})
  const latlng = `${rcoords.latitude}, ${rcoords.longitude}`
  var url = Platform.select({
    ios: `${scheme}${latlng}`,
    android: `${scheme}${latlng}`,
  })

  return (
    <View style={styles.container}>
      <View style={styles.aligned}>
        <Image 
          style={styles.cardImage}
          source={{uri: data.image_url}}
        />
      </View>
      <View style={styles.nonimage}>
        <Text style={styles.title}>{data.name}</Text>
        <Pressable style={styles.button} onPress={()=>{Linking.openURL(url)}}>
          <Text style={styles.buttonText}>Directions</Text>
        </Pressable>
      </View>
      <SafeAreaView style={styles.sav}>
        <ScrollView>
          <View style={styles.info}>
            <Text style={styles.header}>Rated {data.rating} / 5</Text>
            <Text style={styles.header}>{strdist} miles away</Text>
            <View>
              <Text style={styles.catHeader}>Categories:</Text>
              <View>
                  {categories.map((cat) => {return <Text style={styles.cats}>{cat}</Text>})}
              </View>
            </View>
            <View>
              <Text style={styles.catHeader}>More Info:</Text>
              <View>
                  <Pressable onPress={()=>{Linking.openURL(`tel:${data.phone}`)}}>
                    <Text style={styles.catlink}>{data.display_phone}</Text>
                  </Pressable>
                  <Pressable onPress={()=>{Linking.openURL(`${data.url}`)}}>
                    <Text style={styles.catlink}>Website</Text>
                  </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
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
    <View style={styles.background}>
      {!restaurant ? 
        <Text style={styles.header}>loading...</Text>
      :
        <RestaurantDetails data={restaurant} lat={location ? location['latitude'] : null} lon={location ? location['longitude'] : null} />
      }
    </View>
  )
}

export default Simple
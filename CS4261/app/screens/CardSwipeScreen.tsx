import React, { useEffect, useState } from 'react'
import { ImageBackground, Text, View } from 'react-native'
import TinderCard from 'react-tinder-card'
import { api } from "../services/api/api_yelp"

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    color: '#000',
    fontSize: 30,
    marginBottom: 30,
  },
  cardContainer: {
    width: '90%',
    maxWidth: 260,
    height: 400,
  },
  card: {
    position: 'absolute',
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 260,
    height: 300,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 20,
  },
  cardTitle: {
    position: 'absolute',
    bottom: 0,
    margin: 10,
    color: '#fff',
  },
  cardAdditionalInfo: {
    position: 'absolute',
    bottom: 260,
    margin: 10,
    color: '#fff',
    justifyContent: 'center'
  },
  infoText: {
    height: 28,
    justifyContent: 'center',
    display: 'flex',
    zIndex: -100,
  }
}

const db = [] 

var queueIdx = 0
var queueSize = 0
const updateQueue = async (getRestaurants, setRestaurants) => {
  if (queueSize < 10) {
    await api.getRestaurants({offset:queueIdx}).then((r) => {setRestaurants(r)});
  }
}


function Simple(props) {
  // TEST for api yelp
  const [getRestaurants, setRestaurants] = useState([]);

  useEffect(() => {updateQueue(getRestaurants, setRestaurants)}, []) // on start only
  useEffect(() => {
    console.log(queueSize)
    updateQueue(getRestaurants, setRestaurants)}, [queueSize])

  // This pushes the name and image URL from each element of getRestaurants to db.
  useEffect(() => {
    console.log('r: ' + getRestaurants)
    getRestaurants.map(element => {
      if (db.some(e => e.name === element.name)) {

      } else {
        db.push(
          {name: element['name'], img: element['image_url'], rating: element['rating'], phone: element['phone'], id: element['id']}
        )
        queueIdx += 1
        queueSize += 1
      }
    });
  }, [getRestaurants])
  
  const characters = db
  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, character) => {
    console.log('removing: ' + character.name)
    queueSize -= 1
    setLastDirection(direction)
    
    if (direction === 'right') {
      props.setID(character.id)
      props.setName(character.name)
    }
    
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Card Swiping Test</Text>
      <View style={styles.cardContainer}>
        {characters.map((character) =>
          <TinderCard key={character.name} onSwipe={(dir) => swiped(dir, character)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <View style={styles.card}>
              <ImageBackground style={styles.cardImage} source={{uri: character.img}}>
                <Text style={styles.cardTitle}>{character.name} || Rating: {character.rating}</Text>
                <Text style={styles.cardAdditionalInfo}>{character.phone}</Text>
              </ImageBackground>
            </View>
            
          </TinderCard>
          
        )}
      </View>
      {lastDirection ? <Text style={styles.infoText}>You swiped {lastDirection}</Text> : <Text style={styles.infoText} />}
    </View>
  )
}

export default Simple
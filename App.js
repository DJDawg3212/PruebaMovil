import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';
import { Image } from 'react-native-elements';

const URL = 'https://api.thecatapi.com/v1/breeds';
const headers = new Headers();

headers.append('API-KEY', 'x-api-key: bda53789-d59e-46cd-9bc4-2936630fde39');

const REQUEST_OPTIONS = {
  method: 'GET',
  headers: headers,
};

export default function App() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetch(URL, REQUEST_OPTIONS)
      .then(response => response.json())
      .then(data => {
        const catPromises = data.map(async (cat) => {
          const imageResponse = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${cat.id}`);
          const imageData = await imageResponse.json();

          if (imageData.length > 0) {
            cat.image = imageData[0].url;
          }
          return cat;
        });

        Promise.all(catPromises)
          .then(catsWithImages => {
            setCats(catsWithImages);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>CATBREEDS</Text>
      <View style={styles.containerBox}>
        {cats && cats.map((cat) => {
          console.log(cat)
          return (
            <View key={cat.id} style={styles.containerCat}>
              <View style={styles.containerText}>
                <Text style={styles.text}>{cat.name}</Text>
                <Text style={styles.text}>{cat.affection_level}</Text>
              </View>
              <Image
                style={styles.image}
                source={{
                  uri: cat.image
                }} />
              <View style={styles.containerText}>
                <Text style={styles.text}>{cat.origin}</Text>
                <Text style={styles.text}>{cat.intelligence}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 20,
  },
  title: {
    fontWeight: "bold",
    width: "auto",
    textAlign: 'center'
  },
  containerBox: {
    alignItems: 'center',
  },
  containerCat: {
    borderWidth: 1,
    width: "90%",
    padding: 10,
    marginVertical: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  containerText: {
    flex: 1,
    flexDirection: 'row',
  },
  text: {
    marginBottom: 10,
    marginHorizontal: 30
  },
  image: {
    width: 200,
    height: 200,
    alignItems: 'center'
  }
});
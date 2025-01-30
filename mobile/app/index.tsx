import {
  getCurrentPositionAsync,
  LocationAccuracy,
  LocationObject,
  requestForegroundPermissionsAsync,
  startLocationUpdatesAsync,
  watchPositionAsync
} from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView from 'react-native-maps';

// import "../style/global.css";

let ws: WebSocket 

function gerarNumeroAleatorio() {
  return Math.floor(1000 + Math.random() * 9000);
}

const USER_ID = gerarNumeroAleatorio()

const LOCATION_TASK_NAME = 'background-location-task';
const WEBSOCKT_URL = 'ws://10.0.0.105:3000/ws' + `?id=${USER_ID}`

export default function Home(){

  const [location, setLocation] = useState<LocationObject | null>(null)

  async function requestLocationPermission(){
    try{
      const { granted } = await requestForegroundPermissionsAsync();
      if (granted) {
        const { granted: backgroundGranted  } = await requestForegroundPermissionsAsync();
        if(backgroundGranted){
          await startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: LocationAccuracy.Balanced,
            timeInterval: 1000,
            distanceInterval: 1,
            foregroundService:{
              notificationBody: 'Usando a localização',
              notificationTitle: 'PortalFacility',
              notificationColor: '#RRGGBB'
            }
          });
        }

        const currentLocation = await getCurrentPositionAsync()
        setLocation(currentLocation)
      }
    }catch(e){
      console.log('Request Permission', (e as Error).message)
    }

  }

  useEffect(() => {
    console.log("User ID: ", USER_ID)
    try{
      ws = new WebSocket(WEBSOCKT_URL);
      
      console.log(ws.readyState == ws.OPEN)
      ws.onopen = () => {
        console.log('Conexão WebSocket aberta', ws.readyState == ws.OPEN)
        console.log(ws.readyState == ws.OPEN)
      };

      ws.onmessage = (event) => {
        console.log('Mensagem recebida:', event.data);
      };
      
    }catch(e){
      console.log("Error", (e as Error).message)
    }
  }, [])

  useEffect(() => {
    requestLocationPermission()
  }, [])

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, (response) => {
      setLocation(response)
      // console.log("watch", response)
      mapRef.current?.animateCamera({
        // pitch: 70,
        center: response.coords
      })
    })
  }, [])

  const mapRef = useRef<MapView>(null)

  return (
    <View style={ {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    } }>

      {/* {
        location &&
        <MapView
          ref={mapRef}
          style={ {flex: 1, width: '100%'} }
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }}
          />
        </MapView>
      } */}
      <Text>Home</Text>
      <Text>{JSON.stringify(location?.coords, null, 2)}</Text>
    </View>
  )
}

TaskManager.defineTask<{locations: LocationObject[]}>(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.log("tasks", error)
    return;
  }
  if (data) {
    const { coords, timestamp } = data.locations[0]
    if(ws.readyState == ws.OPEN){
      ws.send(JSON.stringify({
        event: 'locationUpdate',
        payload: { 
          latitude: coords.latitude,
          longitude: coords.longitude
        }
      }));
    }
    console.log(timestamp,"/ lat: ", coords.latitude, ", lng: ", coords.longitude, '\n')
  }
});


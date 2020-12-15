import React, {Component, useState, useEffect} from 'react';
import {View, Text, Linking, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Overlay, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const OVERLAY_TOP_LEFT_COORDINATE = [ 35.895890, 128.602600 ];
const OVERLAY_BOTTOM_RIGHT_COORDINATE = [ 35.884600, 128.618022 ];
const MAP_CENTER_LAT = 35.88889077773424, 
    MAP_CENTER_LONG = 128.61038739453045;

const TimeMap =()=>{
    const [region, setRegion] = useState({
        latitude: MAP_CENTER_LAT,
        longitude: MAP_CENTER_LONG,
        latitudeDelta:0.01,
        longitudeDelta:0.01,
    })
    const [enrollAry, setEnrollAry] = useState([])
    const [coords, setCoords] = useState([])
    const overlay = {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE]
    }

    useEffect(()=>{
        getData()
    }, [])
 
    const getData = async ()=> {
        try {
            const jsonValue = await AsyncStorage.getItem('@enrollData')
            if(jsonValue!=null){
                var coords=[]
                var enrollAry = JSON.parse(jsonValue)
                enrollAry.map((value, index)=>{
                    coords.push({latitude: value.latitude, longitude: value.longitude})
                })
                setEnrollAry(enrollAry);
                setCoords(coords);
            }
          } catch(e) {
              // error reading value
        }
    }

    return(
        <View style={{flex:1, padding:0,}}>
            <MapView 
                style={{flex:1,}}
                provider={PROVIDER_GOOGLE}
                initialRegion={region}
                >
                
                <Overlay
                    image={require('../images/campus.jpg')}
                    bounds={overlay.bounds}
                    style={{position: 'absolute'}}
                    />

                {
                    enrollAry.map((value, index)=>{
                        return(
                            <Marker
                                coordinate={{latitude: value.latitude, longitude: value.longitude}}
                                title={value.location}
                                description={`${value.cname}\n${value.ltime}`}
                                key={value.cid}>
                            </Marker>
                        )
                    })
                }

                <Polyline
                    coordinates={coords}
                    strokeColor="#000"
                    strokeColors={[
                        '#7F0000',
                        '#B24112',
                    ]}
                    strokeWidth={3}
                />
            </MapView>
        </View>
    );
}

export default TimeMap;
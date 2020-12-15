import React, {Component, useState, useEffect} from 'react';
import {View, Text, Linking, Image, Dimensions, ScrollView} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Overlay, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

const OVERLAY_TOP_LEFT_COORDINATE = [ 35.895890, 128.602600 ];
const OVERLAY_BOTTOM_RIGHT_COORDINATE = [ 35.884600, 128.618022 ];
const MAP_CENTER_LAT = 35.88889077773424, 
    MAP_CENTER_LONG = 128.61038739453045;

const TimeMap = ({ route, navigation }) => {
    const {test} = route.params? route.params : 0;

    const [region, setRegion] = useState({
        latitude: MAP_CENTER_LAT,
        longitude: MAP_CENTER_LONG,
        latitudeDelta:0.01,
        longitudeDelta:0.01,
    })
    const [enrollArr, setEnrollArr] = useState([])
    const [coords, setCoords] = useState([])
    const overlay = {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE]
    }

    const week= ['일', '월', '화', '수', '목', '금', '토']
    const schoolWeek= ['월', '화', '수', '목', '금']
    const pinColor=['red', 'blue', 'green', 'yellow', 'black']
    const [dayEnroll, setDayEnroll] = useState([])
    const dayCoords = []
    const [date, setDate] = useState(new Date().getDate())
    const [day, setDay] = useState(new Date().getDay())

    const getData = async ()=> {
        try {
            const jsonValue = await AsyncStorage.getItem('@enrollData')
            if(jsonValue!=null){
                var coords=[]
                var enrollArr = JSON.parse(jsonValue)
                enrollArr.map((value, index)=>{
                    coords.push({latitude: value.latitude, longitude: value.longitude})
                })
                setEnrollArr(enrollArr);
                setCoords(coords);
            }
          } catch(e) {
              // error reading value
        }
    }

    useEffect(()=>{
        getData()
    }, [test])

    useEffect(()=>{
        for(let i=0; i<5; i++){
            const toDayEnroll = enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(0))==i)
                                        .concat(enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(5))==i))
            setDayEnroll(dayEnroll.concat(enroll, toDayEnroll))
        }
    })
    console.log(dayEnroll)
    // dayEnroll.map((enroll,index)=>{
    //     console.log(enroll)
    //     // enroll.map((value)=>{
                
    //     // })
    // })

    return(
        <View style={{flex:1, padding:0}}>
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

                {/* {
                    dayEnroll.map((enroll,index)=>{
                        enroll.map((value)=>{
                            return(
                                <Marker
                                    coordinate={{latitude: value.latitude, longitude: value.longitude}}
                                    title={value.location}
                                    description={`${value.cname}\n${value.ltime}`}
                                    key={index}>
                                </Marker>
                            );
                        })
                    })
                } */}

                <Polyline
                    coordinates={coords}
                    strokeColor="#000"
                    strokeColors={[
                        pinColor[day-1],
                    ]}
                    strokeWidth={3}
                />
            </MapView>
            <View style={{position: 'absolute', left: SCREEN_WIDTH*0.02 , top: SCREEN_HEIGHT*0.01, width: SCREEN_WIDTH*0.4}}>
                <Text style={{color: "white",
                                fontSize: 33,
                                fontWeight: "bold",
                                textAlign: "center",
                                backgroundColor: "#8C6C64a0"}}>{`${date}(${week[day]})`}</Text>
                <Text style={{color: "white",
                                textAlign: "center",
                                fontSize: 18,
                                backgroundColor: "#8C6C64a0"}}>{`거리: `}</Text>
            </View>
        </View>
    );
}

export default TimeMap;
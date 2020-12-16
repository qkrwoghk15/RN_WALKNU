import React, {Component, useState, useEffect} from 'react';
import {View, Text, Linking, Image, Dimensions, TouchableOpacity} from 'react-native';
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
                                    latitude:MAP_CENTER_LAT,
                                    longitude:MAP_CENTER_LONG,
                                    latitudeDelta:0.013,
                                    longitudeDelta:0.013,
                                })
    const [enrollArr, setEnrollArr] = useState([])
    
    const overlay = {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE]
    }

    const week= ['일', '월', '화', '수', '목', '금', '토']
    const pinColor=['red', 'blue', 'green', 'yellow', 'black']
    const [date, setDate] = useState(new Date().getDate())
    const [day, setDay] = useState(new Date().getDay())
    const [seeToday, setSeeToday] = useState(false)
    const [Allpath, setAllPath] = useState([])
    var lids=[[],[],[],[],[]]
    var coords = [[],[],[],[],[]]

    const getData = async ()=> {
        try {
            const jsonValue = await AsyncStorage.getItem('@enrollData')
            if(jsonValue!=null){
                var enrollArr = JSON.parse(jsonValue)
                setEnrollArr(enrollArr);
            }
          } catch(e) {
              // error reading item
        }
    }

    const getDayPath = async ()=> {
        for(let i=0; i<5; i++){
            enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(0))==i)
                        .concat(enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(5))==i))
                        .map((value, index)=>lids[i].push(value.lid))
        }
    }

    useEffect(()=>{
        getData()
        getDayPath()
        const displayPath = async (i, j) =>{//415, 106
            try{
                const response = await fetch(`http://3.218.74.114/graphql?query={ getPath ( startId: ${i}, endId: ${j} ) {path { latitude longitude } } }`);
                const responseJson = await response.json();
                var path = responseJson.data.getPath?.path
                if(path!=null){
                    var temp = []
                    path.map((value)=>(temp.push({latitude: value.latitude/1000000, longitude: value.longitude/1000000})))
                    return temp
                }
                return []
            } catch (error){
                console.error(error)
            }
        }
        lids.map((lid2, index)=>{
            if(lid2.length>1){
                lid2.map((lid, index)=>{
                    // if(index<lid2.length-1)
                        //coords[index].concat(displayPath(lid2[index], lid2[index+1]))
                })
            }
        })
    }, [test])

    return(
        <View style={{flex:1, padding:0}}>
            <MapView 
                    style={{flex:1}}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    toolbarEnabled={true}
                    onUserLocationChange={location => setRegion({
                        latitude: location.latitude,
                        longitude: location.longitude,
                    })}
                    onRegionChange={region=> setRegion({
                        latitude: region.latitude,
                        longitude: region.longitude,
                    })}
                    onRegionChangeComplete={region => setRegion({
                        latitude: region.latitude,
                        longitude: region.longitude,
                    })}
                >
                
                <Overlay
                    image={require('../images/campus.jpg')}
                    bounds={overlay.bounds}
                    style={{position: 'absolute'}}
                    />

                {
                    enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(0))==0)
                    .concat(enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(5))==0))
                    .map((item, index) => {
                        return(
                            (!seeToday || (0==day-1))&&
                            <Marker
                                coordinate={{latitude:item.latitude/1000000, longitude:item.longitude/1000000}}
                                title={item.location}
                                description={`${item.cname}\n${item.ltime}`}
                                pinColor={pinColor[0]}
                                key={item.cid}>
                            </Marker>
                        );
                    })
                }

                {/* <Polyline
                    coordinates={path.map((value)=>({latitude: value.latitude/1000000, longitude: value.longitude/1000000}))}
                    strokeColor="#000"
                    strokeColors={[
                        '#7F0000',
                        '#B24112',
                    ]}
                    strokeWidth={3}
                /> */}
                    

                {
                    enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(0))==1)
                        .concat(enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(5))==1))
                        .map((item) => {
                            return(
                                (!seeToday || (1==day-1))&&
                                <Marker
                                    coordinate={{latitude:item.latitude/1000000, longitude:item.longitude/1000000}}
                                    title={item.location}
                                    description={`${item.cname}\n${item.ltime}`}
                                    pinColor={pinColor[1]}
                                    key={item.cid}>
                                </Marker>
                            );
                        })
                }
                {
                    enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(0))==2)
                        .concat(enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(5))==2))
                        .map((item) => {
                            return(
                                (!seeToday || (2==day-1))&&
                                <Marker
                                    coordinate={{latitude:item.latitude/1000000, longitude:item.longitude/1000000}}
                                    title={item.location}
                                    description={`${item.cname}\n${item.ltime}`}
                                    pinColor={pinColor[2]}
                                    key={item.cid}>
                                </Marker>
                            );
                        })
                }
                {
                    enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(0))==3)
                        .concat(enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(5))==3))
                        .map((item) => {
                            return(
                                (!seeToday || (3==day-1))&&
                                <Marker
                                    coordinate={{latitude:item.latitude/1000000, longitude:item.longitude/1000000}}
                                    title={item.location}
                                    description={`${item.cname}\n${item.ltime}`}
                                    pinColor={pinColor[3]}
                                    key={item.cid}>
                                </Marker>
                            );
                        })
                }
                {
                    enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(0))==4)
                        .concat(enrollArr.filter(lecture => parseInt(lecture.strTime.charAt(5))==4))
                        .map((item) => {
                            return(
                                (!seeToday || (4==day-1))&&
                                <Marker
                                    coordinate={{latitude:item.latitude/1000000, longitude:item.longitude/1000000}}
                                    title={item.location}
                                    description={`${item.cname}\n${item.ltime}`}
                                    pinColor={pinColor[4]}
                                    key={item.cid}>
                                </Marker>
                            );
                        })
                }
            </MapView>

            <View style={{position: 'absolute', left: SCREEN_WIDTH*0.02 , top: SCREEN_HEIGHT*0.01, width: SCREEN_WIDTH*0.4, flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => setSeeToday(!seeToday)}>
                    <Text style={{color: 'white',
                                fontSize: 33,
                                fontWeight: "bold",
                                textAlign: "center",
                                backgroundColor: "#8C6C64a0"}}>{`${date}`}</Text>
                    <Text style={{color: pinColor[day-1],
                                fontSize: 33,
                                fontWeight: "bold",
                                textAlign: "center",
                                backgroundColor: "#8C6C64a0"}}>{`(${week[day]})`}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TimeMap;
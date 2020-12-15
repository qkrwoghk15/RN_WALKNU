import React, {useState, useEffect, useRef} from 'react';
import {Alert, View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground, FlatList} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker , Polyline, Overlay} from 'react-native-maps';
import SearchBar from 'react-native-platform-searchbar';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');
const OVERLAY_TOP_LEFT_COORDINATE = [ 35.895890, 128.602600 ];
const OVERLAY_BOTTOM_RIGHT_COORDINATE = [ 35.884600, 128.618022 ];
const MAP_CENTER_LAT = 35.88889077773424, 
    MAP_CENTER_LONG = 128.61038739453045;

const Navigate = () => {
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);

    const overlay = {
        bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE]
    }
    const [marker,setMarker] = useState({
                                    latlng:{latitude:MAP_CENTER_LAT, longitude:MAP_CENTER_LONG},
                                    title:"경북대학교 본관",
                                    description:"경북대학교의 중심"
                                });
    const [region, setRegion] = useState({
                                    latitude:MAP_CENTER_LAT,
                                    longitude:MAP_CENTER_LONG,
                                    latitudeDelta:0.013,
                                    longitudeDelta:0.013,
                                })
    const [location, setLocation] = useState({
                                        latitude:MAP_CENTER_LAT,
                                        longitude:MAP_CENTER_LONG,
                                    });
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tracking, setTracking] = useState(false);
    const [locatePop, showLocatePop] = useState(false);
    const mapRef = useRef();

    ///////////////////////////////////////////////////////// Search Bar /////////////////////////////////////////////////////////
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
        }, []);

    useEffect(() => {
        setLoading(false)
        fetch(`http://3.218.74.114/graphql?query={ getLectures(subject: "") { cid, univ, cname, prof, ltime, location, latitude, longitude } }`)
            .then((response) => response.json())
            .then((responseJson) => {
                setFilteredDataSource(responseJson.data.getLectures);
                setMasterDataSource(responseJson.data.getLectures);
                setLoading(true)
            })
            .catch((error) => {
                console.error(error);
            });
        }, []);

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = masterDataSource.filter(function (item) {
            const itemData = (item.cid ? JSON.stringify(item.cid).toUpperCase() : '') + 
                            (item.cname ?JSON.stringify(item.cname) : '') +
                            (item.prof ? JSON.stringify(item.prof) : '')
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    const getItem = (item) =>
        Alert.alert(
            `${item.univ}\n`,
            `${item.location}\n`,
            [
                { text: "OK", onPress: () => {
                    setSearch('')
                    searchFilterFunction('')
                    setMarker({
                        latlng:{latitude:item.latitude, longitude:item.longitude},
                        title: item.location,
                        description: `${item.cname}\n${item.ltime}`
                    });
                    movetoLocation(item.latitude, item.longitude)
                }},
                {
                    text: "Cancel",
                    style: "cancel"
                },
            ],
            { cancelable: false }
    );

    const ItemView = ({ item }) => {
        return (
            // Flat List Item
            <TouchableOpacity onPress={()=>getItem(item)}
                            activeOpacity={1}
                            style={{flexDirection: 'row', alignItems: 'center', width:SCREEN_WIDTH, backgroundColor: '#F2F2F2', padding:8
                            , borderColor:'#E4E3E9', borderWidth: 1}}>
                <View style={{width:'40%'}}>
                    <Text sytle={{}}>
                        {`${item.cid}\n${item.cname.toUpperCase()}\n${item.prof}`}
                    </Text>
                </View>
                <Text>
                    {`${item.univ}\n${item.location}`}
                </Text>
            </TouchableOpacity>
        );
    };
    ///////////////////////////////////////////////////////// Search Bar /////////////////////////////////////////////////////////
    const movetoCenter=()=>{
        setMarker({
            latlng:{latitude:MAP_CENTER_LAT, longitude:MAP_CENTER_LONG},
            title:"경북대학교 본관",
            description:"경북대학교의 중심"
        })
        mapRef.current.animateToRegion({
            latitude:MAP_CENTER_LAT,
            longitude:MAP_CENTER_LONG,
            latitudeDelta:0.013,
            longitudeDelta:0.013,
        })
    }

    const movetoLocation=(latitude, longitude)=>{
        mapRef.current.animateToRegion({
            latitude:latitude,
            longitude:longitude,
            latitudeDelta:0.0025,
            longitudeDelta:0.0025,
        })
    }

    const getCurrentPos = () => {
        setRegion({
            latitude: location.latitude,
            longitude: location.longitude
        })
    }

    return(
        <View style={{flex:1, padding:0,}}>
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <SearchBar
                    value={search}
                    onChangeText={(text) => searchFilterFunction(text)}
                    onClear={(text) => searchFilterFunction('')}
                    placeholder="Search"
                    theme="light"
                    style={{ flex:1,}}
                >
                    {!loading ? (
                        <ActivityIndicator style={{marginRight:10}} />
                    ) : undefined}
                </SearchBar>
            </View>

            <MapView
                ref={mapRef}
                style={{flex:13,}}
                initialRegion={region}
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                toolbarEnabled={true}
                
                onUserLocationChange={location => setLocation({
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

                <Marker
                    isPreselected = 'true'
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}
                    >
                </Marker>
            </MapView>

            {/* ButtonBox */}
            <TouchableOpacity onPress={()=>movetoCenter()} style={{position: 'absolute', right:'18%' , bottom: '5.5%', width:55, height: 55}}>
                <View style={{flex: 1}}>
                    <Image
                        source={require('../images/emblem.png')} 
                        style={{resizeMode:'contain', width:55, height: 55}}/>
                </View>
            </TouchableOpacity>

            {
                (search!='')&&
                <FlatList
                    data={filteredDataSource}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={ItemView}
                    bounces={false}
                    style={{position: 'absolute', left: 0, top:'7%'}}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlay:{
        backgroundColor:"#00000070",
        height:"100%",
        width:"100%",
        justifyContent:"center",
        alignItems:"center"
    },
    heading1:{
        color:"#fff",
        fontWeight:"bold",
        fontSize:30,
        margin:20
    },
    heading2:{
        color:"#fff",
        margin:5,
        fontWeight:"bold",
        fontSize:15
    },
    heading3:{
        color:"#fff",
        margin:5
    }
});

export default Navigate;
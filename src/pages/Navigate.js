import React, {Component} from 'react';
import {View, Text, Linking, Image, TextInput, SearchBar, ActivityIndicator} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker , Polyline, Overlay} from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';

export default class Navigate extends Component{
    constructor(){
        super();
        
        this.state={
            region:{
                latitude:35.891425,
                longitude:128.611994,
                latitudeDelta:0.01,
                longitudeDelta:0.01,
            },
            markers:[{
                latlng:{latitude:35.890425, longitude:128.611994},
                title:"경북대학교 본관",
                description:"경북대학교의 중심"
            },
            {
                latlng:{latitude:35.890425, longitude:128.611995},
                title:"경북대학교 어딘가",
                description:"경북대학교 어딘가"
            }],
            value:'',
            loading: true,
        }
 
    }
 
    render(){
        return(
            <View style={{flex:1, padding:0,}}>
                <View style = {{flex: 1}}>
                    <SearchBar
                        value={this.state.value}
                        onChangeText={text => this.setState({value: text})}
                        placeholder="Search"
                        theme="light"
                        style={{ flex:1, borderColor: 'gray', borderWidth: 1 }}
                    >
                        {this.state.loading ? (
                            <ActivityIndicator style={{marginRight:10}} />
                        ) : undefined}
                    </SearchBar>
                </View>

                <MapView 
                    style={{flex:11,}}
                    initialRegion={this.state.region}
                    provider={PROVIDER_GOOGLE}
                    onRegionChange={this.onRegionChange}
                >
                    <Marker
                        coordinate={this.state.region}
                        title="미래능력개발교육원"
                        description="http://wwww.mrhi.or.kr"
                        onCalloutPress={this.clickCallout}></Marker>
                    <Marker
                        coordinate={{latitude:37.561727, longitude:127.036370}}
                        title="성동경찰서"
                        description="http://wwww.smpa.go.kr"></Marker>

                    {
                        this.state.markers.map((marker,index)=>{
                            return <Marker
                                coordinate={marker.latlng}
                                title={marker.title}
                                description={marker.description}
                                key={index}
                                ><Image
                                    source={require('../images/marker.png')}
                                    style={{width: 40, height: 40}}
                                    resizeMode="contain">
                                </Image>
                            </Marker>
                        })
                    }

                    <Polyline
                        coordinates={[
                            { latitude:35.890425, longitude:128.611994 },
                            { latitude:35.890325, longitude:128.610994 },
                            { latitude:35.890725, longitude:128.611894 },
                            { latitude:35.890625, longitude:128.611794 },
                            { latitude:35.891425, longitude:128.621994 },
                            { latitude:35.889425, longitude:128.612994 },
                        ]}
                        strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                        strokeColors={[
                            '#7F0000',
                            '#00000000', // no color, creates a "long" gradient between the previous and next coordinate
                            '#B24112',
                            '#E5845C',
                            '#238C23',
                            '#7F0000'
                        ]}
                        strokeWidth={6}
                    />
                </MapView>
            </View>
        );
    }
 
    clickCallout=()=>{
        Linking.openURL('http://www.mrhi.or.kr');
    }

    // async requestLocationPermission(){
            
    //     try{
    //         // 퍼미션 요청 다이얼로그 보이기
    //         const granted=await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
 
    //         if(granted== PermissionsAndroid.RESULTS.GRANTED){
    //             alert('위치정보 사용을 허가하셨습니다.');
    //         }else{
    //             alert('위치정보 사용을 거부하셨습니다.\n앱의 기능사용이 제한됩니다.');
    //         }
 
    //     }catch(err){alert('퍼미션 작업 에러');}
 
    // }
    // //화면이 시작될때 퍼미션 받도록 라이프사이클 메소드 이용
    // async componentDidMount(){
    //    await this.requestLocationPermission()
    // }
}
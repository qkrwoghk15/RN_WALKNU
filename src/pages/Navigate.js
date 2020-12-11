import React, {Component} from 'react';
import {View, Text, Linking} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
 
export default class Navigate extends Component{
    constructor(){
        super();
        this.state={
            region:{
                latitude:37.562087,
                longitude:127.035192,
                // 얼마의 위도경도 차이까지 지도에 표시되는가 (zoom 설정)
                latitudeDelta:0.009,
                longitudeDelta:0.004,
            },
            markers:[{
                latlng:{latitude:37.562516, longitude:127.035679},
                title:"희망약국",
                description:"왕십리에 있는 약국"
            },
            {
                latlng:{latitude:37.562516, longitude:127.037},
                title:"희망약국2",
                description:"왕십리에 있는 약국"
            }],
        }
 
    }
 
    render(){
        return(
            <View style={{flex:1, padding:0,}}>
                <MapView 
                    style={{flex:1,}}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.region}>
                        {/* 마커 추가 */}
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
                                    image={require('../images/marker.png')}>
                                </Marker>
                            })
                        }
                </MapView>
            </View>
        );
    }
 
    clickCallout=()=>{
        // 특정 URL의 웹문서를 디바리스의 웹브라우저를 통해 열기
        Linking.openURL('http://www.mrhi.or.kr');
    }
}
import React, {Component} from 'react';
import {View, Text, Linking, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker , Polyline} from 'react-native-maps';
 
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
        }
 
    }
 
    render(){
        return(
            <View style={{flex:1, padding:0,}}>
                <MapView 
                    style={{flex:1,}}
                    initialRegion={this.state.region}
                    provider={PROVIDER_GOOGLE}
                    onRegionChange={this.onRegionChange}
                >
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
}
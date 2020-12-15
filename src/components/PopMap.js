import React, {Component} from 'react';
import {View, Text, Linking, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Overlay} from 'react-native-maps';
 
export default class PopMap extends Component{
    constructor(props){
        super();
        const OVERLAY_TOP_LEFT_COORDINATE = [ 35.895890, 128.602600 ];
        const OVERLAY_BOTTOM_RIGHT_COORDINATE = [ 35.884600, 128.618022 ];
        this.state={
            region:{
                latitude: props.lecture.latitude,
                longitude: props.lecture.longitude,
                // 얼마의 위도경도 차이까지 지도에 표시되는가 (zoom 설정)
                latitudeDelta:0.005,
                longitudeDelta:0.005,
            },
            marker:{
                latlng:{latitude: props.lecture.latitude,longitude: props.lecture.longitude},
                title: props.lecture.location,
                description: props.lecture.ltime,
            },
            overlay: {
                bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE]
            }
        }
 
    }
 
    render(){
        const {region, marker, overlay} = this.state;
        return(
            <View style={{flex:1, padding:0,}}>
                <MapView 
                    style={{flex:1,}}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    showsMyLocationButton={true}>

                    <Overlay
                        image={require('../images/campus.jpg')}
                        bounds={overlay.bounds}
                        style={{position: 'absolute'}}
                     />

                    <Marker
                        coordinate={marker.latlng}
                        title={marker.title}
                        description={marker.description}
                        onCalloutPress={this.clickCallout}></Marker>
                </MapView>
            </View>
        );
    }
 
    clickCallout=()=>{
        Linking.openURL('http://knu.ac.kr');
    }
}
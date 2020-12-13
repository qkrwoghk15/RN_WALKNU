import React, {Component} from 'react';
import {View, Text, Linking, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
 
export default class ModalMap extends Component{
    constructor(props){
        super();
        this.state={
            region:{
                latitude: 35.890425 + props.lat,
                longitude: 128.611994 + props.long,
                // 얼마의 위도경도 차이까지 지도에 표시되는가 (zoom 설정)
                latitudeDelta:0.01,
                longitudeDelta:0.01,
            },
            markers:[{
                latlng:{latitude:35.890425, longitude:128.611994},
                title:"본관",
                description:"경북대학교 중심"
            },],
        }
 
    }
 
    render(){
        const message = `${this.state.region.latitude} by ${this.state.region.longitude}`
        return(
            <View style={{flex:1, padding:0,}}>
                <MapView 
                    style={{flex:1,}}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={this.state.region}>
                        <Marker
                            coordinate={this.state.region}
                            title="경북대학교"
                            description={message}
                            onCalloutPress={this.clickCallout}></Marker>
                        {
                            this.state.markers.map((marker,index)=>{
                               return <Marker
                                    coordinate={marker.latlng}
                                    title={marker.title}
                                    description={marker.description}
                                    key={index}
                                    ><Image
                                        source={require('../images/marker.png')}
                                        style={{width: 20, height: 20}}
                                        resizeMode="contain">
                                    </Image>
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
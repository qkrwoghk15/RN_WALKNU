import React, {Component} from 'react';
import {View, Text, Linking, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Overlay, Polyline } from 'react-native-maps';
 
export default class TimeMap extends Component{
    constructor(props){
        super();
        const OVERLAY_TOP_LEFT_COORDINATE = [ 35.895890, 128.602600 ];
        const OVERLAY_BOTTOM_RIGHT_COORDINATE = [ 35.884600, 128.618022 ];
        this.state={
            region:{
                latitude: 35.890425,
                longitude: 128.611094,
                latitudeDelta:0.01,
                longitudeDelta:0.01,
            },
            coords:[],
            overlay: {
                bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE]
            },
        }
        props.enrollAry.map((value, index)=>{
            this.state.coords.push({latitude: value.latitude, longitude: value.longitude})
        })
    }
 
    render(){
        const {region, coords, overlay} = this.state
        return(
            <View style={{flex:1, padding:0,}}>
                <MapView 
                    style={{flex:1,}}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={region}
                    zoomEnabled={false}>
                    
                    <Overlay
                        image={require('../images/campus.jpg')}
                        bounds={overlay.bounds}
                        style={{position: 'absolute'}}
                     />

                    {
                        coords.map((coord,index)=>{
                            return <Marker
                                coordinate={coord}
                                title={this.props.enrollAry[index].location}
                                description={`${this.props.enrollAry[index].cname}\n${this.props.enrollAry[index].ltime}`}
                                key={index}>
                            </Marker>
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
 
    clickCallout=()=>{
        Linking.openURL('http://knu.ac.kr');
    }
}
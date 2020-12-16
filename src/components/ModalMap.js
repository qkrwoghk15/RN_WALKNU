import React, {Component} from 'react';
import {View, Text, Linking, Image} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Overlay, Polyline } from 'react-native-maps';
 
export default class ModalMap extends Component{
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
            lids: [],
            paths: [],
            overlay: {
                bounds: [OVERLAY_TOP_LEFT_COORDINATE, OVERLAY_BOTTOM_RIGHT_COORDINATE]
            },
        }
        props.enrollAry.map((value, index)=>{
            this.state.coords.push({latitude: value.latitude/1000000, longitude: value.longitude/1000000})
            if(index < props.enrollAry.length-1)
                this.state.lids.push({startId: props.enrollAry[index].lid, endId: props.enrollAry[index+1].lid })
        })
    }

    componentDidMount(){
        this.state.lids.map((value, index)=>{
            fetch(`http://3.218.74.114/graphql?query={ getPath ( startId: ${value.startId}, endId: ${value.endId} ) {path { latitude longitude } } }`)
                .then((response) => response.json())
                .then((responseJson) => {
                    var path = responseJson.data.getPath?.path
                    //this.setState({paths: this.state.paths.concat()})
                    var temp = []
                    path.map((value)=>(temp.concat({latitude: value.latitude/1000000, longitude: value.longitude/1000000})))
                    this.setState({paths: this.state.paths.concat(temp)})
                })
                .catch((error) => {
                    console.error(error);
                });  
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

                    {
                        
                    }
                    {/* <Polyline
                            coordinates={[this.state.paths[0]]}
                            strokeColor="#000"
                            strokeColors={[
                                '#7F0000',
                                '#B24112',
                            ]}
                            strokeWidth={3}
                        /> */}

                    
                </MapView>
            </View>
        );
    }
 
    clickCallout=()=>{
        Linking.openURL('http://knu.ac.kr');
    }
}
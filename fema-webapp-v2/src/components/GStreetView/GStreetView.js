import React from 'react';
import ReactStreetview from 'react-streetview';
import Geocode from "react-geocode";
import axinstance from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actionCreators from '../../store/actions/index'
import { connect } from 'react-redux';

class GStreetView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            position: null,
            pov: null,
            lat: null,
            long: null
        };
    }

    componentDidMount() {
        this.props.getStreetView(null, null, null)
    }
    

    getAddress = () => {

        Geocode.setApiKey('XXXXXXXXXXXXXXXXXXXX');
        Geocode.setLanguage("en");
        Geocode.setRegion("us");
        Geocode.enableDebug();

        if (this.props.appData) {
            let address = this.props.appData['applicationData'].street + " " + this.props.appData['applicationData'].city + " " + this.props.appData['applicationData'].state
            //let address = "New York"
            console.log(address)
            Geocode.fromAddress(address).then(
                response => {
                    const { lat, lng } = response.results[0].geometry.location;
                    this.setState({ lat: lat, long: lng })
                },
                error => {
                    console.error(error);
                }
            );
        }

    }


    render() {

        const googleMapsApiKey = 'xxxxxxxxxxxxxxxxxxx';
        const streetViewPanoramaOptions = {
            position: { lat: this.state.lat, lng: this.state.long },
            pov: { heading: 100, pitch: 0 },
            zoom: 1
        };

        return (
            <div>
                <h3>Streetview</h3>
                <div style={{
                    width: '300px',
                    height: '300px',
                    backgroundColor: '#eeeeee'
                }}>
                    
                </div>
                <div className='helper'>
                    Position: {JSON.stringify(this.state.position)}<br />
                    Pov: {JSON.stringify(this.state.pov)}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        error: state.applications.appError,
        applications: state.applications.applications,
        loading: state.applications.appLoading,
        token: state.auth.token,
        userId: state.auth.localId

    };
};

const mapDispatchToProps = dispatch => {
    return {
        getStreetView: (size, location, key) => dispatch(actionCreators.getStreetView(size, location, key)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(GStreetView);
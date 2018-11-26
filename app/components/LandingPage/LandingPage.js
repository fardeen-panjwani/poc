import React, { Component } from 'react';
import {
    View, 
    StyleSheet, 
    Text,
} from 'react-native';
import {
    Constants,
    Font
} from 'expo';
import {
    Spinner
} from 'native-base';
import GradientButton from 'react-native-gradient-buttons';
import * as firebase from 'firebase';
import 'firebase/firestore';
import CONSTANTS from '../../constants/envVars';
import {
    YellowBox
} from 'react-native';
import _ from 'lodash';

// disabling React-Navigation v3 static warnings
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        // _console.warn(message);
    }
};

firebase.initializeApp(CONSTANTS.firebaseConfig); 

// configuring firebase/firestore settings
const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}
firestore.settings(settings);

export default class LandingPage extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            fontLoaded: false,
            message: '',
            isLoading: false
        }

        this.toLoginPage = this.toLoginPage.bind(this);
        this.getMessageFromFirebase = this.getMessageFromFirebase.bind(this);
    }

    getMessageFromFirebase = async() => {
        this.setState({
            isLoading: true
        });
        var _value;
        await firebase  
                .firestore()
                .collection('message')
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        _value = doc.data().value;
                    });
                })
                .catch((error) => {
                    this.setState({
                        isLoading: false
                    });
                    console.log(`error getting data: ${error}`);
                });
        this.setState({
            message: _value,
            isLoading: false
        });
    }
    

    componentDidMount = async() => {
        this.setState({
            isLoading: true
        });

        // using custom font files for Welcome Message
        try {
            await Font.loadAsync({
                'sweet-sensations': require('../../../assets/fonts/Sweet-Sensations.ttf')
            });
            this.setState({
                fontLoaded: true,
                isLoading: false
            });
        } catch(error) {
            this.setState({
                fontLoaded: false, 
                isLoading: false
            })
        }
        this.getMessageFromFirebase();
    }

    toLoginPage() {
        this.props.navigation.navigate('LoginPage')
    }
    

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.messageContainer}>
                    {this.state.fontLoaded && this.state.message.length > 0 ? <Text style={styles.messageText}>{this.state.message}</Text> : null}
                </View>
                {this.state.isLoading ? <View style={styles.spinnerContainer}><Spinner /></View> : null}
                <View style={styles.buttonContainer}>
                    {this.state.fontLoaded ? <GradientButton onPressAction={() => this.toLoginPage()} width='90%' text='Login to my app' height='45%' violetPink impact /> : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#ffffff',
        marginTop: Constants.statusBarHeight,
        justifyContent: 'space-between',
    },
    messageContainer: {
        height: '40%',
        backgroundColor: '#ffffff', 
        alignItems: 'center', 
        justifyContent: 'center',
    }, 
    spinnerContainer: {
        height: '45%', 
        backgroundColor: '#ffffff', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    buttonContainer: {
        height: '15%', 
        backgroundColor: '#ffffff', 
        alignItems: 'center',
        justifyContent: 'center'
    },

    // text styles
    messageText: {
        fontFamily: 'sweet-sensations',
        fontSize: 42,
        borderColor: '#000', 
        borderRadius: 5,
        borderWidth: 0.65, 
        paddingTop: 15, 
        paddingBottom: 15, 
        paddingLeft: 38, 
        paddingRight: 38
    }
})
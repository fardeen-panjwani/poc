import React, { Component } from 'react';
import {
    View, 
    StyleSheet, 
    Text, 
} from 'react-native';
import {
    Spinner,
    Input,
} from 'native-base';
import GradientButton from 'react-native-gradient-buttons';
import * as firebase from 'firebase';
import CONSTANTS from '../../constants/envVars';

if (!firebase.apps.length) {
    firebase.initializeApp(CONSTANTS.firebaseConfig);
}


export default class LoginPage extends Component {

    static navigationOptions = {
        title: 'Login'
    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            email: '', 
            password: '',
            error: false, 
            errorMessage: '',
        }

        this.onLoginButtonClicked = this.onLoginButtonClicked.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.toDoctorsPage = this.toDoctorsPage.bind(this);
    }

    toDoctorsPage() {
        this.props.navigation.navigate('DoctorsPage');
    }

    onLoginButtonClicked = async() => {
        // check for empty input fields
        if(this.state.email.length <= 0 || this.state.password.length <= 0) {
            this.setState({
                error: true, 
                errorMessage: "*Empty feilds are not allowed",
                isLoading: false
            })
            return;
        }

        this.setState({
            isLoading: true
        });

        // check for valid email
        if(this.validateEmail(this.state.email)) {
            // email valid
            // check for valid password
            if(this.state.password.length >= 6) {
                // proceed with authentication
                // TODO: add firebase auth
                const { email, password } = this.state;
                firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .then(() => {
                        // email and password verified by firebase
                        this.setState({
                            isLoading: false,
                            error: false,
                            errorMessage: ''
                        });
                        this.toDoctorsPage()
                    })
                    .catch((error) => {
                        // console.warn(error);
                        this.setState({
                            isLoading: false,
                            error: true,
                            errorMessage: '*Invalid credentials!\nPlease try again'
                        });
                    });
                return;
            } else {
                // invalid password
                this.setState({
                    isLoading: false,
                    error: true, 
                    errorMessage: '*Password must have atleast 6 characters'
                })
                return;
            }
        } else {
            // invalid email
            this.setState({
                isLoading: false,
                error: true,
                errorMessage: '*Invalid email'
            })
            return;
        }

    }

    // function to validate email using RegEx
    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Input 
                        style={styles.input} 
                        placeholder='email' 
                        keyboardType="email-address" 
                        autoCapitalize="none"
                        textContentType='emailAddress'
                        onChangeText={(text) => {
                            this.setState({
                                email: text
                            })
                        }}/>
                    <Input 
                        style={styles.input} 
                        placeholder='password' 
                        textContentType='password' 
                        secureTextEntry={true} 
                        onChangeText={(text) => {
                            this.setState({
                                password: text
                            })
                        }}/>
                </View>
                {this.state.isLoading ? <View style={styles.spinnerContainer}><Spinner /></View> : null}
                <View style={styles.buttonContainer}>
                    <GradientButton onPressAction={() => this.onLoginButtonClicked()} width='100%' text="Login" height='50%' blueMarine impact />
                    {this.state.error ? <Text style={styles.errorText}>{this.state.errorMessage}</Text> : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
        padding: 12
    },
    formContainer: {
        height: '25%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    buttonContainer: {
        height: '15%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    spinnerContainer: {
        height: '15%', 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    input: {
        borderRadius: 5, 
        padding: 6, 
        backgroundColor: '#eee',
        marginBottom: 12, 
        width: '100%',
        height: '45%'
    },
    buttonText: {
        color: '#ffffff', 
        fontWeight: 'bold'
    },
    errorText: {
        color: 'red',
        textAlign: 'center', 
        width: '100%', 
        marginTop: 12
    },
    button: {
        width: '100%',
        height: '60%',
        borderRadius: 5,
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#428bca'
    }
});
import React, { Component } from 'react';
import {
    View, 
    StyleSheet, 
    BackHandler
} from 'react-native';
import {
    Constants,
} from 'expo';
import {
    Spinner,
    Picker
} from 'native-base';
import {
    Table,
    Row,
    Rows,
} from 'react-native-table-component';
import * as firebase from 'firebase';
import 'firebase/firestore';
import CONSTANTS from '../../constants/envVars';

// checking for duplicate firebase app before initializing
if (!firebase.apps.length) {
    firebase.initializeApp(CONSTANTS.firebaseConfig);
}

// configuring firebase/firestore settings
const firestore = firebase.firestore();
const settings = {
    timestampsInSnapshots: true
}
firestore.settings(settings);


export default class DoctorsPage extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            isDropdownLoading: false, 
            isDocDataLoading: false, 
            dropdownData: [],
            speciality: '',
            docTableHead: ['Name', 'Speciality'],
            docTableData: [
                ['',''] // empty cells for aesthetic purposes
            ]
        }

        this.getSpecialDoctors = this.getSpecialDoctors.bind(this);
        this.onBackPress = this.onBackPress.bind(this);
    }

    async componentWillMount() {
        this.getDropdownData();
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
    }
    onBackPress = () => {
        BackHandler.exitApp();
    };

    async getDropdownData() {
        this.setState({
            isDropdownLoading: true
        })
        var items = [{'value': 'speciality'}];
        await firestore.collection('/specialities').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
        });
        console.log(`items: ${JSON.stringify(items)}`)
        this.setState({
            dropdownData: items, 
            isDropdownLoading: false
        })
    }

    async getSpecialDoctors(selectedValue) {
        this.setState({
            isDocDataLoading: true
        });
        await firestore
                .collection('doctors')
                .where('speciality', '==', selectedValue)
                .get()
                .then((doctors) => {
                    this.state.docTableData = [];
                    doctors.forEach((doctor) => {
                        this.state.docTableData.push([doctor.data().name, doctor.data().speciality]);
                    });
                })
                .catch((error) => {
                    this.setState({
                        isDocDataLoading: false,
                    });
                    console.log(`error getting doc data: ${error}`);
                });
        this.setState({
            isDocDataLoading: false
        });
    }

    render() {
        return(
            <View style={styles.container}>
                <View style={styles.pickerContainer}>
                    {
                        this.state.isDropdownLoading ? 
                        <Spinner /> : 
                        <Picker 
                            selectedValue={this.state.speciality}
                            style={styles.dropdown} 
                            onValueChange={(itemValue, itemIndex) => {
                                this.setState({ speciality: itemValue })
                                this.getSpecialDoctors(itemValue)
                            }}>
                                {this.state.dropdownData.map((item, index) => {
                                    return (<Picker.Item label={item.value} value={item.value} key={index}/>) 
                                })}
                            </Picker>
                    }
                </View>
                <View style={styles.listContainer}>
                    {
                        this.state.isDocDataLoading ? 
                        <Spinner /> : 
                        <Table style={{width: '100%'}} borderStyle={{borderWidth: 2, borderColor: '#000'}}>
                            <Row data={this.state.docTableHead} style={styles.tableHeader} textStyle={styles.tableHeaderText}/>
                            <Rows data={this.state.docTableData} textStyle={styles.tableText}/>
                        </Table>
                    }
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#ffffff',
        marginTop: Constants.statusBarHeight,
    },
    spinnerContainer: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#ffffff'
    },
    pickerContainer: {
        height: '10%', 
        backgroundColor: '#ffffff', 
        justifyContent: 'center',
        alignItems: 'center'
    }, 
    listContainer: {
        height: '90%', 
        width: '100%',
        padding: 15, 
        alignItems: 'center', 
        backgroundColor: '#ffffff',
    },
    dropdown: {
        height: '75%',
        width: '100%',
    },
    tableHeader: {
        height: 40,
        backgroundColor: '#eee'
    },
    tableHeaderText: {
        margin: 6, 
        fontWeight: 'bold', 
        fontSize: 16,
        textAlign: 'center',
    },
    tableText: {
        margin: 6,
        fontSize: 15
    }
});
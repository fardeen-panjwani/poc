import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';

// pages
import LandingPage from './app/components/LandingPage/LandingPage';
import LoginPage from './app/components/LoginPage/LoginPage';
import DoctorsPage from './app/components/DoctorsPage/DoctorsPage';

const MainNavigator = createStackNavigator({
  LandingPage: {
    screen: LandingPage
  },
  LoginPage: {
    screen: LoginPage
  },
  DoctorsPage: {
    screen: DoctorsPage
  }
});
const App = createAppContainer(MainNavigator);

export default App;
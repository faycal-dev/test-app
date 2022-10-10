import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ButtomNavigator from './ButtomNavigator';

export default function RoootNavigator(){
    return(
        <NavigationContainer>
            <ButtomNavigator />
        </NavigationContainer>
    )
}
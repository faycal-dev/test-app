/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import RoootNavigator from './src/navigation/RootNavigator';


const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return <RoootNavigator />;
};

export default App;

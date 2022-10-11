import React, {useEffect, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notification from '../screens/notification';
import Auth from '../screens/Login';
import Register from '../screens/Register';
import ResetPassword from '../screens/ForgotPassword';
import Photo from '../screens/photo';
import Calculator from '../screens/calculator';
import Chat from '../screens/chat';
import colors from '../global/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import {TouchableOpacity, StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';

const Home = createBottomTabNavigator();
const AuthNav = createNativeStackNavigator();

const TabButton = props => {
  const {item, onPress, accessibilityState} = props;
  const focused = accessibilityState.selected;
  const viewRef = React.useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({
        0: {scale: 0.5, rotate: '0deg'},
        1: {scale: 1.3, rotate: '360deg'},
      });
    } else {
      viewRef.current.animate({
        0: {scale: 1.3, rotate: '360deg'},
        1: {scale: 1, rotate: '0deg'},
      });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View ref={viewRef} duration={700} style={styles.container}>
        <Icon
          name={focused ? item.activeIcon : item.inActiveIcon}
          color={focused ? colors.primary : colors.silver}
          size={25}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function ButtomNavigator() {
  const [isAuth, setIsAuth] = React.useState(false);
  const [initializing, setInitializing] = React.useState(true);

  async function onAuthStateChanged(user) {
    if (!user) {
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }

    if (initializing) setInitializing(false);
  }

  React.useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  return (
    <>
      {isAuth ? (
        <Home.Navigator>
          <Home.Screen
            name="NotificationScreen"
            component={Notification}
            options={{
              title: 'Notification Screen',
              tabBarShowLabel: false,
              // tabBarIcon: ({focused, size}) => (
              //   <Icon
              //     name={focused ? 'notifications-outline' : 'notifications'}
              //     color={focused ? colors.primary : colors.silver}
              //     size={focused ? 30 : 27}
              //   />
              // ),
              tabBarButton: props => (
                <TabButton
                  {...props}
                  item={{
                    activeIcon: 'notifications',
                    inActiveIcon: 'notifications-outline',
                  }}
                />
              ),

              headerShown: false,
            }}
          />
          <Home.Screen
            name="PhotoScreen"
            component={Photo}
            options={{
              title: 'Photo Screen',
              tabBarShowLabel: false,
              // tabBarIcon: ({focused, size}) => (
              //   <Icon
              //     name={focused ? 'camera-outline' : 'camera'}
              //     color={focused ? colors.primary : colors.silver}
              //     size={focused ? 30 : 27}
              //   />
              // ),
              tabBarButton: props => (
                <TabButton
                  {...props}
                  item={{
                    activeIcon: 'camera',
                    inActiveIcon: 'camera-outline',
                  }}
                />
              ),

              headerShown: false,
            }}
          />
          <Home.Screen
            name="ChatScreen"
            component={Chat}
            options={{
              title: 'Chat Screen',
              tabBarShowLabel: false,
              // tabBarIcon: ({focused, size}) => (
              //   <Icon
              //     name={focused ? 'chatbox-outline' : 'chatbox'}
              //     color={focused ? colors.primary : colors.silver}
              //     size={focused ? 30 : 27}
              //   />
              // ),
              tabBarButton: props => (
                <TabButton
                  {...props}
                  item={{
                    activeIcon: 'chatbox',
                    inActiveIcon: 'chatbox-outline',
                  }}
                />
              ),

              headerShown: false,
            }}
          />
          <Home.Screen
            name="CalculatorScreen"
            component={Calculator}
            options={{
              title: 'Calculator Screen',
              tabBarShowLabel: false,
              // tabBarIcon: ({focused, size}) => (
              //   <Icon
              //     name={focused ? 'calculator-outline' : 'calculator'}
              //     color={focused ? colors.primary : colors.silver}
              //     size={focused ? 30 : 27}
              //   />
              // ),
              tabBarButton: props => (
                <TabButton
                  {...props}
                  item={{
                    activeIcon: 'calculator',
                    inActiveIcon: 'calculator-outline',
                  }}
                />
              ),

              headerShown: false,
            }}
          />
        </Home.Navigator>
      ) : (
        <AuthNav.Navigator>
          <AuthNav.Screen
            name="Login"
            component={Auth}
            options={{headerShown: false}}
          />
          <AuthNav.Screen
            name="Register"
            component={Register}
            options={{headerShown: false}}
          />
          <AuthNav.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{headerShown: false}}
          />
        </AuthNav.Navigator>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

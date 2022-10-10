import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Notification from '../screens/notification';
import Auth from '../screens/Login';
import Register from '../screens/Register';
import ResetPassword from '../screens/ForgotPassword';
import Photo from '../screens/photo';
import Chat from '../screens/chat';
import colors from '../global/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

const Home = createBottomTabNavigator();
const AuthNav = createNativeStackNavigator();

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

  if (initializing) return null
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
              tabBarIcon: ({focused, size}) => (
                <Icon
                  name={focused ? 'notifications-outline' : 'notifications'}
                  color={focused ? colors.primary : colors.silver}
                  size={focused ? 30 : 27}
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
              tabBarIcon: ({focused, size}) => (
                <Icon
                  name={focused ? 'camera-outline' : 'camera'}
                  color={focused ? colors.primary : colors.silver}
                  size={focused ? 30 : 27}
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
              tabBarIcon: ({focused, size}) => (
                <Icon
                  name={focused ? 'chatbox-outline' : 'chatbox'}
                  color={focused ? colors.primary : colors.silver}
                  size={focused ? 30 : 27}
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

import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PushNotification from 'react-native-push-notification';
import colors from '../global/colors';

const WIDTH = Dimensions.get('screen').width;

const Notification = props => {
  const [notifType, setNotifType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [Title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [Time, setTime] = useState(0);
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    createChannels();
  }, []);

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'nordestone Channel',
      channelName: 'nordestone',
    });
  };

  const pushNotif = () => {
    if (notifType == 'local') {
      PushNotification.localNotification({
        channelId: 'nordestone Channel',
        title: Title,
        message: message,
      });
    } else {
      PushNotification.localNotificationSchedule({
        channelId: 'nordestone Channel',
        title: Title,
        message: message,
        date: new Date(Date.now() + Time * 1000),
        allowWhileIdle: true,
      });
    }
    Animated.spring(animatedValue, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
      }).start();
    setShowModal(false);
    setNotifType(null);
  };

  const textChangeHandler = (type, text) => {
    switch (type) {
      case 'title':
        setTitle(text);
        break;
      case 'message':
        setMessage(text);
        break;
      case 'time':
        setTime(text);
        break;

      default:
        break;
    }
  };

  return (
    <>
      <Animated.View style={{...styles.container, opacity: animatedValue}}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.logOut}
          onPress={() => {
            auth().signOut();
          }}>
          <Text style={styles.lougOutButtonText}>Log out</Text>
        </TouchableOpacity>

        <View>
          <Image
            source={require('../../assets/user_notif.png')}
            style={styles.Image}
          />
        </View>

        <View style={styles.notifTypeView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setNotifType('local');
              setShowModal(true);
              Animated.spring(animatedValue, {
                toValue: 0.3,
                delay: 200,
                useNativeDriver: true,
              }).start();
            }}
            style={{
              ...styles.notifType,
              backgroundColor: notifType == 'local' ? colors.primary : 'white',
            }}>
            <Ionicons
              name="notifications-outline"
              size={35}
              color={notifType == 'local' ? 'white' : colors.primary}
              style={styles.iconView}
            />
            <Text
              style={{color: notifType == 'local' ? 'white' : colors.primary}}>
              Local notif
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setNotifType('scheduled');
              setShowModal(true);
              Animated.spring(animatedValue, {
                toValue: 0.3,
                delay: 200,
                useNativeDriver: true,
              }).start();
            }}
            style={{
              ...styles.notifType,
              backgroundColor:
                notifType == 'scheduled' ? colors.primary : 'white',
            }}>
            <Ionicons
              name="timer-outline"
              size={35}
              color={notifType == 'scheduled' ? 'white' : colors.primary}
              style={styles.iconView}
            />
            <Text
              style={{
                color: notifType == 'scheduled' ? 'white' : colors.primary,
              }}>
              Scheduled notif
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {showModal && (
        <Animated.View
          style={{
            ...styles.modal,
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0.3, 1],
                  outputRange: [0, -WIDTH * 2],
                }),
              },
            ],
          }}>
          <TouchableOpacity
            style={styles.modalQuitButton}
            activeOpacity={0.8}
            onPress={() => {
              setShowModal(false);
              Animated.spring(animatedValue, {
                toValue: 1,
                delay: 80,
                useNativeDriver: true,
              }).start();
              setNotifType(null)

            }}>
            <Ionicons name="close" size={25} color="black" />
          </TouchableOpacity>
          <TextInput
            style={{...styles.textInput, marginTop: 30}}
            keyboardType="default"
            placeholder="Title of the notification"
            placeholderTextColor={colors.grey_fade}
            onChangeText={textChangeHandler.bind(this, 'title')}
          />
          <TextInput
            style={styles.textInput}
            keyboardType="default"
            placeholder="Message of the notification"
            placeholderTextColor={colors.grey_fade}
            onChangeText={textChangeHandler.bind(this, 'message')}
          />
          {notifType == 'scheduled' && (
            <TextInput
              style={styles.textInput}
              keyboardType="number-pad"
              placeholder="Number of seconds"
              placeholderTextColor={colors.grey_fade}
              onChangeText={textChangeHandler.bind(this, 'time')}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.notifButton}
            onPress={pushNotif}>
            <Text style={{color: colors.grey_fade}}>Send Notification</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
  },
  logOut: {
    position: 'absolute',
    top: 20,
    left: 20,
    borderColor: colors.grey_fade,
    borderWidth: 1,
    backgroundColor:"white",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lougOutButtonText: {
    fontSize: 12,
    color: colors.danger,
  },
  Image: {
    width: 170,
    height: 170,
    // borderRadius: 10,
    alignSelf: 'center',
    marginTop: 30,
  },
  notifTypeView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  notifType: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 170,
    width: '48%',
    borderRadius: 10,
    borderColor: colors.grey_fade,
    borderWidth: 1,
    backgroundColor: 'white',
  },
  button: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignSelf: 'center',
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  modal: {
    position: 'absolute',
    top: 200,
    width: WIDTH * 0.9,
    elevation: 10,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.grey_fade,
    borderWidth: 1.5,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  textInput: {
    width: '100%',
    height: 45,
    borderRadius: 5,
    borderColor: colors.grey_fade,
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: '#000',
  },
  notifButton: {
    width: '90%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: colors.danger,
    alignSelf: 'center',
    marginBottom: 30,
  },
  modalQuitButton: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
});

export default Notification;

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../global/colors';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import ProgressBar from 'react-native-progress/Bar';

const UID = auth().currentUser?.uid;
const reference = storage().ref(`/images/${UID}.png`);

const WIDTH = Dimensions.get('screen').width;

const Photo = props => {
  const [pickType, setpickType] = useState(null);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  const getImage = async () => {
    try {
      const url = await reference.getDownloadURL();
      setImage(url);
    } catch (error) {
      Alert.alert('No photo', 'You have never uploaded a photo', [
        {text: 'ok', style: 'cancel'},
      ]);
    }
  };

  useEffect(() => {
    getImage();
  }, []);

  let options = {
    saveToPhotos: false,
    mediaType: 'photo',
  };

  const lunchCamera = async () => {
    try {
      setpickType('Camera');
      const result = await launchCamera(options);
      if (!result.didCancel) {
        const task = reference.putFile(result.assets[0].uri);
        setImage(result.assets[0].uri);

        setShowModal(true);
        Animated.spring(animatedValue, {
          toValue: 1,
          delay: 200,
          useNativeDriver: true,
        }).start();

        task.on('state_changed', taskSnapshot => {
          let advancement =
            taskSnapshot.bytesTransferred / taskSnapshot.totalBytes;
          setProgress(advancement);
        });

        task.then(() => {
          setProgress(0);
          setShowModal(false);
          Animated.spring(animatedValue, {
            toValue: 0,
            delay: 80,
            useNativeDriver: true,
          }).start();
        });
      }
    } catch (error) {
      setShowModal(false);
      Alert.alert(error.code, 'Verify your connection', [
        {text: 'ok', style: 'cancel'},
      ]);
    }
    setpickType(null);
  };

  const openGallery = async () => {
    try {
      setpickType('Gallery');
      const result = await launchImageLibrary(options);
      if (!result.didCancel) {
        const task = reference.putFile(result.assets[0].uri);
        setImage(result.assets[0].uri);

        setShowModal(true);
        Animated.spring(animatedValue, {
          toValue: 1,
          delay: 200,
          useNativeDriver: true,
        }).start();

        task.on('state_changed', taskSnapshot => {
          let advancement =
            taskSnapshot.bytesTransferred / taskSnapshot.totalBytes;
          setProgress(advancement);
        });

        task.then(() => {
          setProgress(0);
          setShowModal(false);
          Animated.spring(animatedValue, {
            toValue: 0,
            delay: 80,
            useNativeDriver: true,
          }).start();
        });
      }
    } catch (error) {
      setShowModal(false);
      Alert.alert(error.code, 'Verify your connection', [
        {text: 'ok', style: 'cancel'},
      ]);
    }
    setpickType(null);
  };

  return (
    <View style={styles.container}>
      <View>
        {image && !showModal ? (
          <Image
            source={{uri: image}}
            style={{
              ...styles.Image,
              width: WIDTH * 0.7,
              height: WIDTH * 0.7,
              borderRadius: 20,
            }}
          />
        ) : image && showModal ? (
          <View
            style={{
              width: WIDTH * 0.7,
              height: WIDTH * 0.7,
              borderRadius: 20,
              alignSelf: 'center',
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: colors.grey_fade,
            }}>
            <ProgressBar
              progress={progress}
              width={200}
              color={colors.primary}
              borderWidth={1}
              borderColor={colors.primary}
              useNativeDriver={true}
            />
          </View>
        ) : (
          <Image
            source={require('../../assets/selfie.png')}
            style={styles.Image}
          />
        )}
      </View>

      <View style={styles.notifTypeView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openGallery}
          style={{
            ...styles.notifType,
            backgroundColor: pickType == 'Gallery' ? colors.primary : 'white',
          }}>
          <Ionicons
            name="images-outline"
            size={35}
            color={pickType == 'Gallery' ? 'white' : colors.primary}
            style={styles.iconView}
          />
          <Text
            style={{color: pickType == 'Gallery' ? 'white' : colors.primary}}>
            Open gallery
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={lunchCamera}
          style={{
            ...styles.notifType,
            backgroundColor: pickType == 'Camera' ? colors.primary : 'white',
          }}>
          <Ionicons
            name="camera-outline"
            size={35}
            color={pickType == 'Camera' ? 'white' : colors.primary}
            style={styles.iconView}
          />
          <Text
            style={{
              color: pickType == 'Camera' ? 'white' : colors.primary,
            }}>
            Open camera
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-evenly',
  },
  Image: {
    width: 130,
    height: 130,
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

  modal: {
    position: 'absolute',
    top: 250,
    width: WIDTH * 0.9,
    elevation: 10,
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.grey_fade,
    borderWidth: 1.5,
    alignSelf: 'center',
    backgroundColor: 'white',
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
  modalText: {
    fontSize: 20,
    color: '#000',
    alignSelf: 'center',
    marginBottom: 20,
  },
});

export default Photo;

import React, {useReducer, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import colors from '../global/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {GoogleSignin} from '@react-native-google-signin/google-signin';
GoogleSignin.configure({
  webClientId:
    '759171197061-2st1qb9r60i0nq3dah63o210rp8dpntf.apps.googleusercontent.com',
});

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    const updatedTouches = {
      ...state.inputValidities,
      [action.input]: action.isTouched,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputTuched: updatedTouches,
      inputValues: updatedValues,
    };
  }
  return state;
};

const Register = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      fullName: '',
    },
    inputValidities: {
      email: false,
      password: false,
      fullName: true,
    },
    inputTuched: {
      email: false,
      password: false,
      fullName: false,
    },
    formIsValid: false,
  });

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const textChangeHandler = (inputIdentifier, text) => {
    let isValid = false;
    if (inputIdentifier == 'email' && emailRegex.test(text.toLowerCase())) {
      isValid = true;
    } else if (
      inputIdentifier == 'password' &&
      text.trim().length > 0 &&
      text.length > 8 &&
      passwordRegex.test(text)
    ) {
      isValid = true;
    } else if (inputIdentifier == 'fullName' && text.trim().length > 0) {
      isValid = true;
    }
    dispatchFormState({
      type: FORM_INPUT_UPDATE,
      value: text,
      isValid: isValid,
      isTouched: true,
      input: inputIdentifier,
    });
  };

  async function onGoogleButtonPress() {
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  const sendText = async () => {
    const date = new Date();
    let data = {
      message: "Write a message",
      time: `${date.toISOString().split('T')[0]} ${
        date.toISOString().split('T')[1].split('.')[0]
      }`,
      createdAt: date,
    };
    try {
      USER = auth().currentUser
      await firestore().collection(USER?.uid).add(data);
    } catch (error) {
      Alert.alert(error.code, 'Verify your connection', [
        {text: 'ok', style: 'cancel'},
      ]);
    }
  };

  const loginHandler = async () => {
    if (formState.formIsValid) {
      setIsLoading(true);
      try {
        const response = await auth().createUserWithEmailAndPassword(
          formState.inputValues.email,
          formState.inputValues.password,
        );
        if (formState.inputValues.fullName !== '') {
          await auth().currentUser.updateProfile({
            displayName: formState.inputValues.fullName,
          });
        }
        // await auth().currentUser.sendEmailVerification({
        //   handleCodeInApp: true,
        //   url: 'https://nordestone-test.firebaseapp.com',
        // });
        sendText()
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        Alert.alert(err.code, 'You have to enter a valid e-mail or password', [
          {text: 'ok', style: 'cancel'},
        ]);
      }
    } else {
      Alert.alert(
        'Invalid e-mail or password',
        'You have to enter a valid e-mail or password',
        [{text: 'ok', style: 'cancel'}],
      );
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
        }}>
        <ActivityIndicator size="large" color={colors.yellow} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.imgContainer}>
          <Image
            source={require('../../assets/react.png')}
            style={styles.img}
          />
        </View>
        <View style={styles.inputs}>
          <Text style={styles.text}>Connecte your self</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder="E-mail Address"
            placeholderTextColor={colors.grey_fade}
            onChangeText={textChangeHandler.bind(this, 'email')}
          />
          {!formState.inputValidities.email &&
            formState.inputValues.email.length != 0 &&
            formState.inputTuched.email && (
              <Text style={styles.alertText}>
                You have to enter a valid e-mail !
              </Text>
            )}
          <TextInput
            style={styles.input}
            keyboardType="name-phone-pad"
            placeholder="Full name"
            placeholderTextColor={colors.grey_fade}
            onChangeText={textChangeHandler.bind(this, 'fullName')}
          />
          <TextInput
            style={styles.input}
            secureTextEntry
            textContentType="password"
            placeholder="password"
            placeholderTextColor={colors.grey_fade}
            onChangeText={textChangeHandler.bind(this, 'password')}
          />
          {!formState.inputValidities.password &&
            formState.inputValues.password.length != 0 &&
            formState.inputTuched.password && (
              <Text style={styles.alertText}>
                You have to enter a password with more than 8 letters,
                characters and numbers
              </Text>
            )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                height: 55,
                width: '100%',
                backgroundColor: colors.yellow,
                alignItems: 'center',
                borderRadius: 5,
                justifyContent: 'center',
              }}
              onPress={loginHandler}>
              <Text style={{color: colors.primary, fontSize: 20}}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.media}>
          <View style={{marginTop: 15, flexDirection: 'row'}}>
            <Text style={styles.smallerText}>You have an account ? </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                props.navigation.push('Login');
              }}>
              <Text
                style={{
                  fontSize: 13,
                  color: 'white',
                }}>
                Connect to your account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <View style={{marginTop: 40, width: '80%', alignItems: 'center'}}>
          <Text style={styles.smallerText}>Other connection options</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              ...styles.input,
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }>
            <Image
              style={{height: 35, width: 35}}
              source={require('../../assets/2991148.png')}
            />
            <Text style={styles.mediumText}>Continue with Google</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: colors.primary,
    minHeight: Dimensions.get('window').height,
  },
  imgContainer: {
    marginTop: 100,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 15,
  },
  media: {
    // marginTop: 20,
    alignItems: 'center',
  },
  img: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  inputs: {
    width: Dimensions.get('window').width * 0.8,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'white',
    // fontFamily: "futura-meduim",
  },
  smallerText: {fontSize: 13, color: colors.grey_fade},
  mediumText: {fontSize: 15, color: 'white', marginLeft: 20},
  input: {
    width: '100%',
    height: 60,
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: 'white',
    paddingHorizontal: 30,
    marginTop: 20,
    color: 'white',
  },
  alertText: {
    color: colors.wrning,
    // fontFamily: "futura-meduim",
  },
});

export default Register;

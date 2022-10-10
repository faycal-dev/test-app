import React, {useState} from 'react';
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

const ResetPassword = props => {
  const routEmail = props.route.params?.email;
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(routEmail);

  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const textChangeHandler = e => {
    setEmail(e);
  };

  const loginHandler = async () => {
    setIsLoading(true);
    try {
      const response = await auth().sendPasswordResetEmail(email);
      setIsLoading(false);
      props.navigation.goBack();
    } catch (err) {
      setIsLoading(false);
      Alert.alert(
        err.code,
        'Veuillez saisir un e-mail ou un mot de passe valide',
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
          <Text style={styles.text}>Change password</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            placeholder="E-mail Address"
            value={email}
            placeholderTextColor={colors.grey_fade}
            onChangeText={textChangeHandler}
          />
          {!emailRegex.test(email.toLocaleLowerCase()) && email.length > 0 && (
            <Text style={styles.alertText}>
              You have to enter a valid e-mail !
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
                Send link
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    marginTop: 150,
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

export default ResetPassword;

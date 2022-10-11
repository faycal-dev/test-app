import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  Alert,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import colors from '../global/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const WIDTH = Dimensions.get('screen').width;

const Calculator = props => {
  const [firsValue, setFirstValue] = useState(0);
  const [secondValue, setSecondValue] = useState(0);
  const [operation, setOperation] = useState('Choose operation');
  const [showDropDown, setShowDropDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const sendData = async () => {
    let data = {
      operation: operation,
      firstValue: firsValue,
      SecondValue: secondValue,
    };
    try {
      setIsLoading(true);
      const response = await fetch(
        'https://nordestonetesapi.herokuapp.com/calculator/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      const res = await response.json();
      console.log(res);
      setIsLoading(false);
      Alert.alert('The result is: ', `${res}`, [{text: 'ok', style: 'cancel'}]);
    } catch (err) {
      setIsLoading(false);
      Alert.alert(err.message, 'Please verify your connection ', [
        {text: 'ok', style: 'cancel'},
      ]);
    }
  };

  const textChangeHandler = (type, text) => {
    switch (type) {
      case 'first':
        setFirstValue(text);
        break;
      case 'second':
        setSecondValue(text);
        break;

      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require('../../assets/calculator.png')}
          style={styles.Image}
        />
      </View>
      <View style={styles.numbersInputContainer}>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="First value"
          placeholderTextColor={colors.silver}
          onChangeText={textChangeHandler.bind(this, 'first')}
          value={firsValue}
        />
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="Second value"
          placeholderTextColor={colors.silver}
          onChangeText={textChangeHandler.bind(this, 'second')}
          value={secondValue}
        />
      </View>
      <View style={styles.dropDownContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (showDropDown) {
              Animated.spring(animatedValue, {
                toValue: 0,
                delay: 80,
                useNativeDriver: true,
              }).start();
            } else {
              Animated.spring(animatedValue, {
                toValue: 1,
                delay: 300,
                useNativeDriver: true,
              }).start();
            }
            setShowDropDown(prevState => !prevState);
          }}
          style={styles.dropDown}>
          <Text style={styles.smallText}>{operation}</Text>
          <Ionicons
            name={showDropDown ? 'chevron-up' : 'chevron-down'}
            size={25}
            color={colors.silver}
          />
        </TouchableOpacity>

        <Animated.View
          style={{
            ...styles.dropDownChoicesContainer,
            transform: [
              {
                scale: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          }}>
          <TouchableHighlight
            underlayColor={colors.primary}
            onPress={() => {
              setOperation('addition');
              setShowDropDown(false);
              Animated.spring(animatedValue, {
                toValue: 0,
                delay: 80,
                useNativeDriver: true,
              }).start();
            }}
            style={styles.dropDownItem}>
            <Text style={styles.smallText}>addition (+)</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.primary}
            onPress={() => {
              setOperation('subtraction');
              setShowDropDown(false);
              Animated.spring(animatedValue, {
                toValue: 0,
                delay: 80,
                useNativeDriver: true,
              }).start();
            }}
            style={{
              ...styles.dropDownItem,
              borderTopColor: colors.grey_fade,
              borderTopWidth: 1,
              borderBottomColor: colors.grey_fade,
              borderBottomWidth: 1,
            }}>
            <Text style={styles.smallText}>subtraction (-)</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.primary}
            onPress={() => {
              setOperation('multiplication');
              setShowDropDown(false);
              Animated.spring(animatedValue, {
                toValue: 0,
                delay: 80,
                useNativeDriver: true,
              }).start();
            }}
            style={styles.dropDownItem}>
            <Text style={styles.smallText}>multiplication (*)</Text>
          </TouchableHighlight>
        </Animated.View>

        <Animated.View
          style={{
            zIndex: animatedValue.interpolate({
              inputRange: [0, 0.1, 1],
              outputRange: [10, 5, 0],
            }),
          }}>
          <TouchableOpacity
            style={{
              height: 50,
              width: '100%',
              backgroundColor: colors.primary,
              alignItems: 'center',
              borderRadius: 5,
              justifyContent: 'center',
              marginTop: 30,
            }}
            activeOpacity={0.8}
            onPress={sendData}>
            <Text style={{color: colors.yellow, fontSize: 18}}>Calculate</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  numbersInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  Image: {
    width: 170,
    height: 170,
    // borderRadius: 10,
    alignSelf: 'center',
    marginTop: 100,
  },
  input: {
    height: 50,
    width: '45%',
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: colors.grey_fade,
    paddingHorizontal: 20,
    marginTop: 90,
    color: 'black',
    backgroundColor: 'white',
  },
  dropDownContainer: {},
  dropDown: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: colors.grey_fade,
    paddingHorizontal: 30,
    marginTop: 50,
    backgroundColor: 'white',
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropDownChoicesContainer: {
    position: 'absolute',
    borderWidth: 1.5,
    borderRadius: 5,
    borderColor: colors.grey_fade,
    marginTop: 10,
    backgroundColor: 'white',
    width: '95%',
    justifyContent: 'flex-start',
    zIndex: 5,
    top: 100,
    elevation: 5,
    alignSelf: 'center',
    // paddingTop: 10,
  },
  dropDownItem: {
    width: '100%',
    height: 50,
    paddingHorizontal: 30,

    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  smallText: {fontSize: 15, color: colors.silver},
});

export default Calculator;

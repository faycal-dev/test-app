import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
  FlatList,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import colors from '../global/colors';
import Ionicons from 'react-native-vector-icons/Feather';
import storage from '@react-native-firebase/storage';
import PushNotification from 'react-native-push-notification';

const USER = auth().currentUser;
const reference = storage().ref(`/images/${USER?.uid}.png`);
const WIDTH = Dimensions.get('screen').width;

const Chat = props => {
  const [text, setText] = useState('');
  const [index, setIndex] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const flatList = useRef();

  const getImage = async () => {
    try {
      const url = await reference.getDownloadURL();
      setImage(url);
    } catch (error) {
      console.log(error);
    }
  };

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'nordestone-chat-Channel',
      channelName: 'nordestone Chat',
    });
  };

  const textChangeHandler = e => {
    setText(e);
  };

  const sendText = async () => {
    const date = new Date();
    let data = {
      message: text,
      time: `${date.toISOString().split('T')[0]} ${
        date.toISOString().split('T')[1].split('.')[0]
      }`,
      createdAt: date,
    };
    setText('');
    try {
      await firestore().collection(USER?.uid).add(data);
    } catch (error) {
      Alert.alert(error.code, 'Verify your connection', [
        {text: 'ok', style: 'cancel'},
      ]);
    }
  };

  useEffect(() => {
    getImage();
    createChannels();
    let messagesNumber = 0;
    const subscriber = firestore()
      .collection(USER?.uid)
      .orderBy('createdAt')
      .limit(30)
      .onSnapshot(documentSnapshot => {
        messagesNumber += 1;
        const data = documentSnapshot.docs.map(
          doc => doc.data(),
          //   id: doc.id,
        );
        if (messagesNumber > 1) {
          const lastMessage = data[data.length - 1].message;
          PushNotification.localNotification({
            channelId: 'nordestone-chat-Channel',
            title: USER?.displayName ? USER?.displayName : 'To your self',
            message: lastMessage,
          });
        }
        // if (data.length > 0) {
        //   flatList.current?.scrollToEnd({ Animated: true});
        //   // setIndex(data.length - 1);
        // }
        setMessages(data);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    if (index !== -1) {
      flatList.current?.scrollToEnd({ Animated: true});
    }
  }, [messages]);

  const renderItem = ({item}) => {
    // console.log(item.message)
    return (
      <View style={{marginTop: 20}}>
        <Text style={{...styles.smallText, marginLeft: 30}}>{item.time}</Text>
        <View style={styles.messageView}>
          <Text style={{...styles.text, opacity: 0.8}}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {}}
        style={styles.userView}>
        <Image source={{uri: image}} style={styles.ProfileImage} />
        <View style={styles.emailView}>
          <Text style={styles.text}>
            {USER?.displayName ? USER.displayName : 'Your profile'}
          </Text>
          <Text style={styles.smallText}>{USER.email}</Text>
        </View>
      </TouchableOpacity>
      <FlatList
        ref={flatList}
        data={messages}
        keyExtractor={item => item.createdAt}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          //   backgroundColor:"red",
        }}
        onLayout={() => flatList.current.scrollToEnd({animated: true})}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          keyboardType="default"
          placeholder="Type a message..."
          placeholderTextColor={colors.grey_fade}
          onChangeText={textChangeHandler}
          value={text}
        />
        <TouchableOpacity
          onPress={sendText}
          activeOpacity={0.8}
          style={styles.sendButton}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  inputContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
    height: 60,
    backgroundColor: 'white',
    borderRadius: 20,
    borderColor: colors.grey_fade,
    borderWidth: 1,
    marginBottom: 20,
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    elevation: 5,
    zIndex: 5,
  },
  textInput: {
    paddingLeft: 10,
    width: '80%',
    height: '100%',
    paddingHorizontal: 10,
    color: '#000',
    // backgroundColor: 'red',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 3,
    paddingTop: 3,
  },
  userView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: WIDTH,
    // height: 80,
    paddingVertical: 10,
    // position: 'absolute',
    alignSelf: 'center',
    top: 0,
    backgroundColor: 'white',
    elevation: 5,
    zIndex: 5,
  },
  ProfileImage: {
    width: WIDTH * 0.12,
    height: WIDTH * 0.12,
    borderRadius: WIDTH * 0.07,
    marginLeft: 20,
  },
  emailView: {
    marginLeft: 50,
  },
  text: {fontSize: 14, color: 'black', fontWeight: '600'},
  smallText: {
    fontSize: 13,
    opacity: 0.5,
    color: 'black',
  },
  messageView: {
    padding: 20,
    backgroundColor: colors.info,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
});

export default Chat;

import React, { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Alert,
  PermissionsAndroid,
  TouchableOpacity,
} from "react-native";
import messaging from "@react-native-firebase/messaging";
import { Colors } from "react-native/Libraries/NewAppScreen";
import PushNotification from "react-native-push-notification";

const Test = (props) => {
  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      PermissionsAndroid.PERMISSIONS.SCHEDULE_EXACT_ALARM,
      PermissionsAndroid.PERMISSIONS.USE_EXACT_ALARM,
      {
        title: "Allow app to get notification",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        getInitialNotification(enabled);
      } else {
        console.log("Failed token status:", authStatus);
      }
    } else {
      console.log("permission denied");
    }
  };

  const getInitialNotification = (enabled) => {
    PushNotification.createChannel(
      {
        channelId: "channel-id", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications",
        playSound: false,
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => {
        messaging()
          .getToken()
          .then((token) => {
            console.log(token, "tokennnn");
            const unsubscribe = messaging().onMessage(async (remoteMessage) => {
              console.log("A new FCM message", JSON.stringify(remoteMessage));
              PushNotification.localNotification({
                channelId: "channel-id",
                message: remoteMessage.notification.body,
                title: remoteMessage.notification.title,
              });
            });
            return unsubscribe;
          });
      }
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={{
            flex: 1,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Check");
            }}
          >
            <Text>Push notification test</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default Test;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import Test from "./src/test";
import Check from "./src/check";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName={"Test"}
        >
          <Stack.Screen name={"Test"} component={Test} />
          <Stack.Screen name={"Check"} component={Check} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;

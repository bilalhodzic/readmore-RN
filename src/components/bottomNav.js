import * as React from "react";
import MainPage from "./mainPage";
import Library from "./library";
import ReadBook from "./readBook";
import DisplayOneBook from "./displayOneBook";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import readBook from "./readBook";
import { LinearGradient } from "expo-linear-gradient";
import { useDarkMode } from "react-native-dynamic";

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default function BottomNav() {
  const isDarkMode = useDarkMode();

  const screenOptionsStyles = {
    headerStyle: {
      backgroundColor: isDarkMode ? "#000000e6" : "#0063ccB3",
      height: 80,
      borderBottomWidth: 3,
      borderRadius: isDarkMode ? 0 : 3,
      borderBottomColor: isDarkMode ? "#000000cc" : "#7fb7f2CC",
    },

    headerTitle: "ReadMore",
    headerTitleAlign: "center",
    headerTintColor: "white",
    headerBackTitle: "Back",
  };

  function mainStackScreen() {
    return (
      <Stack.Navigator screenOptions={screenOptionsStyles}>
        <Stack.Screen name="search" component={MainPage} />
        <Stack.Screen name="oneBook" component={DisplayOneBook} />
      </Stack.Navigator>
    );
  }

  function libraryStackScreen() {
    return (
      <Stack.Navigator screenOptions={screenOptionsStyles}>
        <Stack.Screen
          name="myLibrary"
          screenOptions={{ headerTitle: "Library" }}
          component={Library}
        />
        <Stack.Screen name="oneBook" component={DisplayOneBook} />
        <Stack.Screen name="readBook" component={readBook} />
      </Stack.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="mainPage"
        barStyle={{
          backgroundColor: isDarkMode ? "#000000e6" : "#0063cccc",
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? "#00000099" : "lightgray",
        }}
      >
        <Tab.Screen
          name="mainPage"
          options={{ title: "Search books", tabBarIcon: "magnify" }}
          component={mainStackScreen}
        />
        <Tab.Screen
          name="library"
          options={{ title: "My library", tabBarIcon: "book-multiple" }}
          component={libraryStackScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

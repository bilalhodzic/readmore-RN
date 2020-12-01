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

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

const screenOptionsStyles = {
  headerStyle: {
    backgroundColor: "#0063ccB3",
    height: 80,
    borderBottomWidth: 3,
    borderRadius: 3,
    borderBottomColor: "#7fb7f2CC",
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

export default function BottomNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="mainPage"
        barStyle={{
          backgroundColor: "#0063ccCC",
          borderTopWidth: 1,
          borderTopColor: "lightgray",
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

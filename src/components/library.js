import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { WebView } from "react-native-webview";

export default function Library({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>This is my library</Text>
      <Button onPress={() => navigation.navigate("mainPage")}>
        Go to main Page
      </Button>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  root: {
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "arial",
    textAlign: "center",
    paddingTop: 80,
    marginBottom: "8%",
  },
  button: {
    margin: "1%",
    backgroundColor: "#0063cc",
    color: "white",
    textTransform: "none",
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "500",
    // "&:active": {
    //   backgroundColor: "#0069d9",
    //   boxShadow: "none",
    // },
    // "&:hover": {
    //   backgroundColor: "#0069d9",
    //   boxShadow: "none",
    // },
  },
  pagination: {
    padding: "1%",
  },
});

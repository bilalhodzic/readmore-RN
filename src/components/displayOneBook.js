import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function DisplayOneBook({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>This is one book</Text>
      <Button
        onPress={() => {
          navigation.navigate("mainPage", { screen: "search" });
        }}
      >
        Go back
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
});

import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { StyleSheet } from "react-native";
import BottomNav from "./src/components/bottomNav";

export default function App() {
  return (
    <>
      <BottomNav />
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});

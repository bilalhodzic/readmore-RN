import React from "react";
import { View } from "react-native";
import {
  Title,
  Card,
  Subheading,
  FAB,
  Modal,
  Portal,
  Provider,
  Snackbar,
  Button,
} from "react-native-paper";

export default function ReadBook({ route, navigation }) {
  const { oneBook } = route.params;

  return (
    <View>
      <Title> This is where bokk should be</Title>
      <Button
        onPress={() => {
          navigation.goBack();
        }}
      >
        Go back
      </Button>
    </View>
  );
}

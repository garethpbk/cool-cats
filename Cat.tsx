import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export interface ICatProps {
  id: string;
  url: string;
}

const Cat = (props: ICatProps) => (
  <View>
    <Text style={styles.text}>{props.id}</Text>
    <Image source={{ uri: props.url }} style={styles.image} />
  </View>
);

const styles = StyleSheet.create({
  image: {
    height: 250,
    margin: 25,
    width: 250,
  },
  text: {
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
});

export default Cat;

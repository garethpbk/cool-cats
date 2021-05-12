import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useQuery } from "react-query";
import { Button } from "react-native-elements";
import Cat from "../Cat";

export const InterpolatedAnimationsScreen = () => {
  const { current: fade } = useRef<Animated.Value>(new Animated.Value(0));
  const [faded] = useState<boolean>(false);

  const doFade = () => {
    Animated.timing(fade, {
      toValue: faded ? 0 : 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const { data, error, isLoading } = useQuery(
    "fetchACat",
    async () => {
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search",
        {
          headers: { "x-api-key": "c175f67e-78fe-4f8a-8c2a-62b1f75aefce" },
        }
      );

      const parsed = await response.json();

      return parsed;
    },
    {
      onSuccess: () => doFade(),
    }
  );

  const cat = data ? data[0] : null;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : data ? (
        <Animated.View
          style={{
            opacity: fade,
            transform: [
              {
                translateX: fade.interpolate({
                  inputRange: [0, 0.25, 0.5, 0.75, 1],
                  outputRange: [0, 50, 100, 25, 0],
                }),
              },
              {
                scale: fade.interpolate({
                  inputRange: [0, 0.25, 0.5, 0.75, 1],
                  outputRange: [0.25, 0.75, 1.25, 1.15, 1],
                }),
              },
              {
                rotateY: fade.interpolate({
                  inputRange: [0, 0.25, 0.75, 1],
                  outputRange: ["0deg", "120deg", "240deg", "360deg"],
                }),
              },
            ],
          }}
        >
          <Cat id={cat.id} url={cat.url} />
        </Animated.View>
      ) : error ? (
        <Text>Error!</Text>
      ) : (
        <Text>Cats Rule!</Text>
      )}
      <View style={styles.buttonsWrapper}>
        <Button title="Animate" onPress={() => doFade()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 75,
    width: 75,
  },
  imageContainer: {
    padding: 2,
  },
});

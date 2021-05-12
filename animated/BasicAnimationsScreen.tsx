import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useQuery } from "react-query";
import { Button } from "react-native-elements";
import Cat from "../Cat";

export const BasicAnimationsScreen = () => {
  const { current: fade } = useRef<Animated.Value>(new Animated.Value(0));
  const [faded, setFaded] = useState<boolean>(false);
  const { current: moveIt } = useRef<Animated.Value>(new Animated.Value(0));
  const [moved, setMoved] = useState<boolean>(false);

  const doFade = () => {
    setFaded(!faded);
    Animated.timing(fade, {
      toValue: faded ? 0 : 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const doMoveIt = () => {
    setMoved(!moved);
    Animated.timing(moveIt, {
      toValue: moved ? 0 : 75,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const { data, error, isLoading } = useQuery(
    "fetchACatAnimated",
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
                translateX: moveIt,
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
        <Button title="Fade" onPress={() => doFade()} />
        <Button title="Move It" onPress={() => doMoveIt()} />
      </View>
      <Text>{!faded ? "Cat????" : "Cat!!!!"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsWrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginBottom: 15,
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

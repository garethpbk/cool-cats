import React, { useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useQuery } from "react-query";
import { Button } from "react-native-elements";
import Cat from "../Cat";

export const ComposedAnimationsScreen = () => {
  const { current: fade } = useRef<Animated.Value>(new Animated.Value(0));
  const { current: position } = useRef<Animated.ValueXY>(
    new Animated.ValueXY({ x: 0, y: 0 })
  );
  const { current: twirl } = useRef<Animated.Value>(new Animated.Value(0));
  const { current: scale } = useRef<Animated.Value>(new Animated.Value(1));

  //   const doFade = () => {
  //     Animated.sequence([
  //       Animated.timing(fade, {
  //         toValue: 1,
  //         duration: 500,
  //         useNativeDriver: true,
  //       }),
  //       Animated.parallel([
  //         Animated.spring(position, {
  //           toValue: { x: -25, y: -150 },
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(twirl, {
  //           duration: 1500,
  //           toValue: 360,
  //           useNativeDriver: true,
  //         }),
  //       ]),
  //     ]).start();
  //   };

  const doFade = () => {
    Animated.stagger(1000, [
      Animated.timing(fade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(position, {
        toValue: { x: -25, y: -150 },
        useNativeDriver: true,
      }),
      Animated.timing(twirl, {
        toValue: 360,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }),
        Animated.timing(twirl, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
      //   Animated.loop(
      //     Animated.spring(scale, {
      //       toValue: 1.25,
      //       friction: 2,
      //       useNativeDriver: true,
      //     })
      //   ),
    ]).start();
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
                translateX: position.x,
              },
              {
                translateY: position.y,
              },
              {
                rotate: twirl,
              },
              {
                scale: scale,
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

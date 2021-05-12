import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import CatsScreen from "./CatsScreen";
import { Button } from "react-native-elements";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BasicAnimationsScreen,
  ComposedAnimationsScreen,
  InterpolatedAnimationsScreen,
} from "./animated";

const queryClient = new QueryClient();

const HomeScreen = () => {
  const navigation = useNavigation();
  const [readyForCats, setReadyForCats] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text>Cool Cats</Text>
      <Button
        style={styles.button}
        title={readyForCats ? "Ready For Cats :)" : "Not Ready For Cats :("}
        onPress={() => setReadyForCats(!readyForCats)}
      />
      <Button
        disabled={!readyForCats}
        style={styles.button}
        title="Let's See Some Cats"
        onPress={() => navigation.navigate("Cats")}
      />
      <Button
        disabled={!readyForCats}
        style={styles.button}
        title="Animated Cats"
        onPress={() => navigation.navigate("BasicAnimations")}
      />
      <Button
        disabled={!readyForCats}
        style={styles.button}
        title="Composed Cats"
        onPress={() => navigation.navigate("ComposedAnimations")}
      />
      <Button
        disabled={!readyForCats}
        style={styles.button}
        title="Interpolated Cats"
        onPress={() => navigation.navigate("InterpolatedAnimations")}
      />
    </View>
  );
};

const Stack = createStackNavigator();

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 300,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cats" component={CatsScreen} />
          <Stack.Screen
            name="BasicAnimations"
            component={BasicAnimationsScreen}
            options={{
              title: "Basic Animations",
              ...TransitionPresets.RevealFromBottomAndroid,
            }}
          />
          <Stack.Screen
            name="ComposedAnimations"
            component={ComposedAnimationsScreen}
            options={{
              transitionSpec: {
                open: config,
                close: config,
              },
              title: "Composed Animations",
            }}
          />
          <Stack.Screen
            name="InterpolatedAnimations"
            component={InterpolatedAnimationsScreen}
            options={{
              ...TransitionPresets.ModalSlideFromBottomIOS,
              transitionSpec: {
                open: config,
                close: config,
              },
              title: "Interpolated Animations",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
    width: 200,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

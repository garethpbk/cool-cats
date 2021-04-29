import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CatsScreen from "./CatsScreen";
import { Button } from "react-native-elements";
import { QueryClient, QueryClientProvider } from "react-query";

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
    </View>
  );
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Cats" component={CatsScreen} />
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

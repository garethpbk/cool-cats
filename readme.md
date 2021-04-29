# Cool Cats

## Step 1: Create a New Expo Project

`expo init cool-cats`

If using npm:

`expo init cool-cats --npm`

Choose `blank (TypeScript)`

## Step 2: Install Packages

In the project's root folder run:

`expo install @react-navigation/native @react-navigation/stack react-query react-native-elements react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view`

## Step 3: Start the Project

In the project's root folder run:

`expo start`

And open on simulator of choice from either the command line or the GUI. On iOS you may see a "Expo Go on iPhone xx is outdated" message, update if so.

## Step 4: Set Up Navigation

In `App.tsx` add these imports:

```
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
```

Below the imports and above `function App()` create a new screen component:

```ts
const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Cool Cats</Text>
    </View>
  );
};
```

Below that create a new stack navigator:

```ts
const Stack = createStackNavigator();
```

Replace the `return()` contents of `function App()` with navigation components:

```tsx
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Remove the now-unused `{ StatusBar }` import.

## Step 5: Create a Second Screen

In the project's root folder run:

`touch CatsScreen.tsx`

Open up `CatsScreen.tsx` and set up a basic component:

```tsx
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Cats Rule!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CatsScreen;
```

In `App.tsx` import this screen and add it to the navigator:

```tsx
import CatsScreen from "./CatsScreen";
```

```tsx
<Stack.Screen name="Cats" component={CatsScreen} />
```

## Step 6: Get Ready For Some Cats

Add a new import `{ useState }` to `React`:

```tsx
import React, { useState } from "react";
```

Add some state to `HomeScreen`:

```tsx
const [readyForCats, setReadyForCats] = useState<boolean>(false);
```

Import a button from `react-native-elements`:

```tsx
import { Button } from "react-native-elements";
```

Set up some button styling:

```tsx
button: {
    marginVertical: 10,
    width: 200
},
```

Add a `Button` to `HomeScreen` that toggles the state:

```tsx
const HomeScreen = () => {
  const [readyForCats, setReadyForCats] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text>Cool Cats</Text>
      <Button
        style={styles.button}
        title={readyForCats ? "Ready For Cats!" : "Not Ready For Cats :("}
        onPress={() => setReadyForCats(!readyForCats)}
      />
    </View>
  );
};
```

## Step 7: Add a Button to Navigate

Add a new import `useNavigation` to `@react-navigation/native`:

```tsx
import { NavigationContainer, useNavigation } from "@react-navigation/native";
```

Add the `useNavigation` hook and a button for navigating to the `HomeScreen` component:

```tsx
const HomeScreen = () => {
  const navigation = useNavigation();
  const [readyForCats, setReadyForCats] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text>Cool Cats</Text>
      <Button
        style={styles.button}
        title={readyForCats ? "Ready For Cats!" : "Not Ready For Cats :("}
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
```

## Step 7: Set Up A Query Client

In `App.tsx` add imports from `react-query`:

```tsx
import { QueryClient, QueryClientProvider } from "react-query";
```

Create a new client:

```tsx
const queryClient = new QueryClient();
```

Wrap the whole app in a client provider:

```tsx
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
```

## Step 8: Fetch Some Cats

In `CatsScreen` add import from `react-query`:

```tsx
import { useQuery } from "react-query";
```

Set up a query hook:

```tsx
const { data, error, isLoading, refetch } = useQuery("fetchACat", async () => {
  const response = await fetch("https://api.thecatapi.com/v1/images/search", {
    headers: { "x-api-key": "c175f67e-78fe-4f8a-8c2a-62b1f75aefce" },
  });

  const parsed = await response.json();

  return parsed;
});
```

Extract the data from the response:

```tsx
const cat = data ? data[0] : null;
```

## Step 9: Create a Cat Component

In the project's root folder run:

`touch Cat.tsx`

In `Cat` create a component with some styles:

```tsx
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const Cat = (props) => (
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
```

Add a type interface to the props of `Cat`:

```tsx
interface ICatProps {
  id: string;
  url: string;
}

const Cat = (props: ICatProps) => (
  <View>
    <Text style={styles.text}>{props.id}</Text>
    <Image source={{ uri: props.url }} style={styles.image} />
  </View>
);
```

## Step 10: Use Cat in CatsScreen

In `CatsScreen` import the `Cat` component and a button:

```tsx
import { Button } from "react-native-elements";
import Cat from "./Cat";
```

In the screen's `return()`, add some conditional rendering that displays the `Cat` component after data has been fetched successfully, along with a button for refetching:

```tsx
return (
  <View style={styles.container}>
    {isLoading ? (
      <Text>Loading...</Text>
    ) : data ? (
      <Cat id={cat.id} url={cat.url} />
    ) : error ? (
      <Text>Error!</Text>
    ) : (
      <Text>Cats Rule!</Text>
    )}
    <Button title="Get A Cat" onPress={() => refetch()} />
  </View>
);
```

## Step 11: Keep Track of Your Cats

In `CatsScreen` import state and effect hooks from `react`:

```tsx
import React, { useEffect, useState } from "react";
```

In `Cat` export the interface:

```tsx
export interface ICatProps {
  id: string;
  url: string;
}
```

And import it in `CatsScreen`:

```tsx
import Cat, { ICatProps } from "./Cat";
```

In `CatsScreen` add a state hook with a type of an array of ICatProps, or an empty array for the initial declaration:

```tsx
const [catHistory, setCatHistory] = useState<ICatProps[] | []>([]);
```

In `CatsScreen` add an effect hook to watch for changes in the queried data and update the history state accordingly:

```tsx
useEffect(() => {
  if (data) {
    const newCat = {
      id: data[0].id,
      url: data[0].url,
    };

    setCatHistory([...catHistory, newCat]);
  }
}, [data]);
```

## Step 12: See All Your Cats

In `CatsScreen` add some imports from `react-native`:

```tsx
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
```

Under the `Button` component add a `FlatList` component to render the history of cats:

```tsx
<FlatList
  data={catHistory}
  renderItem={({ item }: { item: ICatProps }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.url }} style={styles.image} />
    </View>
  )}
  keyExtractor={(item) => item.id}
  numColumns={4}
/>
```

Update the styles:

```tsx
const styles = StyleSheet.create({
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
```

## Step 12: All Done!

There are plenty of features and improvements this app could take from here! Navigating back to the home screen and then back to the cats screen wipes the history, for example, as it lives in local state - a global state manager could be a solution here. Hopefully this was a good introduction for setting up a React Native app with styling, navigation, and networking.

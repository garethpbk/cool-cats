import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useQuery } from "react-query";
import { Button } from "react-native-elements";
import Cat, { ICatProps } from "./Cat";

const CatsScreen = () => {
  const [catHistory, setCatHistory] = useState<ICatProps[] | []>([]);

  const { data, error, isLoading, refetch } = useQuery(
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
    }
  );

  useEffect(() => {
    if (data) {
      const newCat = {
        id: data[0].id,
        url: data[0].url,
      };

      setCatHistory([...catHistory, newCat]);
    }
  }, [data]);

  const cat = data ? data[0] : null;

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
  image: {
    height: 75,
    width: 75,
  },
  imageContainer: {
    padding: 2,
  },
});

export default CatsScreen;

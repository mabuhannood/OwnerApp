import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";

import { auth, db } from "../controllers/firebaseConfig";
import { collection, addDoc, doc } from "firebase/firestore";

const ListingScreen = () => {
  const [vehiclesData, setVehiclesData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [vehicleModel, setVehicleModel] = useState();
  const [vehicleTrim, setVehicleTrim] = useState();
  const [vehicleMake, setVehicleMake] = useState();
  const [vehicleYear, setVehicleYear] = useState();
  const [vehicleForm, setVehicleForm] = useState();
  const [vehicleCapacity, setVehicleCapacity] = useState();
  const [searchWord, setSearchWord] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [hideSearchRes, setHideSearchRes] = useState(true);
  const [licensePlate, setLicensePlate] = useState();
  const [location, setLocation] = useState();
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState();
  const [selectedItem, setSelectedItem] = useState();

  const getVehiclesFromAPI = async () => {
    const apiURL = "https://mabuhannood.github.io/vehicles.json";
    console.log(`apiURL : ${apiURL}`);

    try {
      const response = await fetch(apiURL);
      const json = await response.json();
      console.log(`json.data : ${json[0].model}`);
      setVehiclesData(json);
    } catch (error) {
      console.error(JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getVehiclesFromAPI();
  }, []);

  useEffect(() => {
    setHideSearchRes(false);
    if (vehiclesData && searchWord.trim() !== "") {
      updateFilteredResults();
    }
  }, [searchWord]);

  const updateFilteredResults = () => {
    const filteredResults = vehiclesData.filter(
      (car) => String(car?.make).toLowerCase() === searchWord.toLowerCase()
    );

    setSearchResult(filteredResults);
  };

  const onSubmitClickHandler = (item) => {
    setSelectedItem(item);
    setHideSearchRes(true);
    setVehicleCapacity(item?.seats_max || 0);
    setVehicleMake(item?.make);
    setVehicleModel(item?.model);
    setVehicleTrim(item?.trim);
    setVehicleYear(item?.model_year);
    setVehicleForm(item?.form_factor);
    setImage(item?.images[0].url_thumbnail);
  };

  const saveToDBHandler = async () => {
    try {
      const dataToAdd = {
        make: vehicleMake,
        model: vehicleModel,
        trim: vehicleTrim,
        capacity: vehicleCapacity,
        year: vehicleYear,
        form: vehicleForm,
        location: location,
        ownerEmail: auth.currentUser.email,
        image: image,
        lPlate: licensePlate,
        price: price,
      };
      const res = await addDoc(collection(db, "Listings"), dataToAdd);

      console.log(res);
      alert("Listing created!!!!");
    } catch (error) {
      console.log(error);
    }
  };

  const vehiclesListItem = ({ item }) => (
    <View style={styles.listItem}>
      <Text style={styles.title}>
        {`${item.make} ${item.model} ${item.trim}`}{" "}
      </Text>
      <Text> Seating Capacity: {item.seats_max || 0} </Text>
      <Image
        source={{ uri: item?.images[0]?.url_thumbnail }}
        style={styles.imgVehicle}
      />
      <Text> Model Year: {item.model_year || 0} </Text>
      <Text> Form Factor: {item.form_factor || ""} </Text>
    </View>
  );

  return (
    <View>
      {isLoading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              value={searchWord}
              onChangeText={setSearchWord}
              placeholder="Search vehicles here..."
              selectTextOnFocus={true}
            />
          </View>
          {!hideSearchRes && (
            <FlatList
              data={searchResult || []}
              keyExtractor={(item) => item.make.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.searchResult}
                  onPress={() => onSubmitClickHandler(item)}
                >
                  <View style={styles.searchContainer}>
                    <Image
                      source={{ uri: item?.images[0]?.url_thumbnail }}
                      style={styles.imgVehicle}
                    />
                    <Text
                      style={styles.textVehicle}
                    >{`${item.make} ${item.model} ${item.trim}`}</Text>
                  </View>
                </Pressable>
              )}
            />
          )}
          <View style={styles.container}>
            <TextInput
              style={styles.textInput}
              value={vehicleMake}
              placeholder="Make"
              onChangeText={setVehicleMake}
              selectTextOnFocus={true}
            />
            <TextInput
              value={vehicleModel}
              style={styles.textInput}
              placeholder="Model"
              onChangeText={setVehicleModel}
              selectTextOnFocus={true}
            />
            <TextInput
              value={vehicleTrim}
              style={styles.textInput}
              placeholder="Trim"
              onChangeText={setVehicleTrim}
              selectTextOnFocus={true}
            />
            <TextInput
              style={styles.textInput}
              value={String(vehicleCapacity || "")}
              placeholder="Capacity"
              onChangeText={setVehicleCapacity}
              selectTextOnFocus={true}
            />

            <TextInput
              value={String(vehicleYear || "")}
              style={styles.textInput}
              placeholder="Year"
              onChangeText={setVehicleYear}
              selectTextOnFocus={true}
            />
            <TextInput
              value={vehicleForm}
              style={styles.textInput}
              placeholder="Factor Form"
              onChangeText={setVehicleForm}
              selectTextOnFocus={true}
            />

            <TextInput
              value={licensePlate}
              style={styles.textInput}
              placeholder="License Plate"
              onChangeText={setLicensePlate}
              selectTextOnFocus={true}
            />

            <TextInput
              value={location}
              style={styles.textInput}
              placeholder="Location"
              onChangeText={setLocation}
              selectTextOnFocus={true}
            />
            <TextInput
              value={price}
              style={styles.textInput}
              placeholder="Price $"
              onChangeText={setPrice}
              selectTextOnFocus={true}
            />
            <View style={styles.saveButtonContainer}>
              <Pressable onPress={saveToDBHandler} style={styles.btn}>
                <Text style={styles.btnLabel}>ADD</Text>
              </Pressable>
            </View>
          </View>

          {/* <View>
            <FlatList
              data={searchResult.length ? searchResult : vehiclesData}
              keyExtractor={(item) => item.model} // Assuming the model name is unique
              renderItem={vehiclesListItem}
              ItemSeparatorComponent={() => {
                return <View style={styles.separator} />;
              }}
            />
          </View> */}
        </>
      )}
    </View>
  );
};

export default ListingScreen;

const styles = StyleSheet.create({
  container: {
    // // flex: 1,
    // flexDirection: "column",
    // alignItems: "center",
    padding: 20,
    // width: "90%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#34495e",
    borderWidth: 1,
    // borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 8,
  },
  searchResult: {
    padding: 3,
    backgroundColor: "silver",
    borderColor: "gray",
    borderWidth: 1,
    width: "100%",
  },
  imgVehicle: {
    width: 70,
    height: 50,
    padding: 10,
    borderRadius: 2,
  },
  textVehicle: {
    fontSize: 15,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    padding: 10,
    color: "orangered",
    fontWeight: "bold",
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  saveButtonContainer: {
    alignItems: "center",
  },
  btn: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    // elevation: 3,
    backgroundColor: "#624CAB",
  },
  btnLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  listItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: 10,
  },
  separator: {
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5,
  },
});

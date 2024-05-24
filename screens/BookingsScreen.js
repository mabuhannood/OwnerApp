import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "../controllers/firebaseConfig";
import BookingItem from "./BookingItem";

const BookingsScreen = () => {
  const [bookingList, setBookingList] = useState([]);
  const [isLoading, setLoading] = useState(true); // Set isLoading to true initially

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "Bookings"),
        where("ownerEmail", "==", auth.currentUser.email)
      ),
      (snapshot) => {
        // Extract the data from the documents
        const bookingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBookingList(bookingsData);
        setLoading(false); // Set isLoading to false when data is received
      },
      (error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false); // Set isLoading to false if there was an error
      }
    );

    // Clean up the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator animating={true} size="large" />
      ) : (
        <FlatList
          data={bookingList}
          keyExtractor={(item) => {
            return item.id || "-";
          }}
          renderItem={({ item }) => <BookingItem item={item} key={item?.id} />}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
        />
      )}
    </View>
  );
};

export default BookingsScreen;

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "flex-start",
  //   padding: 10,
  // },
  // flagTitle: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   paddingVertical: 15,
  // },
  // country: {
  //   fontSize: 20,
  //   padding: 5,
  //   fontWeight: "bold",
  // },
  // details: {
  //   fontSize: 15,
  //   padding: 5,
  // },
  // imgContainer: {
  //   justifyContent: "center",
  //   marginRight: 10,
  // },
  // img: {
  //   width: 50,
  //   height: 30,
  //   resizeMode: "contain",
  // },
  // listItem: {
  //   flexDirection: "column",
  //   alignItems: "flex-start",
  //   width: "100%", // Set each item to take up full width
  //   padding: 5,
  // },
  // separator: {
  //   marginLeft: 5,
  //   marginRight: 5,
  //   borderWidth: 1,
  //   borderColor: "#ccc",
  //   marginVertical: 5,
  // },
});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db, auth } from "../controllers/firebaseConfig";

const BookingItem = ({ item }) => {
  const [confirmCode, setConfirmCode] = useState(item?.confirmCode);
  const [status, setStatus] = useState(item?.status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setConfirmCode(item?.confirmCode);
    setStatus(item?.status);
  }, [item]);

  const approveBooking = async () => {
    try {
      setLoading(true);
      const bookingRef = doc(db, "Bookings", item?.id);

      const randomCode = Math.floor(Math.random() * 239849334);
      const updatedData = {
        ...item,
        confirmCode: randomCode.toString(),
        status: "Approved",
      };
      await updateDoc(bookingRef, updatedData);
      setStatus("Approved");
      setConfirmCode(randomCode.toString());
      setLoading(false);
      Alert.alert(`Booking Approved!`);
    } catch (error) {
      console.log(error);
    }
  };

  const declineBooking = async () => {
    try {
      setLoading(true);
      const bookingRef = doc(db, "Bookings", item?.id);

      const updatedData = {
        ...item,
        status: "Declined",
      };
      const res = await updateDoc(bookingRef, updatedData);

      setStatus("Declined");
      setLoading(false);
      Alert.alert(`Booking Declined!`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator style={{}} />
      ) : (
        <View>
          <View style={styles.container}>
            <View style={styles.detailsContainer}>
              <Image
                style={styles.imgContainer}
                source={{
                  uri: `${
                    item?.rPhoto ||
                    "https://img.freepik.com/free-icon/user_318-563642.jpg"
                  }`,
                }}
              />
              <View>
                <Text style={styles.details}>{`Renter: ${
                  String(item?.rName) || "NA"
                }`}</Text>
                <Text style={styles.details}>
                  {`Vehicle: ${String(item?.make) || "NA"} ${
                    String(item?.model) || "NA"
                  } ${String(item?.trim) || "NA"}`}{" "}
                </Text>
                <Text style={styles.details}>{`Date: ${
                  String(item?.date) || "NA"
                }`}</Text>
                <Text style={styles.details}>{`License Plate: ${
                  String(item?.lPlate) || "NA"
                }`}</Text>
                <Text style={styles.details}>{`Price: ${
                  parseFloat(item?.price) || "NA"
                }$`}</Text>

                {String(confirmCode) && status === "Approved" && (
                  <View style={styles.details}>
                    <Text>Confirmation Code: {confirmCode || "NA"}</Text>
                  </View>
                )}
              </View>
            </View>
            <View>
              {status === "Pending" ? (
                <View
                  style={{
                    marginEnd: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Pressable
                    onPress={approveBooking}
                    style={{
                      backgroundColor: "#5A439D",
                      padding: 10,
                      margin: 5,
                      width: 80,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: "white" }}>Approve</Text>
                  </Pressable>
                  <Pressable
                    style={{
                      backgroundColor: "gray",
                      padding: 10,
                      margin: 5,
                      width: 80,
                      borderRadius: 5,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onPress={declineBooking}
                  >
                    <Text>Decline</Text>
                  </Pressable>
                </View>
              ) : (
                <View>
                  <Text style={styles.status}>{status}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default BookingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsContainer: {
    padding: 2,
    flexDirection: "row",
  },

  details: {
    fontSize: 15,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  status: {
    color: "red",
    fontWeight: "bold",
  },
  imgContainer: {
    borderColor: "#5A439D",
    borderWidth: 1,
    borderRadius: "50%",
    width: 60,
    height: 60,
  },
  img: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },
  listItem: {
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%", // Set each item to take up full width
    padding: 5,
  },
  separator: {
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginVertical: 5,
  },
});

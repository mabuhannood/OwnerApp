import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  SafeAreaView,
} from "react-native";

// import the auth variable
import { auth } from "../controllers/firebaseConfig";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const SignInScreen = ({ navigation, route }) => {
  const [usernameFromUI, setUsernameFromUI] = useState("sam@gmail.com");
  const [passwordFromUI, setPasswordFromUI] = useState("abc@123");

  const onLoginClicked = async () => {
    //verify credentials
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        usernameFromUI,
        passwordFromUI
      );
      // who is the current user?
      console.log("Who is the currently logged in user");
      console.log(userCredential.user.getIdToken);
      console.log(auth.currentUser.uid);
      alert(`Login success! ${auth.currentUser.email}`);
      navigation.navigate("Home", { uname: auth.currentUser.email });
    } catch (err) {
      console.log(err);
    }
  };

  const onLogoutClicked = async () => {
    try {
      // 1. check if a user is currently logged in
      if (auth.currentUser === null) {
        alert("Sorry, no user is logged in.");
      } else {
        await signOut(auth);
        alert("Logout complete!");
        navigation.navigate("SignIn");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.inputSection}>
          <Text style={styles.title}>Login to your Account</Text>
          {/* Email Input */}
          <TextInput
            placeholder="Enter your email"
            value={usernameFromUI}
            onChangeText={setUsernameFromUI}
            textContentType="emailAddress"
            autoCapitalize="none"
            style={styles.input}
          />
          {/* Password Input */}
          <TextInput
            placeholder="Enter your password"
            value={passwordFromUI}
            onChangeText={setPasswordFromUI}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Login Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? "#7864B9" : "#624CAB" },
          ]}
          onPress={onLoginClicked}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF4F1",
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
    justifyContent: "space-between",
  },
  mainContainer: {
    paddingHorizontal: 25,
    flex: 1,
    justifyContent: "space-between",
  },
  inputSection: {
    paddingTop: 250,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    paddingBottom: 40,
  },

  input: {
    width: "100%",
    height: 40,
    borderColor: "#9180C6",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  btnSection: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: "100%",
    borderRadius: 50,
    paddingVertical: 12,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default SignInScreen;

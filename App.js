import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";

import { auth } from "./controllers/firebaseConfig";

import SignInScreen from "./screens/SignInScreen";
import ListingScreen from "./screens/ListingScreen";
import BookingsScreen from "./screens/BookingsScreen";


//to obtain instance of navigation stack

const Tab = createBottomTabNavigator();

const MainTabNavigator = ({ handleLogout }) => {
	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ color, size }) => {
					let iconName;
					if (route.name === "Listings") {
						iconName = "format-list-bulleted";
					} else if (route.name === "Bookings") {
						iconName = "book";
					}
					return (
						<MaterialCommunityIcons name={iconName} size={size} color={color} />
					);
				},
				headerRight: () => (
					<TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
						<Text style={{ color: "red", fontSize: 18 }}>Logout</Text>
					</TouchableOpacity>
				),
			})}
			tabBarOptions={{
				activeTintColor: "#624CAB",
				inactiveTintColor: "gray",
			}}
		>
			<Tab.Screen name="Listings" component={ListingScreen} />
			<Tab.Screen name="Bookings" component={BookingsScreen} />
		</Tab.Navigator>
	);
};

const App = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const handleLogout = async () => {
		try {
			await auth.signOut();
			setUser(null);
		} catch (error) {
			console.log(error);
		}
	};


	return (
		<NavigationContainer>
			{user ? (
				<MainTabNavigator handleLogout={handleLogout} />
			) : (
				<SignInScreen />
			)}
		</NavigationContainer>
	);
};

export default App;
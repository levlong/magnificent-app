import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../../screens/HomeScreen";
import { LearnScreen } from "../../screens/LearnScreen";
import { ProfileScreen } from "../../screens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";


const Tab = createBottomTabNavigator();

export const Navigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#1E293B",
                    borderTopWidth: 0,
                    height: 70,
                    paddingTop: 10,
                    paddingBottom: 10
                },

                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#888",
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: any;

                    if (route.name === "Home") {
                        iconName = focused ? "home" : "home-outline";
                    } else if (route.name === "Learn") {
                        iconName = focused ? "book" : "book-outline";
                    } else if (route.name === "Profile") {
                        iconName = focused ? "person" : "person-outline";
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Learn" component={LearnScreen} />
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};
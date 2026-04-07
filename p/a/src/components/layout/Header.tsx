import { View, Text, Pressable } from "react-native";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";

export const Header = () => {
    const navigation = useNavigation();

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }}
        >
            <Text style={{ color: colors.text, fontSize: 20 }}>
                Home
            </Text>

            <Pressable
                onPress={() => navigation.navigate("Profile" as never)}
            >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: colors.subtext, marginRight: 8 }}>
                        Long
                    </Text>

                    <View
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: colors.primary,
                        }}
                    />
                </View>
            </Pressable>
        </View>
    )
}
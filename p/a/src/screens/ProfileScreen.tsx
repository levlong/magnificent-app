import { View, Text } from "react-native"
import { colors } from "../constants/colors"

export const ProfileScreen = () => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: colors.bg,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ color: colors.text }}>Profile</Text>
        </View>
    )
}
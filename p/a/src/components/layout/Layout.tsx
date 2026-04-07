import { ReactNode } from "react";
import { Header } from "./Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/colors";
import { View } from "react-native";

type Props = {
    children: ReactNode
}

export const Layout = ({ children }: Props) => {
    return (
        <SafeAreaView
            edges={["top"]}
            style={{
                flex: 1,
                backgroundColor: colors.bg,
                paddingHorizontal: 16,
                justifyContent: "space-between",
            }}>
            <View style={{ paddingHorizontal: 16 }}>
                <Header />
            </View>

            {children}
        </SafeAreaView>
    )
}
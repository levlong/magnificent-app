import { NavigationContainer } from "@react-navigation/native"
import "react-native-gesture-handler"
import { Navigator } from "./src/components/layout/Navigator"

export const App = () => {
    return (
        <NavigationContainer>
            <Navigator />
        </NavigationContainer>
    )
}
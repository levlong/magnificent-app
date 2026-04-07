import { useEffect, useState } from "react"
import { View, Text, FlatList } from "react-native"
import { getWords } from "../api/vocab.api"
import { colors } from "../constants/colors"
import { Layout } from "../components/layout/Layout"

export const HomeScreen = () => {
    const [words, setWords] = useState<any[]>([])

    useEffect(() => {
        load()
    }, [])

    async function load() {
        try {
            const data = await getWords()
            setWords(data)
        } catch (err) {
            console.log("API error:", err)
        }
    }

    return (
        <Layout>
            {/* CONTENT (list vocab tạm) */}
            <View
                style={{
                    flex: 1,
                    marginVertical: 16,
                    backgroundColor: colors.card,
                    borderRadius: 20,
                    padding: 12
                }}
            >
                <FlatList
                    data={words}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View
                            style={{
                                padding: 12,
                                borderBottomWidth: 1,
                                borderColor: colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                {item.text}
                            </Text>

                            <Text
                                style={{
                                    color: colors.subtext,
                                    marginTop: 4,
                                }}
                            >
                                {item.meanings?.[0]?.definition || "No definition"}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </Layout>
    )
}
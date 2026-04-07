import { useEffect, useState } from "react"
import { View, Text, FlatList } from "react-native"
import { getWords } from "../api/vocab.api"

export default function HomeScreen() {
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
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>
                Vocab List
            </Text>

            <FlatList
                data={words}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 12 }}>
                        <Text style={{ fontSize: 18 }}>
                            {item.text}
                        </Text>
                        <Text>
                            {item.meanings?.[0]?.definition || "No definition"}
                        </Text>
                    </View>
                )}
            />
        </View>
    )
}
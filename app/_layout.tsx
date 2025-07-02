import { StatusBar } from "react-native";
import "./globals.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";


export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    console.log("aaya to nahi");
    return null; // or <AppLoading />
  }

  console.log("Aaya hai");

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <SafeAreaProvider style={{ backgroundColor: "#ffffff" }}>
        <StatusBar backgroundColor={"#F7FCFC"} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{
            headerShown: false,
          }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

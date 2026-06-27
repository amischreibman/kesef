import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
  Rubik_800ExtraBold,
} from "@expo-google-fonts/rubik";
import type { Profile } from "./lib/types";
import { loadProfile, saveProfile } from "./lib/storage";
import { colors } from "./lib/theme";
import Onboarding from "./components/Onboarding";
import MainScreen from "./components/MainScreen";

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
    Rubik_800ExtraBold,
  });

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Read any saved profile from on-device storage when the app starts.
  useEffect(() => {
    loadProfile().then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  async function handleDone(p: Profile) {
    await saveProfile(p);
    setProfile(p);
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      {!fontsLoaded || loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : profile ? (
        <MainScreen profile={profile} />
      ) : (
        <Onboarding onDone={handleDone} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});

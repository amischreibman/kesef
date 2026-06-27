import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { PasswordEntry, Profile } from "../lib/types";
import { t } from "../lib/i18n";
import { loadEntries, saveEntries, uid } from "../lib/storage";
import { colors, fonts } from "../lib/theme";
import { LangContext } from "../lib/lang";
import { BigField, PrimaryButton, SecondaryButton } from "./ui";

export default function MainScreen({ profile }: { profile: Profile }) {
  const d = t[profile.lang];
  const align = profile.lang === "he" ? "right" : "left";
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadEntries().then(setEntries);
  }, []);

  function addEntry(entry: PasswordEntry) {
    const updated = [entry, ...entries];
    setEntries(updated);
    void saveEntries(updated);
    setAdding(false);
  }

  function deleteEntry(id: string) {
    Alert.alert(d.confirmDelete, undefined, [
      { text: d.cancel, style: "cancel" },
      {
        text: d.delete,
        style: "destructive",
        onPress: () => {
          const updated = entries.filter((e) => e.id !== id);
          setEntries(updated);
          void saveEntries(updated);
        },
      },
    ]);
  }

  return (
    <LangContext.Provider value={profile.lang}>
      <View style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Text style={[styles.appName, { textAlign: align }]}>
              {d.appName}
            </Text>
            <Text style={[styles.greeting, { textAlign: align }]}>
              {d.mainGreeting(profile.name)}
            </Text>
          </View>

          {entries.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>{d.mainEmpty}</Text>
              <BigPlus label={d.addPassword} onPress={() => setAdding(true)} />
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {entries.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  d={d}
                  align={align}
                  onDelete={() => deleteEntry(e.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {entries.length > 0 && (
          <View style={styles.fab}>
            <BigPlus label={d.addPassword} onPress={() => setAdding(true)} />
          </View>
        )}

        <Modal visible={adding} animationType="slide" transparent>
          <AddPasswordSheet
            d={d}
            lang={profile.lang}
            onSave={addEntry}
            onCancel={() => setAdding(false)}
          />
        </Modal>
      </View>
    </LangContext.Provider>
  );
}

function BigPlus({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.plusWrap}>
      <View style={styles.plusCircle}>
        <Text style={styles.plusSign}>+</Text>
      </View>
      <Text style={styles.plusLabel}>{label}</Text>
    </Pressable>
  );
}

function EntryCard({
  entry,
  d,
  align,
  onDelete,
}: {
  entry: PasswordEntry;
  d: (typeof t)["he"];
  align: "right" | "left";
  onDelete: () => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.cardHead}>
        <Text style={[styles.cardTitle, { textAlign: align }]}>
          {entry.title}
        </Text>
        <Pressable onPress={onDelete}>
          <Text style={styles.deleteText}>{d.delete}</Text>
        </Pressable>
      </View>
      {entry.username !== "" && (
        <Text style={styles.username}>{entry.username}</Text>
      )}
      <View style={styles.pwRow}>
        <Text style={styles.pwText}>
          {show ? entry.password : "••••••••"}
        </Text>
        <Pressable
          onPress={() => setShow((s) => !s)}
          style={styles.smallBtn}
        >
          <Text style={styles.smallBtnText}>{show ? d.hide : d.show}</Text>
        </Pressable>
      </View>
      {entry.notes !== "" && (
        <Text style={[styles.notes, { textAlign: align }]}>{entry.notes}</Text>
      )}
    </View>
  );
}

function AddPasswordSheet({
  d,
  lang,
  onSave,
  onCancel,
}: {
  d: (typeof t)["he"];
  lang: Profile["lang"];
  onSave: (entry: PasswordEntry) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");

  function save() {
    if (!title.trim() || !password.trim()) return;
    onSave({
      id: uid(),
      title: title.trim(),
      username: username.trim(),
      password,
      notes: notes.trim(),
      createdAt: Date.now(),
    });
  }

  const align = lang === "he" ? "right" : "left";

  return (
    <LangContext.Provider value={lang}>
      <View style={styles.sheetBackdrop}>
        <View style={styles.sheet}>
          <ScrollView
            contentContainerStyle={{ padding: 24, gap: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={[styles.sheetTitle, { textAlign: align }]}>
              {d.newPassword}
            </Text>
            <BigField
              label={d.pwTitle}
              placeholder={d.pwTitlePlaceholder}
              value={title}
              onChangeText={setTitle}
            />
            <BigField
              label={d.pwUsername}
              placeholder={d.pwUsernamePlaceholder}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <BigField
              label={d.pwPassword}
              placeholder={d.pwPasswordPlaceholder}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
            <BigField
              label={d.pwNotes}
              placeholder={d.pwNotesPlaceholder}
              value={notes}
              onChangeText={setNotes}
            />
            <View style={styles.navRow}>
              <View style={{ flex: 1 }}>
                <SecondaryButton title={d.cancel} onPress={onCancel} />
              </View>
              <View style={{ flex: 2 }}>
                <PrimaryButton
                  title={d.save}
                  onPress={save}
                  disabled={!title.trim() || !password.trim()}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </LangContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 140,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  header: { marginBottom: 28 },
  appName: { fontFamily: fonts.medium, fontSize: 18, color: colors.textFaint },
  greeting: { fontFamily: fonts.extra, fontSize: 30, color: colors.text },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 40,
    maxWidth: 420,
  },
  plusWrap: { alignItems: "center", gap: 12 },
  plusCircle: {
    width: 112,
    height: 112,
    borderRadius: 999,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  plusSign: {
    color: "#fff",
    fontSize: 64,
    lineHeight: 72,
    fontFamily: fonts.regular,
  },
  plusLabel: { fontFamily: fonts.bold, fontSize: 22, color: colors.blue },
  fab: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  card: {
    borderWidth: 2,
    borderColor: "#e5e5e5",
    borderRadius: 16,
    padding: 18,
  },
  cardHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 12,
  },
  cardTitle: { flex: 1, fontFamily: fonts.extra, fontSize: 28, color: colors.text },
  deleteText: { fontFamily: fonts.bold, fontSize: 18, color: colors.red },
  username: {
    fontFamily: fonts.regular,
    fontSize: 21,
    color: colors.textMuted,
    marginBottom: 8,
    textAlign: "left",
    writingDirection: "ltr",
  },
  pwRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  pwText: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.text,
    writingDirection: "ltr",
  },
  smallBtn: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  smallBtnText: { fontFamily: fonts.bold, fontSize: 16, color: colors.text },
  notes: {
    fontFamily: fonts.regular,
    fontSize: 18,
    color: colors.textMuted,
    marginTop: 12,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
  },
  sheetTitle: { fontFamily: fonts.extra, fontSize: 28, color: colors.text },
  navRow: { flexDirection: "row", gap: 14, marginTop: 8 },
});

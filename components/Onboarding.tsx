import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type {
  Child,
  Gender,
  Lang,
  MaritalStatus,
  Profile,
  SecurityQA,
} from "../lib/types";
import {
  MARITAL_OPTIONS,
  buildQuestionBank,
  hasSpouse,
  maritalLabel,
  spousePlaceholder,
  spouseQuestion,
  t,
} from "../lib/i18n";
import { uid } from "../lib/storage";
import { colors, fonts } from "../lib/theme";
import { LangContext, useAlign } from "../lib/lang";
import {
  BigField,
  BigInput,
  ChoiceButton,
  PrimaryButton,
  SecondaryButton,
} from "./ui";

const TOTAL_STEPS = 3;

export default function Onboarding({
  onDone,
}: {
  onDone: (profile: Profile) => void;
}) {
  const [lang, setLang] = useState<Lang>("he");
  const [step, setStep] = useState(0); // 0 = welcome, 1..3 = questionnaire
  const [error, setError] = useState("");

  // ---- Draft profile ----
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | "">("");
  const [spouseName, setSpouseName] = useState("");
  const [children, setChildren] = useState<Child[]>([{ id: uid(), name: "" }]);

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");

  const [selected, setSelected] = useState<SecurityQA[]>([]);

  const d = t[lang];
  const align = lang === "he" ? "right" : "left";

  function toggleLang() {
    setLang((l) => (l === "he" ? "en" : "he"));
  }

  // ---- Children helpers ----
  function setChildName(id: string, value: string) {
    setChildren((cs) => cs.map((c) => (c.id === id ? { ...c, name: value } : c)));
  }
  function addChild() {
    setChildren((cs) => [...cs, { id: uid(), name: "" }]);
  }
  function removeChild(id: string) {
    setChildren((cs) => (cs.length > 1 ? cs.filter((c) => c.id !== id) : cs));
  }

  // ---- Question bank (depends on earlier answers) ----
  const bank = useMemo(
    () =>
      buildQuestionBank(
        {
          gender: (gender || "male") as Gender,
          maritalStatus: (maritalStatus || "married") as MaritalStatus,
          spouseName,
          children,
        },
        lang
      ),
    [gender, maritalStatus, spouseName, children, lang]
  );

  function isSelected(id: string) {
    return selected.some((q) => q.id === id);
  }
  function toggleQuestion(id: string, question: string) {
    setSelected((s) =>
      s.some((q) => q.id === id)
        ? s.filter((q) => q.id !== id)
        : [...s, { id, question, answer: "" }]
    );
  }
  function setAnswer(id: string, answer: string) {
    setSelected((s) => s.map((q) => (q.id === id ? { ...q, answer } : q)));
  }
  function addCustomQuestion() {
    setSelected((s) => [
      ...s,
      { id: uid(), question: "", answer: "", custom: true },
    ]);
  }
  function setCustomQuestionText(id: string, question: string) {
    setSelected((s) => s.map((q) => (q.id === id ? { ...q, question } : q)));
  }
  function removeCustom(id: string) {
    setSelected((s) => s.filter((q) => q.id !== id));
  }

  // ---- Validation ----
  function validate(): boolean {
    setError("");
    if (step === 1 && (!name.trim() || !gender || !maritalStatus)) {
      setError(d.required);
      return false;
    }
    if (step === 2 && (!email.trim() || !address.trim() || !phone.trim())) {
      setError(d.required);
      return false;
    }
    if (step === 3) {
      const answered = selected.filter(
        (q) => q.question.trim() && q.answer.trim()
      );
      if (answered.length < 2) {
        setError(d.s3Min);
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validate()) return;
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
      return;
    }
    const profile: Profile = {
      lang,
      name: name.trim(),
      gender: gender as Gender,
      maritalStatus: maritalStatus as MaritalStatus,
      spouseName: spouseName.trim(),
      children: children.filter((c) => c.name.trim()),
      email: email.trim(),
      address: address.trim(),
      zip: zip.trim(),
      phone: phone.trim(),
      securityQuestions: selected
        .filter((q) => q.question.trim() && q.answer.trim())
        .map((q) => ({
          ...q,
          question: q.question.trim(),
          answer: q.answer.trim(),
        })),
      createdAt: Date.now(),
    };
    onDone(profile);
  }

  function back() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  const answeredCount = selected.filter(
    (q) => q.question.trim() && q.answer.trim()
  ).length;

  return (
    <LangContext.Provider value={lang}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appName}>{d.appName}</Text>
            <Pressable style={styles.langBtn} onPress={toggleLang}>
              <Text style={styles.langBtnText}>{d.langName}</Text>
            </Pressable>
          </View>

          {/* Progress */}
          {step > 0 && (
            <View style={{ marginBottom: 24 }}>
              <Text style={[styles.progressLabel, { textAlign: align }]}>
                {d.stepOf(step, TOTAL_STEPS)}
              </Text>
              <View style={styles.progressRow}>
                {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.progressSeg,
                      {
                        backgroundColor:
                          i < step ? colors.blue : "#e5e5e5",
                      },
                    ]}
                  />
                ))}
              </View>
            </View>
          )}

          {step === 0 && <Welcome d={d} onStart={() => setStep(1)} />}

          {step === 1 && (
            <View style={{ gap: 28 }}>
              <Text style={[styles.h1, { textAlign: align }]}>{d.s1Title}</Text>

              <BigField
                label={d.qName}
                placeholder={d.qNamePlaceholder}
                value={name}
                onChangeText={setName}
              />

              {/* Gender */}
              <View>
                <Text style={[styles.label, { textAlign: align }]}>
                  {d.qGender}
                </Text>
                <View style={styles.grid2}>
                  <View style={styles.gridItem2}>
                    <ChoiceButton
                      label={d.genderMale}
                      active={gender === "male"}
                      onPress={() => setGender("male")}
                    />
                  </View>
                  <View style={styles.gridItem2}>
                    <ChoiceButton
                      label={d.genderFemale}
                      active={gender === "female"}
                      onPress={() => setGender("female")}
                    />
                  </View>
                </View>
              </View>

              {/* Marital status */}
              <View>
                <Text style={[styles.label, { textAlign: align }]}>
                  {d.qMarital}
                </Text>
                <View style={{ gap: 12 }}>
                  {MARITAL_OPTIONS.map((opt) => (
                    <ChoiceButton
                      key={opt}
                      label={maritalLabel(
                        opt,
                        (gender || "male") as Gender,
                        lang
                      )}
                      active={maritalStatus === opt}
                      onPress={() => setMaritalStatus(opt)}
                    />
                  ))}
                </View>
              </View>

              {/* Spouse (adaptive) */}
              {maritalStatus !== "" && hasSpouse(maritalStatus) && (
                <BigField
                  label={spouseQuestion(
                    maritalStatus,
                    (gender || "male") as Gender,
                    lang
                  )}
                  placeholder={spousePlaceholder(lang)}
                  value={spouseName}
                  onChangeText={setSpouseName}
                />
              )}

              {/* Children */}
              <View>
                <Text style={[styles.label, { textAlign: align }]}>
                  {d.qChildren}
                </Text>
                <View style={{ gap: 12 }}>
                  {children.map((c, i) => (
                    <View key={c.id} style={styles.childRow}>
                      <View style={styles.flex}>
                        <BigInput
                          placeholder={d.childPlaceholder(i + 1)}
                          value={c.name}
                          onChangeText={(v) => setChildName(c.id, v)}
                        />
                      </View>
                      {children.length > 1 && (
                        <Pressable
                          onPress={() => removeChild(c.id)}
                          style={styles.removeBtn}
                        >
                          <Text style={styles.removeBtnText}>✕</Text>
                        </Pressable>
                      )}
                    </View>
                  ))}
                </View>
                <Pressable onPress={addChild} style={{ marginTop: 14 }}>
                  <Text style={[styles.linkAdd, { textAlign: align }]}>
                    + {d.addChild}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={{ gap: 28 }}>
              <Text style={[styles.h1, { textAlign: align }]}>{d.s2Title}</Text>
              <BigField
                label={d.qEmail}
                placeholder={d.qEmailPlaceholder}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <BigField
                label={d.qAddress}
                placeholder={d.qAddressPlaceholder}
                value={address}
                onChangeText={setAddress}
              />
              <BigField
                label={d.qZip}
                placeholder={d.qZipPlaceholder}
                value={zip}
                onChangeText={setZip}
                keyboardType="number-pad"
              />
              <BigField
                label={d.qPhone}
                placeholder={d.qPhonePlaceholder}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          )}

          {step === 3 && (
            <View style={{ gap: 18 }}>
              <Text style={[styles.h1, { textAlign: align }]}>{d.s3Title}</Text>
              <Text style={[styles.body, { textAlign: align }]}>
                {d.s3Body}
              </Text>
              <Text style={[styles.selectedCount, { textAlign: align }]}>
                {d.s3Selected(answeredCount)}
              </Text>

              {bank.map((q) => {
                const on = isSelected(q.id);
                const entry = selected.find((s) => s.id === q.id);
                return (
                  <View
                    key={q.id}
                    style={[
                      styles.qCard,
                      on
                        ? { borderColor: colors.blue, backgroundColor: colors.blueBg }
                        : { borderColor: colors.border },
                    ]}
                  >
                    <Pressable
                      onPress={() => toggleQuestion(q.id, q.question)}
                      style={styles.qHead}
                    >
                      <Text style={[styles.qText, { textAlign: align }]}>
                        {q.question}
                      </Text>
                      <View
                        style={[
                          styles.pill,
                          on
                            ? { backgroundColor: colors.blue }
                            : { borderWidth: 2, borderColor: colors.borderStrong },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pillText,
                            { color: on ? "#fff" : colors.textMuted },
                          ]}
                        >
                          {on ? "✓ " + d.selectedQuestion : d.selectQuestion}
                        </Text>
                      </View>
                    </Pressable>
                    {on && (
                      <View style={{ marginTop: 14 }}>
                        <BigInput
                          placeholder={d.answerPlaceholder}
                          value={entry?.answer ?? ""}
                          onChangeText={(v) => setAnswer(q.id, v)}
                        />
                      </View>
                    )}
                  </View>
                );
              })}

              {/* Custom questions */}
              {selected
                .filter((q) => q.custom)
                .map((q) => (
                  <View
                    key={q.id}
                    style={[
                      styles.qCard,
                      { borderColor: colors.blue, backgroundColor: colors.blueBg },
                    ]}
                  >
                    <View style={styles.childRow}>
                      <View style={styles.flex}>
                        <BigInput
                          placeholder={d.ownQuestionPlaceholder}
                          value={q.question}
                          onChangeText={(v) => setCustomQuestionText(q.id, v)}
                        />
                      </View>
                      <Pressable
                        onPress={() => removeCustom(q.id)}
                        style={styles.removeBtn}
                      >
                        <Text style={styles.removeBtnText}>✕</Text>
                      </Pressable>
                    </View>
                    <View style={{ marginTop: 12 }}>
                      <BigInput
                        placeholder={d.answerPlaceholder}
                        value={q.answer}
                        onChangeText={(v) => setAnswer(q.id, v)}
                      />
                    </View>
                  </View>
                ))}

              <Pressable onPress={addCustomQuestion}>
                <Text style={[styles.linkAdd, { textAlign: align }]}>
                  + {d.addOwnQuestion}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Error */}
          {error !== "" && (
            <View style={styles.errorBox}>
              <Text style={[styles.errorText, { textAlign: align }]}>
                {error}
              </Text>
            </View>
          )}

          {/* Navigation */}
          {step > 0 && (
            <View style={styles.navRow}>
              <View style={{ flex: 1 }}>
                <SecondaryButton title={d.back} onPress={back} />
              </View>
              <View style={{ flex: 2 }}>
                <PrimaryButton
                  title={step === TOTAL_STEPS ? d.finish : d.next}
                  onPress={next}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LangContext.Provider>
  );
}

function Welcome({
  d,
  onStart,
}: {
  d: (typeof t)["he"];
  onStart: () => void;
}) {
  return (
    <View style={styles.welcome}>
      <Text style={styles.welcomeIcon}>🔐</Text>
      <Text style={styles.welcomeTitle}>{d.welcomeTitle}</Text>
      <Text style={styles.tagline}>{d.tagline}</Text>
      <Text style={styles.welcomeBody}>{d.welcomeBody}</Text>
      <View style={{ width: "100%", maxWidth: 360, marginTop: 28 }}>
        <PrimaryButton title={d.welcomeStart} onPress={onStart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    maxWidth: 640,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  appName: { fontFamily: fonts.extra, fontSize: 26, color: colors.text },
  langBtn: {
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  langBtnText: { fontFamily: fonts.bold, fontSize: 18, color: colors.text },
  progressLabel: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.textMuted,
    marginBottom: 8,
  },
  progressRow: { flexDirection: "row", gap: 8 },
  progressSeg: { flex: 1, height: 12, borderRadius: 999 },
  h1: { fontFamily: fonts.extra, fontSize: 34, color: colors.text },
  body: { fontFamily: fonts.regular, fontSize: 19, color: colors.textMuted },
  label: {
    fontFamily: fonts.medium,
    fontSize: 22,
    color: colors.text,
    marginBottom: 12,
  },
  grid2: { flexDirection: "row", gap: 16 },
  gridItem2: { flex: 1 },
  childRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  removeBtn: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  removeBtnText: { fontSize: 22, color: colors.textMuted },
  linkAdd: { fontFamily: fonts.bold, fontSize: 19, color: colors.blue },
  selectedCount: { fontFamily: fonts.bold, fontSize: 17, color: colors.blue },
  qCard: { borderWidth: 2, borderRadius: 16, padding: 18 },
  qHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  qText: { flex: 1, fontFamily: fonts.medium, fontSize: 21, color: colors.text },
  pill: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  pillText: { fontFamily: fonts.bold, fontSize: 16 },
  errorBox: {
    marginTop: 24,
    backgroundColor: colors.redBg,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  errorText: { fontFamily: fonts.bold, fontSize: 18, color: colors.red },
  navRow: { flexDirection: "row", gap: 14, marginTop: 28 },
  welcome: { alignItems: "center", paddingTop: 40, paddingHorizontal: 8 },
  welcomeIcon: { fontSize: 72, marginBottom: 16 },
  welcomeTitle: {
    fontFamily: fonts.extra,
    fontSize: 44,
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  tagline: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: colors.blue,
    marginBottom: 12,
    textAlign: "center",
  },
  welcomeBody: {
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 32,
    maxWidth: 420,
  },
});

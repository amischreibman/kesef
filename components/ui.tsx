import { ReactNode } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";
import { colors, fonts } from "../lib/theme";
import { useAlign } from "../lib/lang";

/** A large, high-contrast labeled text field. */
export function BigField({
  label,
  hint,
  ...props
}: {
  label: string;
  hint?: string;
} & TextInputProps) {
  const align = useAlign();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.label, { textAlign: align }]}>{label}</Text>
      {hint ? (
        <Text style={[styles.hint, { textAlign: align }]}>{hint}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textFaint}
        {...props}
        style={[styles.input, { textAlign: align }]}
      />
    </View>
  );
}

/** Plain large text input (no label) for inline rows. */
export function BigInput(props: TextInputProps) {
  const align = useAlign();
  return (
    <TextInput
      placeholderTextColor={colors.textFaint}
      {...props}
      style={[styles.input, { textAlign: align }, props.style]}
    />
  );
}

export function PrimaryButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: disabled ? colors.disabled : colors.blue },
        pressed && !disabled && { backgroundColor: colors.blueDark },
      ]}
    >
      <Text
        style={[
          styles.btnText,
          { color: disabled ? colors.textMuted : "#ffffff" },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function SecondaryButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        styles.btnOutline,
        pressed && { backgroundColor: "#f5f5f5" },
      ]}
    >
      <Text style={[styles.btnText, { color: colors.text }]}>{title}</Text>
    </Pressable>
  );
}

/** A large selectable option (gender, marital status, etc.). */
export function ChoiceButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.choice,
        active
          ? { backgroundColor: colors.blue, borderColor: colors.blue }
          : { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text
        style={[
          styles.choiceText,
          { color: active ? "#ffffff" : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fieldWrap: { width: "100%" },
  label: {
    fontFamily: fonts.medium,
    fontSize: 22,
    color: colors.text,
    marginBottom: 8,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.textMuted,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 22,
    fontFamily: fonts.regular,
    color: colors.text,
  },
  btn: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutline: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  btnText: { fontFamily: fonts.bold, fontSize: 22 },
  choice: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceText: { fontFamily: fonts.bold, fontSize: 21, textAlign: "center" },
});

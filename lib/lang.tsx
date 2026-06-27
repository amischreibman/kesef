import { createContext, useContext } from "react";
import type { Lang } from "./types";

/**
 * Provides the current language to the whole tree so components can align
 * text and flip rows without prop-drilling. We handle direction manually
 * (textAlign / flexDirection) instead of React Native's global I18nManager,
 * because the user can toggle language at runtime and forcing native RTL
 * would require an app restart.
 */
export const LangContext = createContext<Lang>("he");

export function useLang(): Lang {
  return useContext(LangContext);
}

/** Text alignment for the current language. */
export function useAlign(): "right" | "left" {
  return useLang() === "he" ? "right" : "left";
}

/** Row direction so the label/control order reads naturally per language. */
export function useRowDirection(): "row" | "row-reverse" {
  return useLang() === "he" ? "row-reverse" : "row";
}

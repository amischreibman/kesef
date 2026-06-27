"use client";

import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";
import { loadProfile, saveProfile } from "@/lib/storage";
import Onboarding from "@/components/Onboarding";
import MainScreen from "@/components/MainScreen";

export default function Home() {
  // Read the saved profile lazily. On the server `loadProfile` returns null,
  // but the UI below is gated behind `ready`, so the first client render
  // matches the server output and there is no hydration mismatch.
  const [profile, setProfile] = useState<Profile | null>(() => loadProfile());
  const [ready, setReady] = useState(false);

  // Mark as mounted on the client so we can safely show storage-backed UI.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount flag to avoid SSR/CSR mismatch
    setReady(true);
  }, []);

  function handleDone(p: Profile) {
    saveProfile(p);
    setProfile(p);
  }

  // Avoid a flash of the wrong screen before localStorage is read.
  if (!ready) {
    return <div className="min-h-screen bg-white" />;
  }

  return profile ? (
    <MainScreen profile={profile} />
  ) : (
    <Onboarding onDone={handleDone} />
  );
}

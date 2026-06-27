"use client";

import { useEffect, useState } from "react";
import type { PasswordEntry, Profile } from "@/lib/types";
import { t } from "@/lib/i18n";
import { loadEntries, saveEntries, uid } from "@/lib/storage";
import { PrimaryButton, SecondaryButton } from "./ui";

export default function MainScreen({ profile }: { profile: Profile }) {
  const d = t[profile.lang];
  const [entries, setEntries] = useState<PasswordEntry[]>(() => loadEntries());
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    document.documentElement.lang = profile.lang;
    document.documentElement.dir = d.dir;
  }, [profile.lang, d.dir]);

  function addEntry(entry: PasswordEntry) {
    const updated = [entry, ...entries];
    setEntries(updated);
    saveEntries(updated);
    setAdding(false);
  }

  function deleteEntry(id: string) {
    if (!window.confirm(d.confirmDelete)) return;
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveEntries(updated);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-xl font-medium text-neutral-500">
              {d.appName}
            </div>
            <h1 className="text-3xl font-extrabold text-black">
              {d.mainGreeting(profile.name)}
            </h1>
          </div>
        </header>

        {/* Entries or empty state */}
        <div className="flex-1">
          {entries.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="mb-10 max-w-md whitespace-pre-line text-2xl leading-relaxed text-neutral-600">
                {d.mainEmpty}
              </p>
              <BigPlus label={d.addPassword} onClick={() => setAdding(true)} />
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((e) => (
                <EntryCard
                  key={e.id}
                  entry={e}
                  d={d}
                  onDelete={() => deleteEntry(e.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Floating add button when there are entries */}
        {entries.length > 0 && (
          <div className="sticky bottom-6 mt-8 flex justify-center">
            <BigPlus label={d.addPassword} onClick={() => setAdding(true)} />
          </div>
        )}
      </div>

      {adding && (
        <AddPasswordSheet d={d} onSave={addEntry} onCancel={() => setAdding(false)} />
      )}
    </div>
  );
}

function BigPlus({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-3"
    >
      <span className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-700 text-7xl font-light leading-none text-white shadow-lg transition-colors hover:bg-blue-800">
        +
      </span>
      <span className="text-2xl font-bold text-blue-700">{label}</span>
    </button>
  );
}

function EntryCard({
  entry,
  d,
  onDelete,
}: {
  entry: PasswordEntry;
  d: (typeof t)["he"];
  onDelete: () => void;
}) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(entry.password);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  return (
    <div className="rounded-2xl border-2 border-neutral-200 p-5">
      <div className="mb-2 flex items-start justify-between gap-3">
        <h2 className="text-3xl font-extrabold text-black">{entry.title}</h2>
        <button
          onClick={onDelete}
          className="text-xl font-bold text-red-600 hover:underline"
        >
          {d.delete}
        </button>
      </div>
      {entry.username && (
        <div className="mb-2 text-2xl text-neutral-700" dir="ltr" style={{ textAlign: "start" }}>
          {entry.username}
        </div>
      )}
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold text-black" dir="ltr" style={{ textAlign: "start" }}>
          {show ? entry.password : "••••••••"}
        </span>
        <button
          onClick={() => setShow((s) => !s)}
          className="rounded-full border-2 border-neutral-300 px-4 py-1 text-lg font-bold text-black hover:bg-neutral-100"
        >
          {show ? d.hide : d.show}
        </button>
        <button
          onClick={copy}
          className="rounded-full border-2 border-neutral-300 px-4 py-1 text-lg font-bold text-black hover:bg-neutral-100"
        >
          {copied ? d.copied : d.copy}
        </button>
      </div>
      {entry.notes && (
        <p className="mt-3 text-xl text-neutral-600">{entry.notes}</p>
      )}
    </div>
  );
}

function AddPasswordSheet({
  d,
  onSave,
  onCancel,
}: {
  d: (typeof t)["he"];
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 sm:rounded-3xl">
        <h2 className="mb-6 text-3xl font-extrabold text-black">
          {d.newPassword}
        </h2>
        <div className="space-y-5">
          <Field
            label={d.pwTitle}
            placeholder={d.pwTitlePlaceholder}
            value={title}
            onChange={setTitle}
            autoFocus
          />
          <Field
            label={d.pwUsername}
            placeholder={d.pwUsernamePlaceholder}
            value={username}
            onChange={setUsername}
          />
          <Field
            label={d.pwPassword}
            placeholder={d.pwPasswordPlaceholder}
            value={password}
            onChange={setPassword}
          />
          <Field
            label={d.pwNotes}
            placeholder={d.pwNotesPlaceholder}
            value={notes}
            onChange={setNotes}
          />
        </div>
        <div className="mt-8 flex gap-4">
          <div className="flex-1">
            <SecondaryButton onClick={onCancel}>{d.cancel}</SecondaryButton>
          </div>
          <div className="flex-[2]">
            <PrimaryButton
              onClick={save}
              disabled={!title.trim() || !password.trim()}
            >
              {d.save}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  autoFocus,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-2xl font-medium text-black">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-2xl border-2 border-neutral-300 bg-white px-5 py-4 text-2xl text-black placeholder:text-neutral-400 focus:border-blue-700"
      />
    </label>
  );
}

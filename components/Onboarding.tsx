"use client";

import { useEffect, useMemo, useState } from "react";
import type {
  Child,
  Gender,
  Lang,
  MaritalStatus,
  Profile,
  SecurityQA,
} from "@/lib/types";
import {
  MARITAL_OPTIONS,
  buildQuestionBank,
  hasSpouse,
  maritalLabel,
  spousePlaceholder,
  spouseQuestion,
  t,
} from "@/lib/i18n";
import { uid } from "@/lib/storage";
import { BigField, PrimaryButton, SecondaryButton } from "./ui";

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

  // Keep the document direction/lang in sync with the chosen language.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = d.dir;
  }, [lang, d.dir]);

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
    setSelected((s) =>
      s.map((q) => (q.id === id ? { ...q, question } : q))
    );
  }
  function removeCustom(id: string) {
    setSelected((s) => s.filter((q) => q.id !== id));
  }

  // ---- Validation per step ----
  function validate(): boolean {
    setError("");
    if (step === 1) {
      if (!name.trim() || !gender || !maritalStatus) {
        setError(d.required);
        return false;
      }
    }
    if (step === 2) {
      if (!email.trim() || !address.trim() || !phone.trim()) {
        setError(d.required);
        return false;
      }
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
    // Finish
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
        .map((q) => ({ ...q, question: q.question.trim(), answer: q.answer.trim() })),
      createdAt: Date.now(),
    };
    onDone(profile);
  }

  function back() {
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8">
        {/* Header: language toggle */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-black">{d.appName}</span>
          <button
            onClick={toggleLang}
            className="rounded-full border-2 border-neutral-400 px-5 py-2 text-xl font-bold text-black hover:bg-neutral-100"
          >
            {d.langName}
          </button>
        </div>

        {/* Progress bar (hidden on welcome) */}
        {step > 0 && (
          <div className="mb-8">
            <div className="mb-2 text-xl font-medium text-neutral-600">
              {d.stepOf(step, TOTAL_STEPS)}
            </div>
            <div className="flex gap-2">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 rounded-full ${
                    i < step ? "bg-blue-700" : "bg-neutral-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1">
          {step === 0 && <Welcome d={d} onStart={() => setStep(1)} />}

          {step === 1 && (
            <div className="space-y-8">
              <h1 className="text-4xl font-extrabold text-black">{d.s1Title}</h1>

              <BigField
                label={d.qName}
                placeholder={d.qNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />

              {/* Gender */}
              <div>
                <span className="mb-3 block text-2xl font-medium text-black">
                  {d.qGender}
                </span>
                <div className="grid grid-cols-2 gap-4">
                  <ChoiceButton
                    active={gender === "male"}
                    onClick={() => setGender("male")}
                  >
                    {d.genderMale}
                  </ChoiceButton>
                  <ChoiceButton
                    active={gender === "female"}
                    onClick={() => setGender("female")}
                  >
                    {d.genderFemale}
                  </ChoiceButton>
                </div>
              </div>

              {/* Marital status */}
              <div>
                <span className="mb-3 block text-2xl font-medium text-black">
                  {d.qMarital}
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {MARITAL_OPTIONS.map((opt) => (
                    <ChoiceButton
                      key={opt}
                      active={maritalStatus === opt}
                      onClick={() => setMaritalStatus(opt)}
                    >
                      {maritalLabel(opt, (gender || "male") as Gender, lang)}
                    </ChoiceButton>
                  ))}
                </div>
              </div>

              {/* Spouse name (adaptive) */}
              {maritalStatus && hasSpouse(maritalStatus) && (
                <BigField
                  label={spouseQuestion(
                    maritalStatus,
                    (gender || "male") as Gender,
                    lang
                  )}
                  placeholder={spousePlaceholder(lang)}
                  value={spouseName}
                  onChange={(e) => setSpouseName(e.target.value)}
                />
              )}

              {/* Children */}
              <div>
                <span className="mb-3 block text-2xl font-medium text-black">
                  {d.qChildren}
                </span>
                <div className="space-y-3">
                  {children.map((c, i) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <input
                        value={c.name}
                        onChange={(e) => setChildName(c.id, e.target.value)}
                        placeholder={d.childPlaceholder(i + 1)}
                        className="w-full rounded-2xl border-2 border-neutral-300 bg-white px-5 py-4 text-2xl text-black placeholder:text-neutral-400 focus:border-blue-700"
                      />
                      {children.length > 1 && (
                        <button
                          onClick={() => removeChild(c.id)}
                          aria-label={d.removeChild}
                          className="shrink-0 rounded-2xl border-2 border-neutral-300 px-4 py-4 text-2xl text-neutral-600 hover:bg-neutral-100"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addChild}
                  className="mt-4 text-xl font-bold text-blue-700 hover:underline"
                >
                  + {d.addChild}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <h1 className="text-4xl font-extrabold text-black">{d.s2Title}</h1>
              <BigField
                label={d.qEmail}
                placeholder={d.qEmailPlaceholder}
                type="email"
                inputMode="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <BigField
                label={d.qAddress}
                placeholder={d.qAddressPlaceholder}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <BigField
                label={d.qZip}
                placeholder={d.qZipPlaceholder}
                inputMode="numeric"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
              <BigField
                label={d.qPhone}
                placeholder={d.qPhonePlaceholder}
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold text-black">{d.s3Title}</h1>
              <p className="text-xl text-neutral-700">{d.s3Body}</p>
              <div className="text-lg font-bold text-blue-700">
                {d.s3Selected(
                  selected.filter((q) => q.question.trim() && q.answer.trim())
                    .length
                )}
              </div>

              <div className="space-y-4">
                {bank.map((q) => {
                  const on = isSelected(q.id);
                  const entry = selected.find((s) => s.id === q.id);
                  return (
                    <div
                      key={q.id}
                      className={`rounded-2xl border-2 p-5 ${
                        on ? "border-blue-700 bg-blue-50" : "border-neutral-300"
                      }`}
                    >
                      <button
                        onClick={() => toggleQuestion(q.id, q.question)}
                        className="flex w-full items-center justify-between gap-4 text-start"
                      >
                        <span className="text-2xl font-medium text-black">
                          {q.question}
                        </span>
                        <span
                          className={`shrink-0 rounded-full px-4 py-2 text-lg font-bold ${
                            on
                              ? "bg-blue-700 text-white"
                              : "border-2 border-neutral-400 text-neutral-700"
                          }`}
                        >
                          {on ? "✓ " + d.selectedQuestion : d.selectQuestion}
                        </span>
                      </button>
                      {on && (
                        <input
                          value={entry?.answer ?? ""}
                          onChange={(e) => setAnswer(q.id, e.target.value)}
                          placeholder={d.answerPlaceholder}
                          autoFocus
                          className="mt-4 w-full rounded-2xl border-2 border-neutral-300 bg-white px-5 py-4 text-2xl text-black placeholder:text-neutral-400 focus:border-blue-700"
                        />
                      )}
                    </div>
                  );
                })}

                {/* Custom questions */}
                {selected
                  .filter((q) => q.custom)
                  .map((q) => (
                    <div
                      key={q.id}
                      className="rounded-2xl border-2 border-blue-700 bg-blue-50 p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <input
                          value={q.question}
                          onChange={(e) =>
                            setCustomQuestionText(q.id, e.target.value)
                          }
                          placeholder={d.ownQuestionPlaceholder}
                          autoFocus
                          className="w-full rounded-2xl border-2 border-neutral-300 bg-white px-5 py-4 text-2xl text-black placeholder:text-neutral-400 focus:border-blue-700"
                        />
                        <button
                          onClick={() => removeCustom(q.id)}
                          aria-label={d.removeChild}
                          className="shrink-0 rounded-2xl border-2 border-neutral-300 px-4 py-4 text-2xl text-neutral-600 hover:bg-neutral-100"
                        >
                          ✕
                        </button>
                      </div>
                      <input
                        value={q.answer}
                        onChange={(e) => setAnswer(q.id, e.target.value)}
                        placeholder={d.answerPlaceholder}
                        className="mt-3 w-full rounded-2xl border-2 border-neutral-300 bg-white px-5 py-4 text-2xl text-black placeholder:text-neutral-400 focus:border-blue-700"
                      />
                    </div>
                  ))}
              </div>

              <button
                onClick={addCustomQuestion}
                className="text-xl font-bold text-blue-700 hover:underline"
              >
                + {d.addOwnQuestion}
              </button>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-xl font-bold text-red-700">
            {error}
          </div>
        )}

        {/* Footer navigation */}
        {step > 0 && (
          <div className="mt-8 flex gap-4">
            <div className="flex-1">
              <SecondaryButton onClick={back}>{d.back}</SecondaryButton>
            </div>
            <div className="flex-[2]">
              <PrimaryButton onClick={next}>
                {step === TOTAL_STEPS ? d.finish : d.next}
              </PrimaryButton>
            </div>
          </div>
        )}
      </div>
    </div>
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
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-6 text-7xl">🔐</div>
      <h1 className="mb-4 text-5xl font-extrabold text-black">
        {d.welcomeTitle}
      </h1>
      <p className="mb-2 text-2xl font-bold text-blue-700">{d.tagline}</p>
      <p className="mb-10 max-w-md text-2xl leading-relaxed text-neutral-700">
        {d.welcomeBody}
      </p>
      <div className="w-full max-w-sm">
        <PrimaryButton onClick={onStart}>{d.welcomeStart}</PrimaryButton>
      </div>
    </div>
  );
}

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border-2 px-5 py-5 text-2xl font-bold transition-colors ${
        active
          ? "border-blue-700 bg-blue-700 text-white"
          : "border-neutral-300 bg-white text-black hover:bg-neutral-100"
      }`}
    >
      {children}
    </button>
  );
}

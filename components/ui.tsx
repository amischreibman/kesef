"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

/** A large, high-contrast text input with a clear label. */
export function BigField({
  label,
  hint,
  ...props
}: {
  label: string;
  hint?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-2xl font-medium text-black">
        {label}
      </span>
      {hint ? (
        <span className="mb-3 block text-lg text-neutral-600">{hint}</span>
      ) : null}
      <input
        {...props}
        className="w-full rounded-2xl border-2 border-neutral-300 bg-white px-5 py-4 text-2xl text-black placeholder:text-neutral-400 focus:border-blue-700"
      />
    </label>
  );
}

/** Primary big button. */
export function PrimaryButton({
  children,
  ...props
}: {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-2xl bg-blue-700 px-6 py-5 text-2xl font-bold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-500"
    >
      {children}
    </button>
  );
}

/** Secondary big button (outline). */
export function SecondaryButton({
  children,
  ...props
}: {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full rounded-2xl border-2 border-neutral-400 bg-white px-6 py-5 text-2xl font-bold text-black transition-colors hover:bg-neutral-100"
    >
      {children}
    </button>
  );
}

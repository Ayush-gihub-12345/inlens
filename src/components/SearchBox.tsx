"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({
  defaultValue = "",
  autoFocus = false,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-3 shadow-sm focus-within:border-emerald-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="h-5 w-5 shrink-0 text-zinc-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Try “lost driving licence” or “PAN card fee”"
          autoFocus={autoFocus}
          className="w-full bg-transparent text-base text-zinc-900 placeholder:text-zinc-400 outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}

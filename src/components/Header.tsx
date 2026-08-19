import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            gov
          </span>
          <span className="text-xl font-bold tracking-tight text-emerald-600">
            .inLens
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <Link href="/services" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Services
          </Link>
          <Link href="/updates" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Updates
          </Link>
          <Link href="/search" className="hover:text-zinc-950 dark:hover:text-zinc-50">
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}

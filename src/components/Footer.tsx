export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-500">
        <p>
          gov.inLens is an independent information layer for Indian government
          services. It is not affiliated with, and does not act on behalf of,
          any government department. Applications and logins always happen on
          the official government website — inLens only links you there.
        </p>
        <p className="mt-3">
          &copy; {new Date().getFullYear()} inLens. Part of the inLens family
          of sites.
        </p>
      </div>
    </footer>
  );
}

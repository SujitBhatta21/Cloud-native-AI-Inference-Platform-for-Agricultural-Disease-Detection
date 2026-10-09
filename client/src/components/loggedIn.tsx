interface LoggedInProps {
  handleLogout: () => void;
  handleGoBackToSession: () => void;
}

function LoggedIn({ handleLogout, handleGoBackToSession }: LoggedInProps) {
  return (
    <section
      className="md:border-l md:border-slate-200 md:pl-12"
      aria-labelledby="active-session-heading"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
        Active session
      </p>
      <h2
        id="active-session-heading"
        className="mt-2 text-3xl font-bold tracking-tight"
      >
        You&rsquo;re already logged in
      </h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        Continue your inspection or sign in with a different account.
      </p>
      <div className="mt-6 space-y-3">
        <button
          type="button"
          onClick={handleGoBackToSession}
          className="h-12 w-full rounded bg-blue-600 font-bold text-white hover:bg-blue-700"
          aria-label="Go to the current inspection session"
        >
          Continue inspection
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="h-12 w-full rounded border border-slate-400 font-bold hover:bg-slate-50"
          aria-label="Log out of Cocoa Inspect"
        >
          Log out
        </button>
      </div>
    </section>
  );
}

export default LoggedIn;

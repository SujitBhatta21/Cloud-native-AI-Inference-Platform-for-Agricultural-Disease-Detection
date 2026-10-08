import { useState } from "react";

interface SignUpProps {
  handleSubmitSignUp: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleNotRegistered: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>;
}

const inputStyle =
  "h-12 w-full rounded border border-slate-400 bg-white px-3 outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10";

function SignUp({ handleSubmitSignUp, handleNotRegistered }: SignUpProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <section
      className="md:border-l md:border-slate-200 md:pl-12"
      aria-labelledby="signup-heading"
    >
      <form onSubmit={handleSubmitSignUp} className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            New account
          </p>
          <h2
            id="signup-heading"
            className="mt-2 text-3xl font-bold tracking-tight"
          >
            Request access
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            An administrator reviews each request before sign-in is enabled.
          </p>
        </div>

        <div>
          <label
            htmlFor="signup-organisation"
            className="mb-2 block text-sm font-bold"
          >
            Organisation name
          </label>
          <input
            id="signup-organisation"
            required
            name="organisation_name"
            type="text"
            autoComplete="organization"
            aria-label="Organisation name"
            className={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="signup-email"
            className="mb-2 block text-sm font-bold"
          >
            Email address
          </label>
          <input
            id="signup-email"
            required
            name="username"
            type="email"
            autoComplete="email"
            aria-label="Email address"
            className={inputStyle}
          />
        </div>

        <div>
          <label
            htmlFor="signup-password"
            className="mb-2 block text-sm font-bold"
          >
            Password
          </label>
          <input
            id="signup-password"
            required
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            aria-label="Password, at least 8 characters"
            aria-describedby="password-help"
            className={inputStyle}
          />
          <p id="password-help" className="mt-2 text-xs text-slate-500">
            Use at least 8 characters.
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <input
              id="show-signup-password"
              type="checkbox"
              checked={isPasswordVisible}
              onChange={() => setIsPasswordVisible((visible) => !visible)}
              className="size-4 accent-blue-600"
            />
            <label htmlFor="show-signup-password">Show password</label>
          </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded bg-blue-600 font-bold text-white hover:bg-blue-700"
          aria-label="Create Cocoa Inspect account"
        >
          Request access
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        Already registered?{" "}
        <button
          type="button"
          onClick={handleNotRegistered}
          className="font-bold text-blue-700 underline underline-offset-3"
          aria-label="Return to sign in"
        >
          Sign in
        </button>
      </p>
    </section>
  );
}

export default SignUp;

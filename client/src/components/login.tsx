import { useState } from "react";

interface LoginProps {
  handleSubmitLogin: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleNotRegistered: (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => Promise<void>;
}

const inputStyle =
  "h-12 w-full rounded border border-slate-400 bg-white px-3 outline-none focus:border-blue-600 focus:ring-3 focus:ring-blue-600/10";

function Login({ handleSubmitLogin, handleNotRegistered }: LoginProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <section
      className="md:border-l md:border-slate-200 md:pl-12"
      aria-labelledby="login-heading"
    >
      <form onSubmit={handleSubmitLogin} className="space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            Welcome back
          </p>
          <h2
            id="login-heading"
            className="mt-2 text-3xl font-bold tracking-tight"
          >
            Sign in
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Use your approved account details.
          </p>
        </div>

        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-bold">
            Email address
          </label>
          <input
            id="login-email"
            required
            name="username"
            type="email"
            autoComplete="email"
            aria-label="Email address"
            className={inputStyle}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-bold"
          >
            Password
          </label>
          <input
            id="login-password"
            required
            name="password"
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="current-password"
            aria-label="Password"
            className={inputStyle}
          />
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
            <input
              id="show-login-password"
              type="checkbox"
              checked={isPasswordVisible}
              onChange={() => setIsPasswordVisible((visible) => !visible)}
              className="size-4 accent-blue-600"
            />
            <label htmlFor="show-login-password">Show password</label>
          </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded bg-blue-600 font-bold text-white hover:bg-blue-700"
          aria-label="Sign in to Cocoa Inspect"
        >
          Sign in
        </button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        New here?{" "}
        <button
          type="button"
          onClick={handleNotRegistered}
          className="font-bold text-blue-700 underline underline-offset-3"
          aria-label="Create a new Cocoa Inspect account"
        >
          Request access
        </button>
      </p>
    </section>
  );
}

export default Login;

import React, { useEffect, useState } from "react";
import { signup, login, loginWithGoogle, logout, watchUser } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate?.() ?? (() => {});

  useEffect(() => {
    const unsub = watchUser((u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow p-6 rounded max-w-md w-full">
          <h1 className="text-xl font-bold mb-4">Welcome {user.email}</h1>
          <button
            onClick={logout}
            className="w-full py-2 mb-2 bg-red-500 text-white rounded"
          >
            Sign Out
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-2 border rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">
          {mode === "login" ? "Sign In" : "Create Account"}
        </h1>

        {errorMsg && (
          <p className="text-red-500 mb-3 text-sm">{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded">
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          className="w-full border py-2 rounded mt-4"
          onClick={handleGoogle}
        >
          Continue with Google
        </button>

        <p className="mt-4 text-sm text-center">
          {mode === "login" ? (
            <>
              No account?{" "}
              <button
                className="text-blue-600"
                onClick={() => setMode("signup")}
              >
                Create one
              </button>
            </>
          ) : (
            <>
              Have an account?{" "}
              <button
                className="text-blue-600"
                onClick={() => setMode("login")}
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

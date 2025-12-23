import { useState } from "react";
import { useNavigate } from "react-router-dom";

type RegisterResponse = {
  message?: string;
};

const Register = () => {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const API_BASE = import.meta.env.VITE_API_BASE;
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE}/account/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          password,
        }),
      });

      const data: RegisterResponse = await response.json();

      switch (response.status) {
        case 201:
        case 200:
          setSuccess("Account created successfully!");

          // Store user info locally
          localStorage.setItem("firstName", firstname);
          localStorage.setItem("lastName", lastname);
          localStorage.setItem("username", username);

          setTimeout(() => navigate("/"), 1500);
          break;

        case 401:
          setError("Provide a username, password, firstname and lastname");
          break;

        case 409:
          setError("Username already exists");
          break;

        case 500:
          setError("Issue with the database.");
          break;

        default:
          setError(data.message || "Something went wrong");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First name"
              required
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-1/2 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
            />
            <input
              type="text"
              placeholder="Last name"
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-1/2 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>

          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
          />

          <input
            type="password"
            placeholder="Password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black"
          />

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-600">
              {success}
            </div>
          )}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full text-sm text-white hover:underline"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

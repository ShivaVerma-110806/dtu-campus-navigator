import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../services/authService";
import { MapPin, Loader2 } from "lucide-react";

export default function LoginPage({ onLoginSuccess, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Invalid email or password");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-muted/30 px-4 py-12">
      {/* Login Card */}
      <div className="w-full max-w-[400px] bg-white border border-border rounded-2xl shadow-lg p-8 flex flex-col items-center">
        {/* Logo and Brand */}
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white mb-4">
          <MapPin size={24} className="fill-current" />
        </div>
        <h2 className="text-[20px] font-semibold text-foreground tracking-tight">
          Sign in to FindMyWay
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1 mb-8">
          Use your DTU Navigator Account
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. name@dtu.ac.in"
              className="w-full h-11 px-4 rounded-xl border border-border bg-white text-[14px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Forgot password functionality is coming soon.")}
                className="text-[12px] text-primary font-medium hover:underline focus:outline-none"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              className="w-full h-11 px-4 rounded-xl border border-border bg-white text-[14px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full h-11 bg-primary text-white font-medium text-[14px] rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-colors duration-150 cursor-pointer shadow-sm hover:shadow focus:outline-none mt-2"
          >
            {loginMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[12px] text-muted-foreground px-3">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Register Action */}
        <button
          onClick={() => onNavigate("register")}
          className="w-full h-11 border border-border text-foreground hover:bg-muted font-medium text-[14px] rounded-xl flex items-center justify-center transition-colors duration-150 cursor-pointer focus:outline-none"
        >
          Create account
        </button>
        
        {/* Back link */}
        <button
          onClick={() => onNavigate("map")}
          className="text-[13px] text-muted-foreground font-medium hover:text-foreground hover:underline transition-colors mt-6 focus:outline-none"
        >
          Back to map
        </button>
      </div>
    </div>
  );
}

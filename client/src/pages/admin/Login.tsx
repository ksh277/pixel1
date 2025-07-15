import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("adminAuth") === "true") {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      localStorage.setItem("adminAuth", "true");
      navigate("/admin");
    } else {
      setError("잘못된 비밀번호입니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h1 className="text-xl font-bold text-center">관리자 로그인</h1>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin Password"
          required
        />
        <Button type="submit" className="w-full">
          로그인
        </Button>
      </form>
    </div>
  );
}

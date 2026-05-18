import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { AuthShell, fieldClass, ghostBtn, primaryBtn } from "@/components/AuthShell";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — RoastNote" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: name },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your inbox to confirm your email.");
    navigate({ to: "/login" });
  }

  async function onGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(result.error.message ?? "Sign-in failed");
  }

  return (
    <>
      <Toaster position="top-center" />
      <AuthShell
        eyebrow="Create account"
        title="Pour the first cup."
        subtitle="A few details and your café gets its voice."
        footer={
          <>
            Already brewing?{" "}
            <Link to="/login" className="text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </>
        }
      >
        <button onClick={onGoogle} className={ghostBtn} type="button">
          Continue with Google
        </button>
        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            className={fieldClass}
            type="text"
            placeholder="Café or your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <input
            className={fieldClass}
            type="email"
            placeholder="you@cafe.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className={fieldClass}
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button disabled={loading} className={`${primaryBtn} mt-4`} type="submit">
            {loading ? "Creating account…" : "Create account"}
          </button>
          <p className="mt-2 text-center text-[11px] leading-relaxed text-muted-foreground">
            By continuing you agree to receive a confirmation email.
          </p>
        </form>
      </AuthShell>
    </>
  );
}

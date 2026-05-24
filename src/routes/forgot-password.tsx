import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast, Toaster } from "sonner";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, fieldClass, primaryBtn } from "@/components/AuthShell";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — RoastNote" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
  }

  return (
    <>
      <Toaster position="top-center" />
      <AuthShell
        eyebrow="Reset password"
        title="Forgot it happens."
        subtitle="Enter your email and we'll send a link to set a new password."
        footer={
          <>
            Remembered it?{" "}
            <Link to="/login" className="text-foreground underline underline-offset-4">
              Back to sign in
            </Link>
          </>
        }
      >
        {sent ? (
          <div className="flex flex-col items-center rounded-2xl border border-border/70 bg-cream/40 p-8 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-cream">
              <Mail className="h-4 w-4 text-roast" />
            </div>
            <p className="font-serif text-xl leading-tight text-foreground">
              The link is <span className="italic">on its way.</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If <span className="text-foreground">{email}</span> has an account, a reset email should arrive shortly. Check your inbox — and your spam folder, just in case.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              className={fieldClass}
              type="email"
              placeholder="you@cafe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <button disabled={loading} className={`${primaryBtn} mt-4`} type="submit">
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
      </AuthShell>
    </>
  );
}

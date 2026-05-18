import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast, Toaster } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, fieldClass, primaryBtn } from "@/components/AuthShell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Set new password — RoastNote" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated.");
    navigate({ to: "/" });
  }

  return (
    <>
      <Toaster position="top-center" />
      <AuthShell
        eyebrow="New password"
        title="Set a new one."
        subtitle="Choose something memorable — at least six characters."
        footer={
          <Link to="/login" className="text-foreground underline underline-offset-4">
            Back to sign in
          </Link>
        }
      >
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            className={fieldClass}
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button disabled={loading} className={`${primaryBtn} mt-4`} type="submit">
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </AuthShell>
    </>
  );
}

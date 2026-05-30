import { useEffect, useState } from "react";
import { X, Key } from "lucide-react";
import { getApiKey, setApiKey } from "@/lib/healthStorage";

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [key, setKey] = useState("");

  useEffect(() => {
    if (open) setKey(getApiKey());
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Key className="h-5 w-5 text-primary" /> Settings
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          OpenRouter API Key
        </label>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-or-..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Stored locally in your browser. Get one at openrouter.ai/keys
        </p>
        <button
          onClick={() => {
            setApiKey(key.trim());
            onClose();
          }}
          className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
}
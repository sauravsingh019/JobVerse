import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@/lib/auth";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#22d3ee",
          colorBackground: "#0f172a",
          colorText: "#f8fafc",
          colorTextSecondary: "#cbd5e1",
          colorInputBackground: "#111827",
          colorInputText: "#f8fafc",
          colorNeutral: "#94a3b8",
          borderRadius: "16px",
        },
        elements: {
          card: "bg-slate-900/95 border border-white/10 shadow-2xl",
          rootBox: "text-slate-50",
          headerTitle: "text-slate-50",
          headerSubtitle: "text-slate-300",
          socialButtonsBlockButton:
            "border border-white/10 bg-slate-800 text-slate-50 hover:bg-slate-700",
          socialButtonsBlockButtonText: "text-slate-50",
          dividerText: "text-slate-400",
          dividerLine: "bg-white/10",
          formFieldLabel: "text-slate-200",
          formFieldInput:
            "border border-white/10 bg-slate-950 text-slate-50 placeholder:text-slate-500",
          footerActionText: "text-slate-400",
          footerActionLink: "text-cyan-300 hover:text-cyan-200",
          formButtonPrimary:
            "bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-lg",
          identityPreviewText: "text-slate-100",
          identityPreviewEditButton: "text-cyan-300",
          formResendCodeLink: "text-cyan-300 hover:text-cyan-200",
          otpCodeFieldInput:
            "border border-white/10 bg-slate-950 text-slate-50",
          alertText: "text-slate-100",
        },
      }}
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

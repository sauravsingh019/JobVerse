import { useSyncExternalStore } from "react";
import {
  ClerkProvider as RealClerkProvider,
  SignedIn as RealSignedIn,
  SignedOut as RealSignedOut,
  SignIn as RealSignIn,
  UserButton as RealUserButton,
  useSession as realUseSession,
  useUser as realUseUser,
} from "@clerk/clerk-react";
import { IS_DEMO_AUTH } from "./demo-mode";

const listeners = new Set();

const demoState = {
  user: {
    id: "demo-user",
    fullName: "Demo Recruiter",
    firstName: "Demo",
    lastName: "Recruiter",
    imageUrl: "/logo1.png",
    unsafeMetadata: {
      role: "recruiter",
    },
    async update(patch) {
      demoState.user = {
        ...demoState.user,
        ...patch,
        unsafeMetadata: {
          ...demoState.user.unsafeMetadata,
          ...(patch?.unsafeMetadata || {}),
        },
      };
      listeners.forEach((listener) => listener());
      return demoState.user;
    },
  },
};

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return demoState.user;
}

export function ClerkProvider({ children, ...props }) {
  if (IS_DEMO_AUTH) {
    return <>{children}</>;
  }

  return <RealClerkProvider {...props}>{children}</RealClerkProvider>;
}

export function useUser() {
  if (!IS_DEMO_AUTH) {
    return realUseUser();
  }

  const user = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return {
    isLoaded: true,
    isSignedIn: true,
    user,
  };
}

export function useSession() {
  if (!IS_DEMO_AUTH) {
    return realUseSession();
  }

  return {
    session: {
      async getToken() {
        return null;
      },
    },
  };
}

export function SignedIn({ children }) {
  if (!IS_DEMO_AUTH) {
    return <RealSignedIn>{children}</RealSignedIn>;
  }

  return <>{children}</>;
}

export function SignedOut({ children }) {
  if (!IS_DEMO_AUTH) {
    return <RealSignedOut>{children}</RealSignedOut>;
  }

  return null;
}

export function SignIn(props) {
  if (!IS_DEMO_AUTH) {
    return <RealSignIn {...props} />;
  }

  return (
    <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950/95 p-8 text-white shadow-2xl">
      <div className="text-2xl font-semibold">Preview Mode</div>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        Clerk keys missing hain, isliye live auth ki jagah demo mode chal raha hai.
        UI preview fully visible hai.
      </p>
    </div>
  );
}

function DemoUserButton({ children }) {
  const { user } = useUser();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 text-sm font-semibold text-cyan-100">
      {user?.firstName?.[0] || "D"}
      {children}
    </div>
  );
}

DemoUserButton.MenuItems = function MenuItems() {
  return null;
};

DemoUserButton.Link = function UserButtonLink() {
  return null;
};

DemoUserButton.Action = function UserButtonAction() {
  return null;
};

export const UserButton = IS_DEMO_AUTH ? DemoUserButton : RealUserButton;

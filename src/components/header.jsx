import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@/lib/auth";
import { Button } from "./ui/button";
import {
  Bell,
  BriefcaseBusiness,
  Heart,
  LayoutDashboard,
  PenBox,
  Search,
} from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const exploreTarget = user ? "/jobs" : "/?sign-in=true";
  const dashboardTarget = user ? "/my-jobs" : "/?sign-in=true";
  const postTarget =
    user?.unsafeMetadata?.role === "recruiter"
      ? "/post-job"
      : user
        ? "/onboarding?mode=recruiter"
        : "/?sign-in=true";
  const postLabel =
    user?.unsafeMetadata?.role === "recruiter" ? "Post a Job" : "Create Post";

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="sticky top-4 z-20 mb-8 rounded-[28px] border border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-emerald-400 text-lg font-black text-slate-950 shadow-[0_20px_50px_rgba(34,211,238,0.35)]">
                JV
              </div>
              <div>
                <div className="text-lg font-semibold tracking-tight text-white">JobVerse</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Discover. Hire. Grow.
                </div>
              </div>
            </Link>
            <Link
              to={exploreTarget}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-white lg:inline-flex"
            >
              <Search size={16} />
              Explore jobs
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={dashboardTarget}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <SignedOut>
              <Button
                variant="outline"
                className="rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={() => setShowSignIn(true)}
              >
                Login
              </Button>
            </SignedOut>
            <SignedIn>
              <Link to={postTarget}>
                <Button variant="blue" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  {postLabel}
                </Button>
              </Link>
              <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 lg:flex">
                <Bell size={16} />
              </div>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10 ring-2 ring-cyan-400/40",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                  <UserButton.Link
                    label="Browse Jobs"
                    labelIcon={<Search size={15} />}
                    href="/jobs"
                  />
                  <UserButton.Action label="manageAccount" />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
          </div>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;

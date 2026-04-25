import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Search,
  ShieldCheck,
  Users2,
} from "lucide-react";
import { useUser } from "@/lib/auth";

const LandingPage = () => {
  const { isSignedIn } = useUser();
  const jobsTarget = isSignedIn ? "/jobs" : "/?sign-in=true";
  const postTarget = isSignedIn
    ? "/onboarding?mode=recruiter"
    : "/?sign-in=true";

  const stats = [
    { label: "Active openings", value: "12k+" },
    { label: "Hiring teams", value: "850+" },
    { label: "Candidate saves", value: "48k+" },
  ];

  const features = [
    {
      title: "Precision search",
      body: "Search by role, stack, company, or location with modern layered filters.",
      icon: Search,
    },
    {
      title: "Recruiter workflow",
      body: "Post jobs, review applications, and manage hiring status from one clean dashboard.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Trusted profiles",
      body: "Candidate journeys feel guided, polished, and ready for real applications.",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="flex flex-col gap-10 py-6 sm:gap-16 sm:py-10">
      <section className="grid gap-8 rounded-[40px] border border-white/10 bg-slate-950/75 p-8 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-200">
            <BadgeCheck size={14} />
            LinkedIn-style hiring experience
          </div>
          <h1 className="gradient-title text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
            Build your next career move or hire top talent.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            This portal is redesigned to feel modern, premium, and hiring-ready with
            better search, smarter filters, and clean recruiter workflows.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to={jobsTarget}>
              <Button variant="blue" size="xl" className="w-full rounded-full sm:w-auto">
                Explore Jobs
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to={postTarget}>
              <Button
                variant="outline"
                size="xl"
                className="w-full rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 sm:w-auto"
              >
                Hire Talent
              </Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <div className="text-3xl font-bold text-white">{item.value}</div>
                <div className="text-sm text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-emerald-500/10 p-6">
          <div className="grid gap-4">
            <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                  <Users2 size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white">Candidate momentum</div>
                  <div className="text-sm text-slate-400">Daily shortlist insights</div>
                </div>
              </div>
              <div className="text-sm leading-7 text-slate-300">
                Rich cards, saved jobs, application tracking, and faster scanning for role fit.
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-slate-950/85 p-5">
              <div className="mb-3 text-sm uppercase tracking-[0.22em] text-cyan-300">
                Recruiter command center
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  Publish jobs with structured metadata.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  Review candidate applications from one place.
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  Toggle open and closed roles instantly.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-4"
      >
        <CarouselContent className="flex items-center gap-5 sm:gap-20">
          {companies.map(({ name, id, path }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basis-1/6 ">
              <img
                src={path}
                alt={name}
                className="h-9 object-contain sm:h-14"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <img src="/banner1.png" className="w-full rounded-[36px] border border-white/10 object-cover" />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {features.map(({ title, body, icon: Icon }) => (
          <Card key={title} className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <div className="mb-4 inline-flex w-fit rounded-2xl bg-cyan-400/10 p-3 text-cyan-300">
                <Icon size={18} />
              </div>
              <CardTitle className="font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">{body}</CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-bold">For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Search and apply for jobs, track applications, and more.
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            Post jobs, manage applications, and find the best candidates.
          </CardContent>
        </Card>
      </section>

      <Accordion type="multiple" className="w-full rounded-[32px] border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index + 1}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
};

export default LandingPage;

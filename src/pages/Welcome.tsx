import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Mail,
  LogIn,
  Inbox,
  Users,
  Briefcase,
  Zap,
  Workflow,
  Phone,
  CreditCard,
  Rocket,
  Building2,
  ShieldCheck,
} from "lucide-react";

/**
 * Welcome Page
 * Post-registration guidance screen
 * No config checks, no readiness logic
 */
export default function Welcome() {
  const navigate = useNavigate();

  const pendingEmail =
    typeof window !== "undefined"
      ? sessionStorage.getItem("epay:pendingEmail") || undefined
      : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto max-w-8xl px-4 py-6 space-y-8">
        {/* ================= HERO ================= */}
        <div className="grid lg:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Account Created Successfully!
            </h1>

            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
              Welcome to Tainc. Your workspace is ready.
              {pendingEmail &&
                ` A verification email has been sent to ${pendingEmail}.`}
            </p>

            <InfoBox
              email={pendingEmail}
              text={
                pendingEmail
                  ? "Please verify your email to activate your account."
                  : "Check your email for login Credentials."
              }
            />

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/login")} className="gap-2">
                <LogIn className="h-4 w-4" />
                Login to Your Account
              </Button>

              {pendingEmail && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/verify", { state: pendingEmail })}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Verify Email
                </Button>
              )}

              <Button
                variant="ghost"
                onClick={() => navigate("/contact")}
                className="gap-2"
              >
                <Inbox className="h-4 w-4" />
                Need Help?
              </Button>
            </div>
          </div>

          {/* SUCCESS CARD */}
          <Card className="rounded-lg border border-border/60 shadow-sm">
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <h2 className="text-lg font-semibold">You're All Set!</h2>
              <p className="text-sm text-muted-foreground">
                Start exploring Tainc and manage your leads, jobs, and
                campaigns.
              </p>

              <div className="text-xs text-emerald-600 font-medium">
                Ready to explore
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ================= WHAT YOU CAN DO NOW ================= */}
        <section className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold">What You Can Do Now</h3>
            <p className="text-muted-foreground mt-1">
              Explore the core features available in your workspace
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard
              icon={Users}
              title="Manage Leads"
              desc="Capture and organize your leads"
            />
            <FeatureCard
              icon={Briefcase}
              title="Create Jobs"
              desc="Convert deals into jobs"
            />
            <FeatureCard
              icon={Zap}
              title="Run Campaigns"
              desc="Email & SMS outreach"
            />
            <FeatureCard
              icon={Workflow}
              title="Automations"
              desc="Automate follow-ups"
            />
          </div>
        </section>

        {/* ================= NEXT STEPS ================= */}
        <section>
          <Card className="rounded-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Your Onboarding Roadmap
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Complete these steps to unlock the full potential of Tainc
              </p>
            </CardHeader>

            <CardContent className="relative pt-4">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                <StepCard
                  step="1"
                  icon={ShieldCheck}
                  title="Verify Your Email"
                  desc="Confirm your email address"
                />
                <StepCard
                  step="2"
                  icon={Building2}
                  title="Complete Organization"
                  desc="Add business details"
                />
                <StepCard
                  step="3"
                  icon={Mail}
                  title="Configure Email"
                  desc="Connect email provider"
                />
                <StepCard
                  step="4"
                  icon={Phone}
                  title="Setup Phone"
                  desc="Enable SMS & calling"
                />
                <StepCard
                  step="5"
                  icon={CreditCard}
                  title="Payment Integration"
                  desc="Setup payment gateway"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* ================= SUPPORT ================= */}
        <section>
          <div className="rounded-lg bg-slate-900 text-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-semibold">Need Assistance?</h4>
              <p className="text-sm text-slate-300 mt-1 max-w-lg">
                Our support team is here to help you get started with Tainc.
              </p>
            </div>

            <Button
              variant="default"
              onClick={() => navigate("/contact")}
              className="gap-2"
            >
              <Inbox className="h-4 w-4" />
              Open Support
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

type InfoBoxProps = {
  email?: string;
  text: string;
};

function InfoBox({ email, text }: InfoBoxProps) {
  return (
    <div className="flex gap-3 rounded-lg border bg-blue-50 px-4 py-3">
      <Mail className="text-blue-600 mt-1 h-5 w-5" />
      <div>
        <p className="text-sm text-blue-900">{text}</p>
        {email && <p className="text-xs text-blue-700 mt-1">{email}</p>}
      </div>
    </div>
  );
}

type FeatureCardProps = {
  icon: any;
  title: string;
  desc: string;
};

function FeatureCard({ icon: Icon, title, desc }: FeatureCardProps) {
  return (
    <Card className="hover:shadow-md transition">
      <CardContent className="p-4 text-center">
        <div className="mx-auto h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="mt-3 font-semibold text-sm">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

type StepCardProps = {
  step: string;
  icon: any;
  title: string;
  desc: string;
};

function StepCard({ step, icon: Icon, title, desc }: StepCardProps) {
  const isNotLast = parseInt(step) < 5;
  
  return (
    <div className="relative flex flex-col items-center text-center space-y-2">
      {/* Connector line to next step */}
      {isNotLast && (
        <div className="absolute top-7 left-1/2 w-full h-0.5 bg-border hidden lg:block z-0">
          <div className="h-full bg-border" />
        </div>
      )}
      
      {/* Step circle */}
      <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-md">
        <Icon className="h-5 w-5" />
      </div>

      {/* Step number */}
      <span className="text-xs font-semibold text-muted-foreground">
        Step {step}
      </span>

      {/* Content */}
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px]">
          {desc}
        </p>
      </div>
    </div>
  );
}

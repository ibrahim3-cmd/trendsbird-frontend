import { Button } from "@/components/ui/button";
import PlanCard from "@/components/ui/PlanCard";
import { name } from "@/constants/name";
import { useGetPlansQuery } from "@/redux/features/plan/planApiSlice";
import { Plan } from "@/types/plan.type";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const { data: plans, isLoading } = useGetPlansQuery();

  const handlePlanSelect = (plan: Plan) => {
    // Navigate to register page with selected plan
    navigate("/register", { state: { selectedPlan: plan } });
  };
console.log(plans);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 py-16 ">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
          Welcome to{" "}
          <span className="text-system-primary">{name}</span>
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          A modern platform built to make your life easier. Fast, reliable, and
          designed for your needs.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-system-primary hover:bg-system-primary/90 text-system-primary-text px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            className="px-8 py-4 rounded-full text-lg font-semibold"
            onClick={() => navigate("/about")}
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <div className="text-4xl">⚡</div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            Fast & Reliable
          </h3>
          <p className="mt-2 text-muted-foreground">
            Experience blazing fast performance with modern technology.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <div className="text-4xl">🌍</div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            Accessible Anywhere
          </h3>
          <p className="mt-2 text-muted-foreground">
            Access your account and data securely from any device, anytime.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-lg transition">
          <div className="text-4xl">🔒</div>
          <h3 className="mt-4 text-xl font-semibold text-foreground">
            Secure by Design
          </h3>
          <p className="mt-2 text-muted-foreground">
            Built with industry-leading security to protect your information.
          </p>
        </div>

        {/* <h1>Pay Now</h1> */}

      </section>

      {/* Plans Section */}
      {plans && Array.isArray(plans) && plans?.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Choose Your Plan
              </h2>
              <p className="mt-3 text-base font-semibold text-muted-foreground">
                Select the perfect plan for your organization's needs
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {plans?.map((plan: Plan) => (
                  <div key={plan._id} >
                    <PlanCard
                      onSelect={() => handlePlanSelect(plan)}
                      name={plan.name}
                      description={plan.description}
                      durationUnit={plan.durationUnit}
                      durationValue={plan.durationValue}
                      price={plan.price}
                      features={plan.features}
                      showPremium={plan.name.includes("Professional") || plan.name.includes("Enterprise")}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

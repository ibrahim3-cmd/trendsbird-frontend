import { Button } from "@/components/ui/button";
import { name } from "@/constants/name";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex flex-col items-center justify-center flex-grow text-center px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-foreground">
          Welcome to <span className="text-system-primary">{name}</span>
        </h1>
        <p className="mt-6 text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Admin platform for users, roles, permissions, and catalog management.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            className="bg-system-primary hover:bg-system-primary/90 text-system-primary-text px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
            onClick={() => navigate("/login")}
          >
            Admin Login
          </Button>
        </div>
      </section>
    </div>
  );
}

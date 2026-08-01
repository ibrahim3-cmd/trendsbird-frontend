import { Button } from "@/components/ui/button";
import { Link, NavLink } from "react-router-dom";
import { ModeToggle } from "./ModeToggler";
import { useUserInfoQuery, useLogoutMutation, authApi } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { data } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(data?.data?.id);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");
    dispatch(authApi.util.resetApiState());
    await logout(undefined);
    navigate("/login");
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="text-lg font-semibold">trends bird</div>
        <nav className="flex items-center gap-3">
          <NavLink to="/" className="text-sm hover:text-primary">
            Home
          </NavLink>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-sm hover:text-primary">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}

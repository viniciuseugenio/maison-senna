import NavbarButton from "@components/layout/NavbarButton";
import { Link } from "react-router";

/**
 * `AuthButtons` is a presentational React component that renders
 * authentication-related navigation buttons ("Sign In" and "Register").
 *
 * It is only visible on large screens (`lg:flex`) and remains hidden on smaller viewports.
 * Each button is styled using `NavbarButton` and navigates to the corresponding route
 * (`/login` and `/register`) via React Router.
 *
 */
const AuthButtons: React.FC = () => {
  return (
    <div className="hidden space-x-3 lg:flex">
      <Link to="/login">
        <NavbarButton className="px-4 font-medium">Sign In</NavbarButton>
      </Link>

      <Link to="/register">
        <NavbarButton className="px-4 font-medium">Register</NavbarButton>
      </Link>
    </div>
  );
};

export default AuthButtons;

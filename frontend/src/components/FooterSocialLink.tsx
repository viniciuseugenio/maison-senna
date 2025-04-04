import { Link } from "react-router";

interface FooterSocialLinkProps {
  children: React.ReactNode;
  href: string;
}

export default function FooterSocialLink({
  children,
  href,
}: FooterSocialLinkProps) {
  return (
    <Link
      to={href}
      className="text-light/70 hover:text-light transition-colors"
    >
      {children}
    </Link>
  );
}

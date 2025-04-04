import { Link } from "react-router";

export default function FooterLi({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <li>
      <Link
        to={href}
        className="text-light/70 hover:text-light text-sm transition-colors"
      >
        {label}
      </Link>
    </li>
  );
}

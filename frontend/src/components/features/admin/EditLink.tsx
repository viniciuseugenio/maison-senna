import { LinkComponent, createLink } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

interface BasicEditLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string;
  className?: string;
  ref: React.ForwardedRef<HTMLAnchorElement>;
}

const BasicEditLink: React.FC<BasicEditLinkProps> = ({
  label = "Edit",
  className,
  ref,
  ...props
}) => {
  return (
    <a
      ref={ref}
      {...props}
      className={twMerge(
        "text-oyster/80 hover:text-oyster mr-3 cursor-pointer font-medium duration-300",
        className,
      )}
    >
      {label}
    </a>
  );
};

const CreatedLinkComponent = createLink(BasicEditLink);

const EditLink: LinkComponent<typeof BasicEditLink> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />;
};

export default EditLink;

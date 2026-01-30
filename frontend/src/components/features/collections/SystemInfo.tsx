import HorizontalDivider from "@/components/ui/HorizontalDivider";

type SystemInfoProps = {
  messageCategory: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const SystemInfo: React.FC<SystemInfoProps> = ({
  messageCategory,
  title,
  description,
  children,
}) => {
  return (
    <>
      <p className="text-oyster mb-8 text-center text-xs font-light tracking-[.3em] uppercase">
        {messageCategory}
      </p>
      <header className="mx-auto max-w-3xl pb-16 text-center">
        <h1 className="text-mine-shaft font-serif text-7xl italic">{title}</h1>
        <HorizontalDivider className="mx-auto mt-12" />
        <p className="text-mine-shaft/90 mx-auto mt-12 max-w-lg text-lg leading-relaxed font-light tracking-wide">
          {description}
        </p>
      </header>
      {children}
    </>
  );
};

export default SystemInfo;

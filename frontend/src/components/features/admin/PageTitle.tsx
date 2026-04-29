const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <header>
      <span className="text-oyster/80 mb-2 text-xs tracking-[.3em] uppercase">
        Maison Senna
      </span>
      <h1 className="text-mine-shaft font-serif text-5xl tracking-tight">
        {children}
      </h1>
    </header>
  );
};

export default PageTitle;

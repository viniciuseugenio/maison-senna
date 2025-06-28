const PageTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <h1 className="text-mine-shaft font-serif text-3xl font-light tracking-wider">
      {children}
    </h1>
  );
};

export default PageTitle;

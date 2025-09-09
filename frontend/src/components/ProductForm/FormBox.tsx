const FormBox: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => {
  return (
    <div className="border-oyster/30 rounded-md border bg-white p-6">
      <h2 className="text-mine-shaft mb-6 font-serif text-xl font-light">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default FormBox;

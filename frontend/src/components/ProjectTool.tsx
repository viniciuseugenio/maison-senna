export default function ProjectTool({
  tool,
  area,
}: {
  tool: string;
  area: string;
}) {
  return (
    <div className="text-center">
      <p className="text-oyster font-serif text-xl font-light sm:text-3xl">
        {tool}
      </p>
      <p className="text-mine-shaft/90 mt-2 text-sm">{area}</p>
    </div>
  );
}

export default function SectionLabel({
  n,
  children,
}: {
  n: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span className="num">{n}</span>
      <span className="bar" />
      <span>{children}</span>
    </div>
  );
}

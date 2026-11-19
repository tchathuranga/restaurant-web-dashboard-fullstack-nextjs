// Common page padding and a readable maximum width
const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto">{children}</div>
);

export default PageShell;

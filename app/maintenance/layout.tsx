// Custom layout for maintenance page — no header/footer, just the content
export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

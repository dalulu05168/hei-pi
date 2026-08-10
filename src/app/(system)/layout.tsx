import { SystemShell } from "@/components";
import { requireServerSession } from "@/services/auth/server-session";

export default async function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireServerSession();

  return <SystemShell>{children}</SystemShell>;
}

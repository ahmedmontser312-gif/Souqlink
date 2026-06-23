"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Store,
  Package,
  Image,
  Megaphone,
  Users,
} from "lucide-react";

const sidebarItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/merchants", label: "Merchants", icon: Users },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/slider", label: "Hero Slider", icon: Image },
  { href: "/admin/ads", label: "Ads", icon: Megaphone },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r hidden lg:block">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="space-y-1 px-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}

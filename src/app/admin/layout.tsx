"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { LogOut, LayoutDashboard, FolderKanban, Award, FileText } from "lucide-react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      
      const isLogin = pathname?.startsWith("/admin/login");

      if (!user && !isLogin) {
        router.push("/admin/login");
      } else if (user && isLogin) {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
     return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white z-[9999] relative">
            <span className="text-xl">Loading Auth...</span>
        </div>
     );
  }

  // Debugging output if invisible
  // console.log("AdminLayout Render:", { user: !!user, pathname });

  // Relaxed check for login page
  const isLoginPage = pathname?.startsWith("/admin/login");

  if (!user && !isLoginPage) {
      // Instead of returning null effectively "blanking" the screen, let's show a redirecting message or basic layout
      // return null; 
      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-slate-500">
             Redirecting to login...
        </div>
      );
  }

  if (isLoginPage) {
      return (
        <div className="relative z-0">
            <div className="fixed inset-0 z-0 ambient-bg">
                <div className="mesh-blob mesh-blob-1" />
                <div className="mesh-blob mesh-blob-2" />
                <div className="mesh-blob mesh-blob-3" />
                <div className="mesh-blob mesh-blob-4" />
                <div className="noise-overlay" />
            </div>
            {/* Wrapper for Login Page */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
      );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Accomplishments", href: "/admin/accomplishments", icon: Award },
    { label: "Resume", href: "/admin/resume", icon: FileText },
  ];

  return (
    <div className="portfolio-container">
       <div className="ambient-bg">
         <div className="mesh-blob mesh-blob-1" />
         <div className="mesh-blob mesh-blob-2" />
         <div className="mesh-blob mesh-blob-3" />
         <div className="mesh-blob mesh-blob-4" />
         <div className="noise-overlay" />
       </div>
       
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
            <div className="nav-brand">
                <Link href="/admin" className="brand-name">
                    Admin Portal
                </Link>
            </div>

            <div className="nav-menu">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === "/admin" 
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-item ${isActive ? "active" : ""}`}
                        >
                            <Icon size={18} />
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    );
                })}

                {/* Sign Out Button Moved Here */}
                <button 
                    onClick={() => auth.signOut()}
                    className="nav-item text-red-500 hover:bg-red-500/10 hover:text-red-400"
                    title="Sign Out"
                >
                    <LogOut size={18} />
                    <span className="nav-label">Sign Out</span>
                </button>
            </div>
            
            {/* Nav Actions removed as button is moved */}
        </div>
      </nav>

      <main style={{ paddingTop: "120px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

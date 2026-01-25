"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import { FolderKanban, Award, FileText, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    accomplishments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const projectsSnap = await getDocs(collection(db, "projects"));
        const accSnap = await getDocs(collection(db, "accomplishments"));
        
        setStats({
          projects: projectsSnap.size,
          accomplishments: accSnap.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <section className="section">
      <div className="container flex flex-col items-center"> {/* Added flex col items-center for full centering */}
        
        <div className="section-header text-center">
            <h2 className="section-title">Admin Dashboard</h2>
            <div className="section-line mx-auto"></div> {/* Ensure line is centered */}
            <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto text-center">
                Manage your portfolio content, projects, and personal details from a single central hub.
            </p>
        </div>

        <div className="education-cards w-full max-w-4xl mx-auto">
            
            <Link href="/admin/projects" className="education-card group block hover:no-underline">
                <div className="education-image flex items-center justify-center bg-sky-500/10 border border-sky-500/20 group-hover:bg-sky-500/20 transition-colors" style={{ width: "150px", height: "150px" }}>
                    <FolderKanban size={48} className="text-sky-400" />
                </div>
                <div className="education-content flex flex-col justify-center">
                    <h3 className="education-degree text-2xl group-hover:text-sky-400 transition-colors">Projects</h3>
                    <h4 className="education-institution text-lg">
                        {loading ? "Loading..." : `${stats.projects} Total Projects`}
                    </h4>
                    <p className="education-description mt-2">
                        Add, edit, or remove projects from your portfolio. Showcase your latest work and technical achievements.
                    </p>
                    <div className="mt-4 flex items-center text-sky-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                        Manage Projects <ChevronRight size={16} className="ml-1" />
                    </div>
                </div>
            </Link>

            <Link href="/admin/accomplishments" className="education-card group block hover:no-underline">
                <div className="education-image flex items-center justify-center bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors" style={{ width: "150px", height: "150px" }}>
                    <Award size={48} className="text-indigo-400" />
                </div>
                <div className="education-content flex flex-col justify-center">
                    <h3 className="education-degree text-2xl group-hover:text-indigo-400 transition-colors">Accomplishments</h3>
                    <h4 className="education-institution text-lg">
                         {loading ? "Loading..." : `${stats.accomplishments} Awards & Certifications`}
                    </h4>
                    <p className="education-description mt-2">
                        Highlight your awards, hackathon wins, and certifications. Keep your professional milestones up to date.
                    </p>
                    <div className="mt-4 flex items-center text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                        Manage Accomplishments <ChevronRight size={16} className="ml-1" />
                    </div>
                </div>
            </Link>

            <Link href="/admin/resume" className="education-card group block hover:no-underline">
                <div className="education-image flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors" style={{ width: "150px", height: "150px" }}>
                    <FileText size={48} className="text-emerald-400" />
                </div>
                <div className="education-content flex flex-col justify-center">
                    <h3 className="education-degree text-2xl group-hover:text-emerald-400 transition-colors">Resume Configuration</h3>
                    <h4 className="education-institution text-lg">
                        PDF Link Settings
                    </h4>
                    <p className="education-description mt-2">
                        Update the link to your latest resume PDF. Ensure visitors always have access to your most current CV.
                    </p>
                    <div className="mt-4 flex items-center text-emerald-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 transition-transform">
                        Update Settings <ChevronRight size={16} className="ml-1" />
                    </div>
                </div>
            </Link>

        </div>
      </div>
    </section>
  );
}

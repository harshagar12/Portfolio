"use client";

import ProjectForm from "../_components/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/projects"
          className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-white">Add New Project</h2>
      </div>

      <ProjectForm />
    </div>
  );
}

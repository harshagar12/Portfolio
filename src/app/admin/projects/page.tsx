"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminButton, AdminInput, AdminTextarea, AdminCard } from "../components/AdminUI";
import { Plus, Trash2, Edit2, X, Save, ExternalLink, Upload, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null); 
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    category: "Web App",
    tech: "", 
  });

  const categories = ["Web App", "AI/ML", "IoT", "Chrome Extension"];

  const fetchProjects = async () => {
    try {
      // 1. Fetch ALL documents (handling missing 'order' fields)
      const querySnapshot = await getDocs(collection(db, "projects"));
      let projectsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // 2. Check for missing 'order' fields and migrate if necessary
      const missingOrder = projectsList.filter(p => typeof p.order !== 'number');
      
      if (missingOrder.length > 0) {
        console.log("Migrating missing order fields...");
        // Sort effectively by creation time or ID to give initial order
        projectsList.sort((a, b) => a.title.localeCompare(b.title)); 
        
        await Promise.all(projectsList.map(async (project, index) => {
          if (typeof project.order !== 'number') {
            await updateDoc(doc(db, "projects", project.id), { order: index });
            project.order = index; // Update local state
          }
        }));
      }

      // 3. Sort by order
      projectsList.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setProjects(projectsList);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: any) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      link: project.link,
      category: project.category || "Web App",
      tech: project.tech ? project.tech.join(", ") : "",
    });
    setImagePreview(project.image || "");
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    // 1. Create shallow copy and swap items in the array
    const newProjects = [...projects];
    [newProjects[index - 1], newProjects[index]] = [newProjects[index], newProjects[index - 1]];
    
    // 2. Re-assign order based on new array index to ensure sequence 0, 1, 2...
    const updatedProjects = newProjects.map((project, idx) => ({
      ...project,
      order: idx
    }));

    // 3. Optimistic update
    setProjects(updatedProjects);

    // 4. Batch update Firestore to save new orders
    try {
      await Promise.all(updatedProjects.map(project => 
        updateDoc(doc(db, "projects", project.id), { order: project.order })
      ));
    } catch (error) {
      console.error("Error reordering projects:", error);
      fetchProjects(); // Revert on error
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === projects.length - 1) return;

    // 1. Create shallow copy and swap items
    const newProjects = [...projects];
    [newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]];

    // 2. Re-assign order based on new array index
    const updatedProjects = newProjects.map((project, idx) => ({
      ...project,
      order: idx
    }));

    // 3. Optimistic update
    setProjects(updatedProjects);

    // 4. Batch update Firestore
    try {
      await Promise.all(updatedProjects.map(project => 
        updateDoc(doc(db, "projects", project.id), { order: project.order })
      ));
    } catch (error) {
      console.error("Error reordering projects:", error);
      fetchProjects(); 
    }
  };

  const handleAddNew = () => {
    setCurrentProject(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      link: "",
      category: "Web App",
      tech: "",
    });
    setImagePreview("");
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card clicks if any
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = formData.image;

      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        link: formData.link,
        category: formData.category,
        tech: formData.tech.split(",").map((t) => t.trim()).filter((t) => t),
        order: currentProject ? currentProject.order : (projects.length > 0 ? Math.max(...projects.map(p => p.order || 0)) + 1 : 0),
      };

      if (currentProject) {
        await updateDoc(doc(db, "projects", currentProject.id), projectData);
      } else {
        await addDoc(collection(db, "projects"), projectData);
      }
      await fetchProjects();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
            <h2 className="section-title">Manage Projects</h2>
            <div className="flex items-center gap-4">
              <div className="section-line"></div>
              {!isEditing && (
                <button onClick={handleAddNew} className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
                  <Plus size={20} /> Add New Project
                </button>
              )}
            </div>
        </div>

        {isEditing && (
            <div className="flex items-center justify-center min-h-[calc(100vh-200px)]" style={{ marginBottom: '80px' }}>
                <div className="max-w-3xl w-full mx-auto">
                <div 
                    className="rounded-3xl shadow-2xl backdrop-blur-sm"
                    style={{
                        background: 'rgb(23, 23, 23)',
                        border: '1px solid rgba(71, 85, 105, 0.3)',
                        padding: '2.5rem'
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                            {currentProject ? "Edit Project" : "New Project"}
                        </h3>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                
                    <form onSubmit={handleSubmit}>
                        {/* Title and Category Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
                            <div>
                                <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                                    style={{ paddingLeft: '8px', paddingRight: '16px' }}
                                    placeholder="Enter project title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all appearance-none cursor-pointer"
                                        style={{ paddingLeft: '8px', paddingRight: '40px' }}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400 min-h-[120px] resize-y"
                                style={{ paddingLeft: '8px', paddingRight: '16px' }}
                                placeholder="Enter project description"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                Project Image
                            </label>
                            <div 
                                className="relative h-48 w-full border-2 border-dashed border-slate-600/50 rounded-lg flex items-center justify-center cursor-pointer transition-colors overflow-hidden hover:border-sky-400/50"
                                style={{ background: 'rgba(30, 41, 59, 0.2)' }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {imagePreview ? (
                                    <>
                                        <Image 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            fill 
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium">Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload size={32} className="mb-2 text-slate-400" />
                                        <p className="text-sm text-slate-400">Click to upload image</p>
                                    </div>
                                )}
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Link */}
                        <div style={{ marginBottom: '24px' }}>
                            <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                Link
                            </label>
                            <input
                                type="text"
                                value={formData.link}
                                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                                style={{ paddingLeft: '8px', paddingRight: '16px' }}
                                placeholder="https://example.com"
                            />
                        </div>

                        {/* Technologies */}
                        <div style={{ marginBottom: '32px' }}>
                            <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                Technologies (comma separated)
                            </label>
                            <input
                                type="text"
                                value={formData.tech}
                                onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
                                className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                                style={{ paddingLeft: '8px', paddingRight: '16px' }}
                                placeholder="React, Firebase, TypeScript..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 border-t border-slate-700/50" style={{ paddingTop: '20px' }}>
                            <button 
                                type="button" 
                                onClick={() => setIsEditing(false)} 
                                className="px-6 py-2.5 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-700/30"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={saving} 
                                className="btn btn-primary"
                            >
                                {saving ? "Saving..." : "Save Project"}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        )}

        <div className="projects-grid">
            {projects.map((project, index) => (
                <div key={index} className="project-card group">
                    <div className="project-image">
                        <Image
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            width={300}
                            height={200}
                            className="project-img"
                        />
                        <div className="project-overlay flex-col gap-4">
                             {/* Move Up/Down Buttons */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleMoveUp(index)}
                                    disabled={index === 0}
                                    className="p-3 bg-slate-700/50 rounded-full text-white hover:bg-slate-600 transition-colors shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move Up"
                                >
                                    <ArrowUp size={20} />
                                </button>
                                <button 
                                    onClick={() => handleMoveDown(index)}
                                    disabled={index === projects.length - 1}
                                    className="p-3 bg-slate-700/50 rounded-full text-white hover:bg-slate-600 transition-colors shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move Down"
                                >
                                    <ArrowDown size={20} />
                                </button>
                            </div>
                             {/* Admin Actions Overlay */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleEdit(project)}
                                    className="p-3 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors shadow-lg"
                                    title="Edit"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(project.id, e)}
                                    className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                                    title="Delete"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="project-content">
                        <h3 className="project-title">{project.title}</h3>
                        <p className="project-description line-clamp-3">{project.description}</p>
                        <div className="project-tech">
                             {project.tech?.map((tech: string) => (
                                <span key={tech} className="tech-tag">{tech}</span>
                             ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}

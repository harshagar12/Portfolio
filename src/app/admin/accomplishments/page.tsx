"use client";

import { useState, useEffect, useRef } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdminButton, AdminInput, AdminTextarea, AdminCard } from "../components/AdminUI";
import { Plus, Trash2, Edit2, X, Save, Upload, ArrowUp, ArrowDown } from "lucide-react";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminAccomplishments() {
  const [accomplishments, setAccomplishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    year: "",
  });

  const fetchAccomplishments = async () => {
    try {
      // 1. Fetch ALL documents (handling missing 'order' fields)
      const querySnapshot = await getDocs(collection(db, "accomplishments"));
      let list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // 2. Check for missing 'order' fields and migrate if necessary
      const missingOrder = list.filter(item => typeof item.order !== 'number');
      
      if (missingOrder.length > 0) {
        console.log("Migrating missing order fields...");
        list.sort((a, b) => a.title.localeCompare(b.title));
        
        await Promise.all(list.map(async (item, index) => {
          if (typeof item.order !== 'number') {
            await updateDoc(doc(db, "accomplishments", item.id), { order: index });
            item.order = index; // Update local state
          }
        }));
      }

      // 3. Sort by order
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setAccomplishments(list);
    } catch (error) {
      console.error("Error fetching accomplishments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccomplishments();
  }, []);

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      image: item.image,
      year: item.year,
    });
    setImagePreview(item.image || "");
    setImageFile(null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    
    // Swap in array
    const newList = [...accomplishments];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    
    // Re-index
    const updatedList = newList.map((item, idx) => ({
      ...item,
      order: idx
    }));

    setAccomplishments(updatedList);

    try {
      await Promise.all(updatedList.map(item => 
        updateDoc(doc(db, "accomplishments", item.id), { order: item.order })
      ));
    } catch (error) {
      console.error("Error moving accomplishment up:", error);
      fetchAccomplishments();
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === accomplishments.length - 1) return;

    // Swap in array
    const newList = [...accomplishments];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];

    // Re-index
    const updatedList = newList.map((item, idx) => ({
      ...item,
      order: idx
    }));

    setAccomplishments(updatedList);

    try {
      await Promise.all(updatedList.map(item => 
        updateDoc(doc(db, "accomplishments", item.id), { order: item.order })
      ));
    } catch (error) {
      console.error("Error moving accomplishment down:", error);
      fetchAccomplishments();
    }
  };

  const handleAddNew = () => {
    setCurrentItem(null);
    setFormData({
      title: "",
      description: "",
      image: "",
      year: "",
    });
    setImagePreview("");
    setImageFile(null);
    setIsEditing(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this accomplishment?")) {
      try {
        await deleteDoc(doc(db, "accomplishments", id));
        setAccomplishments(accomplishments.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error deleting accomplishment:", error);
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

      const data = {
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        year: formData.year,
        order: currentItem ? currentItem.order : (accomplishments.length > 0 ? Math.max(...accomplishments.map(a => a.order || 0)) + 1 : 0),
      };

      if (currentItem) {
        await updateDoc(doc(db, "accomplishments", currentItem.id), data);
      } else {
        await addDoc(collection(db, "accomplishments"), data);
      }
      await fetchAccomplishments();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving accomplishment:", error);
      alert("Failed to save accomplishment. Please try again.");
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
            <h2 className="section-title">Manage Accomplishments</h2>
            <div className="flex items-center gap-4">
              <div className="section-line"></div>
              {!isEditing && (
                <button onClick={handleAddNew} className="btn btn-primary flex items-center gap-2 whitespace-nowrap">
                  <Plus size={20} /> Add New
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
                            {currentItem ? "Edit Accomplishment" : "New Accomplishment"}
                        </h3>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Title and Year Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginBottom: '24px' }}>
                            <div>
                                <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                                    style={{ paddingLeft: '8px', paddingRight: '16px' }}
                                    placeholder="Enter accomplishment title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                    Year
                                </label>
                                <input
                                    type="text"
                                    value={formData.year}
                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                    className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                                    style={{ paddingLeft: '8px', paddingRight: '16px' }}
                                    placeholder="2024"
                                />
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
                                placeholder="Enter accomplishment description"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <div style={{ marginBottom: '32px' }}>
                            <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                                Accomplishment Image
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
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        )}

        {/* Note: I'll use a modified approach here. Since there is no 'accomplishments-grid' in global CSS (it wasn't in provided snippet), I'll use the 'projects-grid' which is a standard grid, and style the cards to look like 'project-card' but maybe slightly adapted if needed. Actually, judging by CSS, '.education-card' exists, maybe I should use that layout if it fits. But 'project-card' is generic enough. */}
        <div className="projects-grid">
             {accomplishments.map((item, index) => (
                 <div key={index} className="project-card group">
                     {/* Reuse project-card styling for consistency */}
                     <div className="project-image relative">
                         <Image 
                            src={item.image || "/placeholder.svg"} 
                            alt={item.title} 
                            fill 
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
                                    disabled={index === accomplishments.length - 1}
                                    className="p-3 bg-slate-700/50 rounded-full text-white hover:bg-slate-600 transition-colors shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Move Down"
                                >
                                    <ArrowDown size={20} />
                                </button>
                            </div>
                             <div className="flex gap-4">
                                <button 
                                    onClick={() => handleEdit(item)}
                                    className="p-3 bg-indigo-500 rounded-full text-white hover:bg-indigo-600 transition-colors shadow-lg"
                                >
                                    <Edit2 size={20} />
                                </button>
                                <button 
                                    onClick={(e) => handleDelete(item.id, e)}
                                    className="p-3 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <Trash2 size={20} />
                                </button>
                             </div>
                         </div>
                     </div>
                     <div className="project-content">
                         <h3 className="project-title">{item.title}</h3>
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-xs text-sky-400 border border-sky-400/30 px-2 py-0.5 rounded-full">{item.year}</span>
                         </div>
                         <p className="project-description">{item.description}</p>
                     </div>
                 </div>
             ))}
        </div>

      </div>
    </section>
  );
}

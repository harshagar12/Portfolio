"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Upload, Loader2 } from "lucide-react";
import Image from "next/image";

interface AccomplishmentFormProps {
  initialData?: any;
  isid?: string;
}

export default function AccomplishmentForm({ initialData, isid }: AccomplishmentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    year: initialData?.year || new Date().getFullYear().toString(),
    image: initialData?.image || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(formData.image);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const data = {
        title: formData.title,
        description: formData.description,
        year: formData.year,
        image: imageUrl,
        updatedAt: new Date(),
      };

      if (isid) {
        // Update
        await updateDoc(doc(db, "accomplishments", isid), data);
      } else {
        // Create
        await addDoc(collection(db, "accomplishments"), {
          ...data,
          createdAt: new Date(),
        });
      }

      router.push("/admin/accomplishments");
      router.refresh();
    } catch (error) {
      console.error("Error saving accomplishment:", error);
      alert("Failed to save. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image */}
        <div className="space-y-4">
          <label className="block text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Accomplishment Image</label>
          <div 
            className="relative h-64 w-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden hover:border-teal-500/50"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
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
              <div className="text-center p-6">
                <Upload size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Click to upload image</p>
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

        {/* Right Column - Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Year</label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({...formData, year: e.target.value})}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={4}
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
          style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 transition-colors hover:text-white"
          style={{ color: 'var(--text-muted)' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="text-white px-8 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-500/20"
          style={{ background: 'var(--accent-tertiary)' }}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isid ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}

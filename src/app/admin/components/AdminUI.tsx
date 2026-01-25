"use client";

import React from "react";
import { Loader2 } from "lucide-react";

// --- Input Component ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const AdminInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full bg-slate-900/50 border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 
          focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all 
          placeholder:text-slate-600 ${error ? "border-red-500/50 focus:ring-red-500/50" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
AdminInput.displayName = "AdminInput";

// --- Textarea Component ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const AdminTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-slate-900/50 border border-slate-800 text-slate-100 rounded-lg px-4 py-2.5 
          focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all 
          placeholder:text-slate-600 min-h-[100px] ${error ? "border-red-500/50 focus:ring-red-500/50" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
AdminTextarea.displayName = "AdminTextarea";

// --- Button Component ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  isLoading?: boolean;
  icon?: React.ElementType;
}

export const AdminButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", isLoading, icon: Icon, className = "", disabled, ...props }, ref) => {
    
    // Base styles tailored to match the 'btn' class but specific for admin needs
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white shadow-lg shadow-sky-900/20",
      secondary: "bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700",
      danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
      ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    };

    const sizes = "px-4 py-2 text-sm";

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && Icon && <Icon className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);
AdminButton.displayName = "AdminButton";

// --- Card Component ---
export const AdminCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
};

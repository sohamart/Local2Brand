import React from 'react';

export function GlassCard({
  children,
  className = "",
  hoverEffect = true,
  padding = "p-6 sm:p-8",
  ...props
}) {
  return (
    <div
      className={`rounded-card ${
        hoverEffect ? 'glass-card' : 'glass-panel'
      } ${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function GlassButton({
  children,
  variant = "primary", // primary, secondary, outline, whatsapp
  size = "md", // sm, md, lg
  className = "",
  onClick,
  type = "button",
  disabled = false,
  ...props
}) {
  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs rounded-btn gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-btn gap-2 font-semibold",
    lg: "px-7 py-3.5 text-base rounded-btn gap-2.5 font-bold"
  }[size] || "px-5 py-2.5 text-sm rounded-btn gap-2 font-semibold";

  const variantClasses = {
    primary: "glass-button-primary inline-flex items-center justify-center cursor-pointer",
    secondary: "glass-button-secondary inline-flex items-center justify-center cursor-pointer",
    outline: "bg-transparent text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 inline-flex items-center justify-center cursor-pointer transition-all",
    whatsapp: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 inline-flex items-center justify-center cursor-pointer transition-all"
  }[variant] || "glass-button-primary inline-flex items-center justify-center cursor-pointer";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${sizeClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SEO({ title, description }) {
  React.useEffect(() => {
    if (title) {
      document.title = `${title} | LOCAL2BRAND — Build Local. Think Global.`;
    }
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
}

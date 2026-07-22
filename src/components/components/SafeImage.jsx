import { useState } from "react";
import { Film } from "lucide-react";

export default function SafeImage({ src, alt, className, ...props }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div
        className={`bg-zinc-900 flex items-center justify-center ${className || ""}`}
        {...props}
      >
        <Film size={24} className="text-zinc-700" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      {...props}
    />
  );
}

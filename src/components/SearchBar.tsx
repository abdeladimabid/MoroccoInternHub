"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="search-wrapper">
      <Search size={18} strokeWidth={2} />
      <input
        ref={inputRef}
        id="search-input"
        type="search"
        className="search-input"
        placeholder='Rechercher un poste, entreprise...'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Rechercher des offres"
      />
    </div>
  );
}

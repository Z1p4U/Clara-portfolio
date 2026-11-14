"use client";

import { useState } from "react";

export function ThemeToggle() {
  const [night, setNight] = useState(false);

  function toggleTheme() {
    const nextTheme = !night;
    setNight(nextTheme);
    document.documentElement.dataset.theme = nextTheme ? "night" : "day";
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={night ? "Switch to light theme" : "Switch to night theme"}
      title={night ? "Switch to light theme" : "Switch to night theme"}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {night ? (
          <path d="M20.2 15.3A8.7 8.7 0 0 1 8.7 3.8 8.8 8.8 0 1 0 20.2 15.3Z" />
        ) : (
          <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>
        )}
      </svg>
    </button>
  );
}

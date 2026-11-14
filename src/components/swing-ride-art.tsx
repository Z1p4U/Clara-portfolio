import type { CSSProperties } from "react";

export function SwingRideArt() {
  const seats = [
    { x: 75, top: 228, tilt: -18, delay: "0s" },
    { x: 136, top: 267, tilt: -12, delay: "0.2s" },
    { x: 204, top: 289, tilt: -6, delay: "0.4s" },
    { x: 300, top: 302, tilt: 0, delay: "0.6s" },
    { x: 396, top: 289, tilt: 6, delay: "0.8s" },
    { x: 464, top: 267, tilt: 12, delay: "1s" },
    { x: 525, top: 228, tilt: 18, delay: "1.2s" },
  ];

  return (
    <div className="ride-art" aria-hidden="true">
      <svg viewBox="0 0 600 500" role="presentation">
        <defs>
          <linearGradient id="ride-canopy" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2a1242" />
            <stop offset="0.5" stopColor="#603887" />
            <stop offset="1" stopColor="#2a1242" />
          </linearGradient>
          <linearGradient id="ride-pole" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#31164b" />
            <stop offset="0.5" stopColor="#7949a2" />
            <stop offset="1" stopColor="#31164b" />
          </linearGradient>
          <radialGradient id="ride-glow">
            <stop offset="0" stopColor="#f0c86a" stopOpacity="0.26" />
            <stop offset="1" stopColor="#f0c86a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="300" cy="270" rx="282" ry="218" fill="url(#ride-glow)" />
        <g className="ride-spark ride-spark-a" fill="#f0c86a">
          <path d="M78 115c3 11 7 15 18 18-11 3-15 7-18 18-3-11-7-15-18-18 11-3 15-7 18-18Z" />
        </g>
        <g className="ride-spark ride-spark-b" fill="#f0c86a">
          <path d="M512 104c2 8 5 11 13 13-8 2-11 5-13 13-2-8-5-11-13-13 8-2 11-5 13-13Z" />
        </g>
        <g className="ride-spark ride-spark-c" fill="#f0c86a">
          <path d="M474 372c2 7 5 10 12 12-7 2-10 5-12 12-2-7-5-10-12-12 7-2 10-5 12-12Z" />
        </g>
        <path d="M300 46v-14" stroke="#f0c86a" strokeWidth="3" />
        <circle cx="300" cy="27" r="7" fill="#f0c86a" />
        <circle cx="300" cy="27" r="17" fill="#f0c86a" opacity=".16" />
        <path d="M300 46C257 76 181 128 127 190c94 42 252 42 346 0C419 128 343 76 300 46Z" fill="url(#ride-canopy)" stroke="#f0c86a" strokeWidth="3" />
        <path d="M300 46 178 199M300 46 239 211M300 46v169M300 46l61 165M300 46l122 153" stroke="#f0c86a" strokeOpacity=".76" strokeWidth="2" />
        <path d="M139 195c73 39 249 39 322 0" fill="none" stroke="#f0c86a" strokeWidth="5" />
        <path d="M144 204c74 36 238 36 312 0v17c-77 37-235 37-312 0Z" fill="#472367" stroke="#f0c86a" strokeWidth="2" />
        <path d="M275 225h50l15 205h-80Z" fill="url(#ride-pole)" stroke="#f0c86a" strokeWidth="2" />
        <path d="M281 287h38m-42 72h46" stroke="#f0c86a" strokeWidth="2" opacity=".72" />
        {seats.map((seat) => (
          <g className="ride-seat" key={seat.x} style={{ "--seat-delay": seat.delay } as CSSProperties}>
            <path d={`M300 188 Q ${seat.x} ${seat.top - 54} ${seat.x} ${seat.top}`} fill="none" stroke="#f0c86a" strokeWidth="1.6" opacity=".82" />
            <path d={`M300 188 Q ${seat.x + seat.tilt * 0.7} ${seat.top - 54} ${seat.x + seat.tilt} ${seat.top}`} fill="none" stroke="#f0c86a" strokeWidth="1.6" opacity=".55" />
            <g transform={`translate(${seat.x} ${seat.top}) rotate(${seat.tilt})`}>
              <path d="M-17 0h34v21c0 4-3 7-7 7h-20c-4 0-7-3-7-7Z" fill="#32174b" stroke="#f0c86a" strokeWidth="2" />
              <path d="M-12 21h24v5h-24Z" fill="#e2b95f" />
              <circle cx="0" cy="9" r="3" fill="#f6d981" />
            </g>
          </g>
        ))}
        <path d="M119 431a181 38 0 0 0 362 0" fill="#2a1242" stroke="#f0c86a" strokeWidth="3" />
        <ellipse cx="300" cy="431" rx="181" ry="38" fill="#472367" stroke="#f0c86a" strokeWidth="3" />
        <ellipse cx="300" cy="431" rx="143" ry="27" fill="none" stroke="#f0c86a" strokeOpacity=".56" strokeWidth="2" />
        <path d="M300 431v-90" stroke="#f0c86a" strokeWidth="2" opacity=".4" />
        {Array.from({ length: 16 }, (_, index) => {
          const angle = (Math.PI * 2 * index) / 16;
          const x = 300 + 174 * Math.cos(angle);
          const y = 431 + 34 * Math.sin(angle);
          return <circle className="ride-bulb" key={index} cx={x} cy={y} r="4" style={{ "--seat-delay": `${index * 90}ms` } as CSSProperties} />;
        })}
      </svg>
    </div>
  );
}

export default function KyroLogo({ size = 28, animated = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#4f46e5" />
        </radialGradient>
      </defs>

      {/* Outer orbit ring */}
      <ellipse
        cx="22" cy="22" rx="20" ry="8"
        stroke="rgba(99,102,241,0.4)"
        strokeWidth="1"
        transform="rotate(30 22 22)"
        style={animated ? { animation: 'orbitSpin1 8s linear infinite', transformOrigin: '22px 22px' } : {}}
      />

      {/* Inner orbit ring */}
      <ellipse
        cx="22" cy="22" rx="20" ry="8"
        stroke="rgba(99,102,241,0.25)"
        strokeWidth="1"
        transform="rotate(-30 22 22)"
        style={animated ? { animation: 'orbitSpin2 12s linear infinite', transformOrigin: '22px 22px' } : {}}
      />

      {/* Core planet */}
      <circle cx="22" cy="22" r="5" fill="url(#core)" />

      {/* Orbiting dot 1 */}
      <circle
        cx="38" cy="17" r="3"
        fill="#a5b4fc"
        style={animated ? { animation: 'orbitDot1 8s linear infinite', transformOrigin: '22px 22px' } : {}}
      />

      {/* Orbiting dot 2 */}
      <circle
        cx="10" cy="32" r="2"
        fill="#818cf8"
        opacity="0.7"
        style={animated ? { animation: 'orbitDot2 12s linear infinite', transformOrigin: '22px 22px' } : {}}
      />

      <style>{`
        @keyframes orbitSpin1 {
          from { transform: rotate(30deg); }
          to   { transform: rotate(390deg); }
        }
        @keyframes orbitSpin2 {
          from { transform: rotate(-30deg); }
          to   { transform: rotate(-390deg); }
        }
        @keyframes orbitDot1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes orbitDot2 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
      `}</style>
    </svg>
  );
}
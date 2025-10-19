import { useEffect, useState } from "react";

export default function PawCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 z-50 pointer-events-none"
        style={{
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      >
        <img
          src="src/assets/paw.png"
          alt="paw"
          className="w-5 h-5"
          style={{ transform: "translate(-50%, -50%)" }}
        />
      </div>
    </>
  );
}

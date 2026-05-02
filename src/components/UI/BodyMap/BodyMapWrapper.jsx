import { useState, useEffect } from "react";
import BodyMap, { bodyFront, bodyBack, bodyFemaleFront, bodyFemaleBack } from "./BodyMap";
import './BodyMap.module.scss'
const MUSCULOS = {
  chest: "Pecho", deltoids: "Hombros", biceps: "Bíceps", triceps: "Tríceps",
  forearm: "Antebrazos", abs: "Abdomen", obliques: "Oblicuos", quadriceps: "Cuádriceps",
  calves: "Gemelos", trapezius: "Trapecios", "upper-back": "Espalda alta",
  "lower-back": "Lumbar", gluteal: "Glúteos", hamstring: "Isquiotibiales",
  adductors: "Aductores", knees: "Rodillas", tibialis: "Tibial", neck: "Cuello",
};

// Nivel 1=verde → 5=rojo
const COLORES_FATIGA = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#eab308",
  4: "#f97316",
  5: "#ef4444",
};

export default function BodyMapWrapper({ genero = "male" }) {
  // { slug: nivel } ej: { chest: 3, abs: 1 }
  const [fatiga, setFatiga] = useState({});

  useEffect(() => {
    setFatiga({});
  }, [genero]);

  const frente = genero === "male" ? bodyFront : bodyFemaleFront;
  const trasero = genero === "male" ? bodyBack : bodyFemaleBack;

  const slugsSeleccionados = Object.keys(fatiga);

  const handleToggle = (slugs) => {
    // slugs es el nuevo array de seleccionados que devuelve BodyMap
    setFatiga((prev) => {
      const nuevo = {};
      slugs.forEach((s) => {
        nuevo[s] = prev[s] ?? 1; // si es nuevo, empieza en 1
      });
      return nuevo;
    });
  };

  const handleNivel = (slug, nivel) => {
    setFatiga((prev) => ({ ...prev, [slug]: nivel }));
  };

  const handleQuitar = (slug) => {
    setFatiga((prev) => {
      const nuevo = { ...prev };
      delete nuevo[slug];
      return nuevo;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <BodyMap
        genero={genero}
        seleccionados={slugsSeleccionados}
        onChange={handleToggle}
        bodyFront={frente}
        bodyBack={trasero}
        scale={1}
        border="#dfdfdf"
        coloresFatiga={
          Object.fromEntries(
            Object.entries(fatiga).map(([slug, nivel]) => [slug, COLORES_FATIGA[nivel]])
          )
        }
      />

      {/* Filas de fatiga */}
      {slugsSeleccionados.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", maxWidth: 420 }}>
          {slugsSeleccionados.map((slug) => (
            <div
              key={slug}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 12px",
                borderRadius: 10,
                background: "#f9fafb",
                border: "1.5px solid #e5e7eb",
              }}
            >
              {/* Pastilla de color */}
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: COLORES_FATIGA[fatiga[slug]],
                flexShrink: 0,
              }} />

              {/* Nombre */}
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "#374151" }}>
                {MUSCULOS[slug] ?? slug}
              </span>

              {/* Botones 1-5 */}
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleNivel(slug, n)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      border: fatiga[slug] === n
                        ? `2px solid ${COLORES_FATIGA[n]}`
                        : "1.5px solid #d1d5db",
                      background: fatiga[slug] === n ? COLORES_FATIGA[n] : "#fff",
                      color: fatiga[slug] === n ? "#fff" : "#6b7280",
                      fontWeight: 700,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Quitar */}
              <button
                onClick={() => handleQuitar(slug)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#9ca3af", fontSize: 16, lineHeight: 1, padding: "0 2px",
                }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import BodyMap, { bodyFront, bodyBack, bodyFemaleFront, bodyFemaleBack } from "./BodyMap";
import styles from './BodyMap.module.scss'

const MUSCULOS = {
  chest: "Pecho",
  deltoids: "Hombros",
  biceps: "Bíceps",
  triceps: "Tríceps",
  forearm: "Antebrazos",
  abs: "Abdomen",
  obliques: "Oblicuos",
  quadriceps: "Cuádriceps",
  calves: "Gemelos",
  trapezius: "Trapecios",
  "upper-back": "Espalda alta",
  "lower-back": "Lumbar",
  gluteal: "Glúteos",
  hamstring: "Isquiotibiales",
  adductors: "Aductores",
  knees: "Rodillas",
  tibialis: "Tibial",
  neck: "Cuello",
  ankles: "Tobillos",
  hands: "Manos/Muñecas",
  feet: "Pies",
};

const COLORES_FATIGA = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#eab308",
  4: "#f97316",
  5: "#ef4444",
};

export default function BodyMapWrapper({ genero = "male" }) {
  const [fatiga, setFatiga] = useState({});

  useEffect(() => {
    setFatiga({});
  }, [genero]);

  const frente  = genero === "male" ? bodyFront      : bodyFemaleFront;
  const trasero = genero === "male" ? bodyBack       : bodyFemaleBack;

  const slugsSeleccionados = Object.keys(fatiga);

  const handleToggle = (slugs) => {
    setFatiga((prev) => {
      const nuevo = {};
      slugs.forEach((s) => { nuevo[s] = prev[s] ?? 1; });
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
    <div className={styles.wrapper}>
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

      {slugsSeleccionados.length > 0 ? (
        <div className={styles.fatigaLista}>
          {slugsSeleccionados.map((slug) => (
            <div key={slug} className={styles.fatigaFila}>

              {/* Pastilla de color — inline porque depende del estado */}
              <div
                className={styles.fatigaPastilla}
                style={{ background: COLORES_FATIGA[fatiga[slug]] }}
              />

              <span className={styles.fatigaNombre}>
                {MUSCULOS[slug] ?? slug}
              </span>

              <div className={styles.fatigaBotones}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    className={`${styles.fatigaBtn} ${fatiga[slug] === n ? styles.fatigaBtnActivo : ''}`}
                    onClick={() => handleNivel(slug, n)}
                    /* Solo el color dinámico queda inline */
                    style={fatiga[slug] === n ? {
                      background: COLORES_FATIGA[n],
                      borderColor: COLORES_FATIGA[n],
                    } : undefined}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button className={styles.fatigaQuitar} onClick={() => handleQuitar(slug)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      )
      : (
        <p style={{ textAlign: "center", fontSize: 13, color: "#9ca3af", margin: 0 }}>
          Tocá sobre los músculos que sentís fatigados
        </p>
      )
    }
    </div>
  );
}
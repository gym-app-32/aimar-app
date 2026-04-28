import React from "react";
import styles from "./LogoHypnotiq.module.scss"; // Asegúrate de que la ruta sea correcta
import LogoMini from '../../Logos/LogoMini'

const LogoHypnotiq = ({
  //color = "gold",
  width = "15rem",
 
  duration = "1.2s",
}) => {
  const size = typeof width === "number" ? `${width}px` : width;

  const ringStyle = (scale, speed, reverse = false) => ({
    width: `calc(${size} * ${scale})`,
    height: `calc(${size} * ${scale})`,
    borderTopColor: `#f5c51843`,
    borderRightColor:`#f5c51883`,
    animationDuration: `${parseFloat(duration) * speed}s`,
    animationDirection: reverse ? "reverse" : "normal",
  });

  return (
    <div className={styles.hypnosisContainer} style={{ width: size, height: size }}>
      <div className={styles.ring} style={ringStyle(1, 1)} />
      <div className={styles.ring} style={ringStyle(0.8, 0.875, true)} />
      <div className={styles.ring} style={ringStyle(0.7, 0.75)} />
      <div className={styles.logo}>
        <LogoMini />
      </div>
    </div>
  );
};

export default LogoHypnotiq;
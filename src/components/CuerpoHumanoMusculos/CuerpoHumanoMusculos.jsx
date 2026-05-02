import React, { useCallback } from "react";

// Importación de assets y componentes
import { bodyFront, bodyBack } from './bodyMen';
import { bodyFemaleFront, bodyFemaleBack  } from "./bodyFemale";

import { SvgMaleWrapper, SvgFemaleWrapper } from "./SvgWrapper";

/**
 * Componente CuerpoHumanoMusculos (Conversión a JSX)
 */
const CuerpoHumanoMusculos = ({
  colors = ["#0984e3", "#74b9ff"],
  data = [],
  scale = 1,
  side = "front",
  gender = "male",
  onBodyPartPress,
  border = "#dfdfdf",
  disabledParts = [],
  hiddenParts = [],
  defaultFill = "#3f3f3f",
  defaultStroke = "none",
  defaultStrokeWidth = 0
}) => {
  
  // Define los estilos de cada parte del cuerpo
  const getPartStyles = useCallback(
    (bodyPart) => {
      return {
        fill: bodyPart.styles?.fill ?? defaultFill,
        stroke: bodyPart.styles?.stroke ?? defaultStroke,
        strokeWidth: bodyPart.styles?.strokeWidth ?? defaultStrokeWidth,
      };
    },
    [defaultFill, defaultStroke, defaultStrokeWidth]
  );

  // Mezcla los datos de los assets con los datos dinámicos del usuario
  const mergedBodyParts = useCallback(
    (dataSource) => {
      const filteredDataSource = dataSource.filter(
        (part) => !hiddenParts.includes(part.slug)
      );

      const userDataMap = new Map();
      data.forEach(userPart => {
        if (userPart.slug) {
          userDataMap.set(userPart.slug, userPart);
        }
      });

      return filteredDataSource.map((assetPart) => {
        const userPart = userDataMap.get(assetPart.slug);

        if (!userPart) {
          return assetPart;
        }

        const merged = {
          ...assetPart,
          styles: userPart.styles,
          intensity: userPart.intensity,
          side: userPart.side,
          color: userPart.color,
        };

        if (!merged.styles?.fill && !merged.color && merged.intensity) {
          merged.color = colors[merged.intensity - 1];
        }

        return merged;
      });
    },
    [data, colors, hiddenParts]
  );

  // Determina el color final de relleno
  const getColorToFill = (bodyPart) => {
    if (bodyPart.slug && disabledParts.includes(bodyPart.slug)) {
      return "#EBEBE4";
    }

    if (bodyPart.styles?.fill) {
      return bodyPart.styles.fill;
    }

    if (bodyPart.color) {
      return bodyPart.color;
    }

    if (bodyPart.intensity && bodyPart.intensity > 0) {
      return colors[bodyPart.intensity - 1];
    }

    return undefined;
  };

  const isPartDisabled = (slug) => slug && disabledParts.includes(slug);

  const renderBodySvg = (bodyToRender) => {
    const SvgWrapper = gender === "male" ? SvgMaleWrapper : SvgFemaleWrapper;

    return (
      <SvgWrapper side={side} scale={scale} border={border}>
        {mergedBodyParts(bodyToRender).map((bodyPart) => {
          
          // Renderizado de Caminos Comunes
          const commonpaths = (bodyPart.path?.common || []).map((path) => {
            const partStyles = getPartStyles(bodyPart);
            const fillColor = getColorToFill(bodyPart);

            return (
              <path
                key={path}
                onClick={
                  isPartDisabled(bodyPart.slug)
                    ? undefined
                    : () => onBodyPartPress?.(bodyPart)
                }
                aria-disabled={isPartDisabled(bodyPart.slug)}
                id={bodyPart.slug}
                fill={fillColor ?? partStyles.fill}
                stroke={partStyles.stroke}
                strokeWidth={partStyles.strokeWidth}
                d={path}
              />
            );
          });

          // Renderizado de Lado Izquierdo
          const leftpaths = (bodyPart.path?.left || []).map((path) => {
            const isOnlyRight = data.find((d) => d.slug === bodyPart.slug)?.side === "right";
            const partStyles = getPartStyles(bodyPart);
            const fillColor = isOnlyRight ? defaultFill : getColorToFill(bodyPart);

            return (
              <path
                key={path}
                onClick={
                  isPartDisabled(bodyPart.slug)
                    ? undefined
                    : () => onBodyPartPress?.(bodyPart, "left")
                }
                id={bodyPart.slug}
                fill={fillColor ?? partStyles.fill}
                stroke={partStyles.stroke}
                strokeWidth={partStyles.strokeWidth}
                d={path}
              />
            );
          });

          // Renderizado de Lado Derecho
          const rightpaths = (bodyPart.path?.right || []).map((path) => {
            const isOnlyLeft = data.find((d) => d.slug === bodyPart.slug)?.side === "left";
            const partStyles = getPartStyles(bodyPart);
            const fillColor = isOnlyLeft ? defaultFill : getColorToFill(bodyPart);

            return (
              <path
                key={path}
                onClick={
                  isPartDisabled(bodyPart.slug)
                    ? undefined
                    : () => onBodyPartPress?.(bodyPart, "right")
                }
                id={bodyPart.slug}
                fill={fillColor ?? partStyles.fill}
                stroke={partStyles.stroke}
                strokeWidth={partStyles.strokeWidth}
                d={path}
              />
            );
          });

          return [...commonpaths, ...leftpaths, ...rightpaths];
        })}
      </SvgWrapper>
    );
  };

  if (gender === "female") {
    return renderBodySvg(side === "front" ? bodyFemaleFront : bodyFemaleBack);
  }

  return renderBodySvg(side === "front" ? bodyFront : bodyBack);
};

export default CuerpoHumanoMusculos;
"use client";

import { Nunito } from "next/font/google";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface QuantitativeResult {
  variable_name: string;
  effect_size: number;
  direction: "Positive" | "Negative" | "Neutral";
}

interface Paper {
  title: string;
  quantitative_results: QuantitativeResult[];
}

interface BarDataItem {
  title: string;
  value: number;
}

interface HeatmapRow {
  title: string;
  [key: string]: string;
}

const filteredPapers: Paper[] = [
  {
    title: "Paper A",
    quantitative_results: [
      { variable_name: "Variable 1", effect_size: 120, direction: "Positive" },
      { variable_name: "Variable 2", effect_size: -80, direction: "Negative" },
      { variable_name: "Variable 3", effect_size: 100, direction: "Positive" },
    ],
  },
  {
    title: "Paper B",
    quantitative_results: [
      { variable_name: "Variable 1", effect_size: 110, direction: "Positive" },
      { variable_name: "Variable 2", effect_size: 60, direction: "Positive" },
      { variable_name: "Variable 3", effect_size: 0, direction: "Neutral" },
    ],
  },
  {
    title: "Paper C",
    quantitative_results: [
      { variable_name: "Variable 1", effect_size: 70, direction: "Positive" },
      { variable_name: "Variable 2", effect_size: 30, direction: "Positive" },
      { variable_name: "Variable 3", effect_size: 50, direction: "Positive" },
    ],
  },
];

const heatmapColors = {
  Positive: "#4CAF50",
  Negative: "#FF6B6B",
  Neutral: "#9E9E9E",
};

const barColors = ["#00BCD4", "#4CAF50", "#FF9800", "#2196F3", "#9E9E9E"];

const glassStyle = {
  background: "rgba(255, 255, 255, 0.15)",
  border: "3px solid rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  borderRadius: "1rem",
  color: "black",
  boxShadow: "0 4px 30px rgba(255, 255, 255, 0.2)",
};

export default function FloatingGlassChat() {
  const [metricOptions, setMetricOptions] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [barData, setBarData] = useState<BarDataItem[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapRow[]>([]);

  useEffect(() => {
    const uniqueVariables = new Set<string>();
    filteredPapers.forEach((paper) => {
      paper.quantitative_results.forEach((res) =>
        uniqueVariables.add(res.variable_name)
      );
    });
    const options = Array.from(uniqueVariables);
    setMetricOptions(options);
    setSelectedMetric(options[0] || "");
  }, []);

  useEffect(() => {
    if (!selectedMetric) return;
    const data: BarDataItem[] = filteredPapers.map((paper) => {
      const result = paper.quantitative_results.find(
        (r) => r.variable_name === selectedMetric
      );
      return { title: paper.title, value: result ? result.effect_size : 0 };
    });
    setBarData(data);
  }, [selectedMetric]);

  useEffect(() => {
    const data: HeatmapRow[] = filteredPapers.map((paper) => {
      const row: HeatmapRow = { title: paper.title };
      paper.quantitative_results.forEach((res) => {
        row[res.variable_name] = res.direction;
      });
      return row;
    });
    setHeatmapData(data);
  }, []);

  const positiveCount = heatmapData.reduce((acc, row) => {
    return (
      acc + metricOptions.filter((metric) => row[metric] === "Positive").length
    );
  }, 0);

  const neutralCount = heatmapData.reduce((acc, row) => {
    return (
      acc + metricOptions.filter((metric) => row[metric] === "Neutral").length
    );
  }, 0);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "350px",
        height: "calc(100vh - 90px)",
        ...glassStyle,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "3px solid rgba(255,255,255,0.6)",
          fontWeight: "700",
          fontSize: "1.05rem",
          textAlign: "center",
          color: "black",
          userSelect: "none",
        }}
      >
        VISUALIZACIONES COMPARATIVAS
      </div>

      {/* Content scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          color: "black",
          fontSize: "0.85rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Selector de métrica */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="metric-select" style={{ fontWeight: "600" }}>
            Métrica:
          </label>
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            style={{
              flex: 1,
              padding: "0.3rem 0.6rem",
              borderRadius: "0.5rem",
              border: "2px solid rgba(255,255,255,0.6)",
              backgroundColor: "rgba(255,255,255,0.9)",
              color: "black",
              fontSize: "0.85rem",
              outline: "none",
              cursor: "pointer",
              boxShadow: "0 0 5px rgba(0,0,0,0.1)",
            }}
          >
            {metricOptions.map((metric) => (
              <option key={metric} value={metric}>
                {metric}
              </option>
            ))}
          </select>
        </div>

        {/* Gráfico de barras */}
        <div
          style={{
            border: "3px solid rgba(255, 255, 255, 0.6)",
            borderRadius: "1rem",
            padding: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 4px 30px rgba(255,255,255,0.2)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              fontWeight: "700",
              fontSize: "0.95rem",
              marginBottom: "0.75rem",
            }}
          >
            TAMAÑO DEL EFECTO POR ESTUDIO
          </h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="90%" height={130}>
              <BarChart
                data={barData}
                margin={{ top: 5, right: 20, left: 20, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="title"
                  stroke="#333"
                  angle={-45}
                  textAnchor="end"
                  height={40}
                  tick={{ fill: "#333", fontSize: 9 }}
                />
                <YAxis stroke="#333" tick={{ fill: "#333", fontSize: 9 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    color: "#1F2937",
                  }}
                  formatter={(value: number) => value.toFixed(2)}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[index % barColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#555" }}>
              No hay datos para la métrica seleccionada.
            </p>
          )}
        </div>

        {/* Mapa de calor */}
        <div
          style={{
            border: "3px solid rgba(255, 255, 255, 0.6)",
            borderRadius: "1rem",
            padding: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 4px 30px rgba(255,255,255,0.2)",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              fontWeight: "700",
              fontSize: "0.9rem",
              marginBottom: "0.75rem",
            }}
          >
            DIRECCIÓN DE EFECTO
            <br />
            <span style={{ fontSize: "0.7rem" }}>(VARIABLES CLAVE)</span>
          </h3>
          {heatmapData.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `80px repeat(${metricOptions.length}, 1fr)`,
                  gap: "3px",
                }}
              >
                <div></div>
                {metricOptions.map((varName) => (
                  <div
                    key={varName}
                    style={{
                      textAlign: "center",
                      fontWeight: "600",
                      color: "black",
                      fontSize: "0.7rem",
                      padding: "0.1rem 0",
                    }}
                  >
                    {varName}
                  </div>
                ))}
                {heatmapData.map((row) => (
                  <React.Fragment key={row.title}>
                    <div
                      style={{
                        fontWeight: "600",
                        color: "black",
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {row.title}
                    </div>
                    {metricOptions.map((varName) => (
                      <div
                        key={varName}
                        title={`${row.title} - ${varName}: ${
                          row[varName] || "Neutral"
                        }`}
                        style={{
                          backgroundColor:
                            heatmapColors[
                              row[varName] as keyof typeof heatmapColors
                            ] || heatmapColors.Neutral,
                          height: "25px",
                          borderRadius: "0.35rem",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.filter = "brightness(0.85)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.filter = "brightness(1)")
                        }
                      ></div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#555" }}>
              No hay datos para el mapa de calor.
            </p>
          )}
        </div>

        {/* Estadísticas */}
        <div
          style={{
            border: "3px solid rgba(255, 255, 255, 0.6)",
            borderRadius: "1rem",
            padding: "0.75rem",
            backgroundColor: "rgba(255,255,255,0.15)",
            boxShadow: "0 4px 30px rgba(255,255,255,0.2)",
            color: "black",
            textAlign: "center",
            fontSize: "0.75rem",
          }}
        >
          <h2 style={{ fontWeight: "700", fontSize: "0.9rem", marginBottom: "0.75rem" }}>
            DIRECCIÓN DE EFECTO
            <br />
            <span style={{ fontSize: "0.7rem" }}>(VARIABLES CLAVE)</span>
          </h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginBottom: "0.25rem",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "1.2rem", color: "#4CAF50" }}>+</span>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    color: "#4CAF50",
                  }}
                >
                  Positivo
                </span>
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "1.3rem",
                  color: "#4CAF50",
                }}
              >
                {positiveCount}
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  marginBottom: "0.25rem",
                  justifyContent: "center",
                }}
              >
                <span style={{ fontSize: "1.2rem", color: "#9E9E9E" }}>-</span>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "0.75rem",
                    color: "#9E9E9E",
                  }}
                >
                  0 Neutro
                </span>
              </div>
              <div
                style={{
                  fontWeight: "700",
                  fontSize: "1.3rem",
                  color: "#9E9E9E",
                }}
              >
                {neutralCount}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "0.65rem",
              fontStyle: "italic",
              color: "#555",
            }}
          >
            En transparencia/breve para evitar
            <br />
            sesgos e información no
            <br />
            manipulabilidad
          </div>
        </div>
      </div>
    </div>
  );
}

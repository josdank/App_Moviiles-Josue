import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Gasto } from "../types/gasto";
import { calcularBalances } from "./balances";

export async function generarYCompartirPDF(gastos: Gasto[]) {
  const { totalPorPersona, promedio, deudas } = calcularBalances(gastos);
  const filas = gastos.map(
    g => `<tr><td>${g.titulo}</td><td>$${g.monto.toFixed(2)}</td><td>${g.pagoPor}</td><td>${g.participantes.join(", ")}</td><td>${new Date(g.creadoEn).toLocaleString()}</td></tr>`
  ).join("");

  const filasDeudas = deudas.map(
    d => `<li>${d.de} → ${d.a}: $${d.monto.toFixed(2)}</li>`
  ).join("");

  const html = `
  <html>
  <head><meta charset="utf-8" />
    <style>
      body { font-family: -apple-system, Segoe UI, Roboto, Arial; padding: 16px; }
      h1,h2 { margin: 8px 0; }
      table { width: 100%; border-collapse: collapse; }
      th,td { border: 1px solid #ddd; padding: 6px; font-size: 12px; }
      th { background: #f3f4f6; text-align: left; }
      small { color: #6b7280; }
    </style>
  </head>
  <body>
    <h1>Resumen de Gastos</h1>
    <small>Generado: ${new Date().toLocaleString()}</small>
    <h2>Gastos</h2>
    <table>
      <thead><tr><th>Título</th><th>Monto</th><th>Pagó</th><th>Participantes</th><th>Fecha</th></tr></thead>
      <tbody>${filas}</tbody>
    </table>

    <h2>Balances</h2>
    <ul>
      <li>Juan: $${totalPorPersona.Juan.toFixed(2)}</li>
      <li>María: $${totalPorPersona.María.toFixed(2)}</li>
      <li>Pedro: $${totalPorPersona.Pedro.toFixed(2)}</li>
    </ul>
    <p>Promedio ideal por persona: <b>$${promedio.toFixed(2)}</b></p>
    <h3>Deudas</h3>
    <ul>${filasDeudas || "<li>No hay deudas.</li>"}</ul>
  </body>
  </html>`;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { dialogTitle: "Compartir reporte de gastos" });
}

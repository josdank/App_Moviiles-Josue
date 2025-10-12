import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { CVData } from '../types/cv.types';

export async function exportCVToPDF(cvData: CVData) {
  const html = `
  <html>
    <body style="font-family: sans-serif; padding: 20px;">
      <h1>${cvData.personalInfo.fullName}</h1>
      <p>${cvData.personalInfo.email} | ${cvData.personalInfo.phone}</p>
      <p>${cvData.personalInfo.location}</p>
      <h2>Resumen</h2>
      <p>${cvData.personalInfo.summary}</p>

      <h2>Experiencia</h2>
      ${cvData.experiences.map(exp => `
        <h3>${exp.position} - ${exp.company}</h3>
        <p>${exp.startDate} - ${exp.endDate}</p>
        <p>${exp.description}</p>
      `).join('')}

      <h2>Educación</h2>
      ${cvData.education.map(edu => `
        <h3>${edu.degree} - ${edu.institution}</h3>
        <p>${edu.field} (${edu.graduationYear})</p>
      `).join('')}

      <h2>Habilidades</h2>
      <ul>
        ${cvData.habilidades.map(h => `<li>${h.nombre} (${h.nivel})</li>`).join('')}
      </ul>
    </body>
  </html>`;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}

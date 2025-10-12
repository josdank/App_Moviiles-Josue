import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { CVData } from '../types/cv.types';

export async function exportCVToPDF(cvData: CVData) {
  const html = `
  <html>
    <head>
      <style>
        body {
          font-family: sans-serif;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .profile-image {
          width: 120px;
          height: 120px;
          border-radius: 60px;
          object-fit: cover;
          border: 2px solid #ccc;
          margin-bottom: 15px;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 5px;
        }
        .contact {
          font-size: 14px;
          margin-bottom: 10px;
        }
        h2 {
          font-size: 20px;
          margin-top: 30px;
          margin-bottom: 10px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }
        h3 {
          font-size: 16px;
          margin: 10px 0 5px;
        }
        p {
          margin: 4px 0;
          font-size: 14px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          font-size: 14px;
          margin-bottom: 4px;
        }
        .section {
          margin-bottom: 25px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${cvData.personalInfo.profileImage ? `<img src="${cvData.personalInfo.profileImage}" class="profile-image" />` : ''}
        <h1>${cvData.personalInfo.fullName}</h1>
        <p class="contact">
          ${cvData.personalInfo.email} | ${cvData.personalInfo.phone}
        </p>
        <p class="contact">${cvData.personalInfo.location}</p>
      </div>

      <div class="section">
        <h2>Resumen</h2>
        <p>${cvData.personalInfo.summary}</p>
      </div>

      <div class="section">
        <h2>Experiencia</h2>
        ${cvData.experiences.map(exp => `
          <h3>${exp.position} - ${exp.company}</h3>
          <p>${exp.startDate} - ${exp.endDate}</p>
          <p>${exp.description}</p>
        `).join('')}
      </div>

      <div class="section">
        <h2>Educación</h2>
        ${cvData.education.map(edu => `
          <h3>${edu.degree} - ${edu.institution}</h3>
          <p>${edu.field} (${edu.graduationYear})</p>
        `).join('')}
      </div>

      <div class="section">
        <h2>Habilidades</h2>
        <ul>
          ${cvData.habilidades.map(h => `<li>${h.nombre} (${h.nivel})</li>`).join('')}
        </ul>
      </div>
    </body>
  </html>`;

  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri);
}

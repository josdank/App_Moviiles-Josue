export interface PersonalInfo{
    fullName: string;
    email: string
    phone: string;
    location: string;
    summary: string;
    profileImage?: string //Uri de la imagen
}

export interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: string;
}

export interface Habilidad{
    id:string,
    nombre: string,
    nivel: 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto'; 
    
}

export interface CVData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  habilidades: Habilidad[];
  editingExperience: Experience | null;
}

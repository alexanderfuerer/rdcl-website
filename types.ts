
export interface Service {
  id: string;
  icon: string;
  imageUrl?: string;
  title: string;
  mainTitle: string;
  description: string;
  resultLabel: string;
  resultValue: string;
  scopeTitle: string;
  scopeItems: string[];
  ctaText: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface Insight {
  id: string;
  title: string;
  type: 'Checklist' | 'Report' | 'Whitepaper';
  description: string;
  downloadUrl: string;
}

export interface MissionContent {
  heading: string;
  subheading: string;
  pillars: { title: string; text: string }[];
}

export interface AboutContent {
  ceoName: string;
  ceoTitle: string;
  bio: string;
  beliefs: string[];
  cvItems: { year: string; role: string; company: string; logoUrl?: string }[];
  educationItems?: { year: string; degree: string; institution: string; logoUrl?: string }[];
  lecturingItems?: { year: string; role: string; institution: string; logoUrl?: string }[];
  imageUrl: string;
}

export interface Partner {
  name: string;
  url?: string;
}

export interface WebsiteData {
  logoUrl: string;
  aiReadinessUrl: string;
  projectsHeading: string;
  projectsIntro: string;
  mission: MissionContent;
  services: Service[];
  projects: Project[];
  insights: Insight[];
  about: AboutContent;
  partners: Partner[];
}

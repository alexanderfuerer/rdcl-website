
import { WebsiteData } from './types';

// Using the high-resolution ink brush logo provided by the user
export const HARDCODED_LOGO_URL = '/logo.png';

export const INITIAL_DATA: WebsiteData = {
  logoUrl: HARDCODED_LOGO_URL,
  aiReadinessUrl: 'https://example.com/ai-check',
  projectsHeading: "Selected Projects and Keynotes",
  projectsIntro: "Evidence of transformation in the age of intelligence. Our portfolio reflects our commitment to human-centric AI integration, demonstrating how technical precision meets visionary leadership to solve complex organizational challenges.",
  mission: {
    heading: "Bridging the gap between human intuition and machine intelligence.",
    subheading: "At RDCL, we don't just implement technology; we architect the future of work. Our mission is to ensure that as AI scales, human value amplifies rather than diminishes.",
    pillars: [
      {
        title: "Empathy First",
        text: "Every automated workflow must enhance the lives of those it serves. We measure success by the time we buy back for your people."
      },
      {
        title: "Radical Clarity",
        text: "We demystify the complex. Our frameworks turn AI anxiety into strategic advantage through transparent and explainable systems."
      },
      {
        title: "Ethical Integration",
        text: "Technology with a conscience. We ensure your AI adoption aligns with global standards and your specific corporate values."
      }
    ]
  },
  services: [
    {
      id: '1',
      icon: 'engineering',
      title: 'The Centaur Model',
      mainTitle: 'Automation & Integration',
      description: 'We integrate AI deep into your core operational processes. We follow the "Centaur" approach: the human holds the reins and gives the strategic direction, while the AI takes over the burden of repetitive tasks. We build customized systems that do not replace, but strengthen.',
      resultLabel: 'RESULTAT',
      resultValue: '0% Admin. 100% Fokus.',
      scopeTitle: 'Leistungsumfang',
      scopeItems: [
        'Analyse bestehender Workflows auf Automatisierungspotenzial',
        'Integration in bestehende Software (ERP, CRM, Slack)',
        'Entwicklung eigener LLM-Wrapper für Datenschutz-Compliance',
        'Intelligente Dokumentenverarbeitung & Datenextraktion'
      ],
      ctaText: 'Mehr Details anfragen'
    },
    {
      id: '2',
      icon: 'lightbulb',
      title: 'Mindset Shift',
      mainTitle: 'Culture & Enablement',
      description: 'Technology is worthless without the people who operate it. Our workshops and keynotes are designed to reduce fears and awaken pragmatic curiosity. We transform your workforce\'s skepticism into productive drive and establish a culture of lifelong learning.',
      resultLabel: 'RESULTAT',
      resultValue: 'Ein Team, das KI fordert.',
      scopeTitle: 'Leistungsumfang',
      scopeItems: [
        'Interaktive Workshops für Prompt Engineering',
        'Identification von "AI Champions" im Unternehmen',
        'C-Level Strategy Sessions zur KI-Roadmap',
        'Entwicklung von internen KI-Guideline'
      ],
      ctaText: 'Workshop buchen'
    },
    {
      id: '3',
      icon: 'campaign',
      title: 'Authentic Reach',
      mainTitle: 'Growth & Communication',
      description: 'Marketing communication that scales through AI but resonates through human empathy. We train models to your specific "Brand Voice" so you can produce content that doesn\'t sound like a robot. More output, with the same or higher emotional quality.',
      resultLabel: 'RESULTAT',
      resultValue: 'Sichtbarkeit ohne Identitätsverlust.',
      scopeTitle: 'Leistungsumfang',
      scopeItems: [
        'Fine-Tuning von Modellen auf Ihre Brand Voice',
        'Skalierbare Personalisierung für Outreach',
        'Automatisierte Content-Repurposing Workflows',
        'SEO-Optimierung durch assistierte Content-Erstellung'
      ],
      ctaText: 'Potentialanalyse starten'
    }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Global Pharma Transformation',
      category: 'Strategic AI',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=800',
      description: 'Automated 70% of regulatory reporting workflows while maintaining 100% human oversight.'
    },
    {
      id: 'p2',
      title: 'NextGen Creative Studio',
      category: 'Creative Ops',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      description: 'Implemented custom diffusion models for rapid storyboarding, reducing production time by 40%.'
    },
    {
      id: 'p3',
      title: 'Fintech Advisory Layer',
      category: 'Client Services',
      image: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800',
      description: 'Developed an AI-enhanced concierge service for high-net-worth individuals.'
    }
  ],
  insights: [
    {
      id: 'i1',
      title: 'AI Readiness Checklist',
      type: 'Checklist',
      description: 'A 20-point diagnostic to evaluate if your organization is ready for human-centric automation.',
      downloadUrl: '#'
    },
    {
      id: 'i2',
      title: '2024 State of Human-AI Interaction',
      type: 'Report',
      description: 'Our annual research report on how elite teams are leveraging LLMs as strategic partners.',
      downloadUrl: '#'
    }
  ],
  about: {
    ceoName: 'Michael Lewrick',
    ceoTitle: 'Founder & CEO',
    bio: 'Michael is a design thinking pioneer and AI visionary. He believes that the true power of technology is not to replace humans, but to amplify our most unique qualities: empathy, creativity, and leadership.',
    beliefs: [
      'Technology must serve the human experience.',
      'Radical simplicity is the highest form of sophistication.',
      'Automation should buy time for imagination.'
    ],
    cvItems: [
      { year: '2020 - Present', role: 'Managing Partner', company: 'RDCL Human Centered AI' },
      { year: '2015 - 2020', role: 'Head of Innovation', company: 'Leading Swiss Consulting' },
      { year: '2010 - 2015', role: 'Sr. Strategy Consultant', company: 'Deloitte Digital' }
    ],
    educationItems: [
      { year: '2019', degree: 'PhD in Business Innovation', institution: 'University of St. Gallen' },
      { year: '2012', degree: 'Design Thinking Professional', institution: 'Stanford University' }
    ],
    lecturingItems: [
      { year: '2023 - Present', role: 'Guest Lecturer AI Ethics', institution: 'ETH Zurich' },
      { year: '2021 - Present', role: 'Executive Education Lead', institution: 'University of St. Gallen' }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600'
  },
  partners: [
    { name: 'ORACLE', url: 'https://oracle.com' },
    { name: 'SPOTIFY', url: 'https://spotify.com' },
    { name: 'NOTION', url: 'https://notion.so' },
    { name: 'SCALE', url: 'https://scale.com' },
    { name: 'JASPER', url: 'https://jasper.ai' }
  ]
};

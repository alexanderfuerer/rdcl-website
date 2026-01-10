
import { WebsiteData } from './types';

// Using the high-resolution ink brush logo provided by the user
export const HARDCODED_LOGO_URL = '/logo.png';

// German translations (primary language)
export const INITIAL_DATA_DE: WebsiteData = {
  logoUrl: HARDCODED_LOGO_URL,
  aiReadinessUrl: 'https://example.com/ai-check',
  projectsHeading: 'Ausgewählte Projekte & Keynotes',
  projectsIntro: 'Evidenz für Transformation im Zeitalter der Intelligenz. Unser Portfolio zeigt unser Engagement für menschenzentrierte KI-Integration – technische Präzision trifft visionäre Führung.',
  mission: {
    heading: 'Die Brücke zwischen menschlicher Intuition und maschineller Intelligenz.',
    subheading: 'Bei RDCL geht es nicht um KI um der KI willen. Wir setzen Systeme auf, die Arbeit einfacher machen – und Menschen stärker. Wenn KI skaliert, soll der menschliche Wert nicht kleiner werden, sondern sichtbarer.',
    pillars: [
      {
        title: 'Empathie zuerst',
        text: 'Jeder automatisierte Workflow muss das Leben derer verbessern, denen er dient. Wir messen Erfolg an der Zeit, die wir für Ihre Mitarbeiter zurückgewinnen.'
      },
      {
        title: 'Radikale Klarheit',
        text: 'Wir entmystifizieren das Komplexe. Unsere Frameworks verwandeln KI-Angst in strategischen Vorteil durch transparente und erklärbare Systeme.'
      },
      {
        title: 'Ethische Integration',
        text: 'Technologie mit Gewissen. Wir stellen sicher, dass Ihre KI-Adoption globalen Standards und Ihren spezifischen Unternehmenswerten entspricht.'
      }
    ]
  },
  services: [
    {
      id: '1',
      icon: 'engineering',
      title: 'Das Zentaur-Modell',
      mainTitle: 'Prozesse & Automatisierung',
      description: 'Wir integrieren KI tief in Ihre operativen Kernprozesse. Wir folgen dem "Zentaur"-Ansatz: Der Mensch hält die Zügel und gibt die strategische Richtung vor, während die KI die Last repetitiver Aufgaben übernimmt. Wir bauen massgeschneiderte Systeme, die nicht ersetzen, sondern stärken.',
      resultLabel: 'ZIEL',
      resultValue: '0% Admin. 100% Fokus.',
      scopeTitle: 'Leistungsumfang',
      scopeItems: [
        'Analyse bestehender Workflows auf Automatisierungspotenzial',
        'Integration in bestehende Software (ERP, CRM, Slack)',
        'Entwicklung von Custom LLM Wrappern für Datenschutz-Compliance',
        'Intelligente Dokumentenverarbeitung & Datenextraktion'
      ],
      ctaText: 'Details anfragen'
    },
    {
      id: '2',
      icon: 'lightbulb',
      title: 'Mindset Shift',
      mainTitle: 'Kultur & Kompetenz',
      description: 'Technologie ist wertlos ohne die Menschen, die sie bedienen. Unsere Workshops und Keynotes sind darauf ausgelegt, Ängste abzubauen und pragmatische Neugier zu wecken. Wir verwandeln die Skepsis Ihrer Belegschaft in produktiven Antrieb und etablieren eine Kultur des lebenslangen Lernens.',
      resultLabel: 'ZIEL',
      resultValue: 'Ein Team, das KI nutzt.',
      scopeTitle: 'Leistungsumfang',
      scopeItems: [
        'Interaktive Workshops für Prompt Engineering',
        'Identifikation von "AI Champions" im Unternehmen',
        'C-Level Strategie-Sessions zur AI Roadmap',
        'Entwicklung interner KI-Richtlinien'
      ],
      ctaText: 'Workshop buchen'
    },
    {
      id: '3',
      icon: 'campaign',
      title: 'Authentic Reach',
      mainTitle: 'Kommunikation & Skalierung',
      description: 'Marketing-Kommunikation, die durch KI skaliert, aber durch menschliche Empathie überzeugt. Wir trainieren Modelle auf Ihre spezifische "Brand Voice", damit Sie Content produzieren können, der nicht nach Roboter klingt. Mehr Output, bei gleicher oder höherer emotionaler Qualität.',
      resultLabel: 'ZIEL',
      resultValue: 'Sichtbarkeit ohne Identitätsverlust.',
      scopeTitle: 'Leistungsumfang',
      scopeItems: [
        'Fine-Tuning von Modellen auf Ihre Brand Voice',
        'Skalierbare Personalisierung für Outreach',
        'Automatisierte Content-Repurposing-Workflows',
        'SEO-Optimierung durch assistierte Content-Erstellung'
      ],
      ctaText: 'Potenzialanalyse starten'
    }
  ],
  projects: [
    {
      id: 'p1',
      title: 'Globale Pharma-Transformation',
      category: 'Strategische KI',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306dca664?auto=format&fit=crop&q=80&w=800',
      description: '70% der regulatorischen Reporting-Workflows automatisiert bei 100% menschlicher Kontrolle.'
    },
    {
      id: 'p2',
      title: 'NextGen Creative Studio',
      category: 'Creative Ops',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
      description: 'Custom Diffusion-Modelle für schnelles Storyboarding implementiert – 40% weniger Produktionszeit.'
    },
    {
      id: 'p3',
      title: 'Fintech Advisory Layer',
      category: 'Kundenservice',
      image: 'https://images.unsplash.com/photo-1551288049-bbbda536639a?auto=format&fit=crop&q=80&w=800',
      description: 'KI-gestützter Concierge-Service für vermögende Privatkunden entwickelt.'
    }
  ],
  insightsHeading: 'Frameworks & Praxiswissen',
  insightsIntro: 'Kuratierte Checklisten, relevante Reports und wegweisende Artikel zu globalen KI-Themen – ergänzt durch Ansichten führender KI-Vordenker. Alles mit Fokus auf Praxis, Klarheit und menschenzentrierte Umsetzung.',
  insights: [
    {
      id: 'i1',
      title: 'AI Readiness Checklist',
      type: 'Checklist',
      description: 'Eine 20-Punkte-Diagnose zur Bewertung, ob Ihre Organisation bereit für menschenzentrierte Automatisierung ist.',
      downloadUrl: '#'
    },
    {
      id: 'i2',
      title: '2024 State of Human-AI Interaction',
      type: 'Report',
      description: 'Unser jährlicher Forschungsbericht darüber, wie Elite-Teams LLMs als strategische Partner einsetzen.',
      downloadUrl: '#'
    }
  ],
  about: {
    ceoName: 'Alexander Fürer',
    ceoTitle: 'Gründer',
    bio: 'Michael ist ein Design Thinking Pionier und KI-Visionär. Er glaubt, dass die wahre Kraft der Technologie nicht darin liegt, Menschen zu ersetzen, sondern unsere einzigartigsten Qualitäten zu verstärken: Empathie, Kreativität und Führung.',
    beliefs: [
      'Technologie muss dem menschlichen Erlebnis dienen.',
      'Radikale Einfachheit ist die höchste Form der Raffinesse.',
      'Automatisierung sollte Zeit für Imagination freikaufen.'
    ],
    cvItems: [
      { year: '2020 - Heute', role: 'Managing Partner', company: 'RDCL Human Centered AI' },
      { year: '2015 - 2020', role: 'Head of Innovation', company: 'Leading Swiss Consulting' },
      { year: '2010 - 2015', role: 'Sr. Strategy Consultant', company: 'Deloitte Digital' }
    ],
    educationItems: [
      { year: '2019', degree: 'PhD in Business Innovation', institution: 'Universität St. Gallen' },
      { year: '2012', degree: 'Design Thinking Professional', institution: 'Stanford University' }
    ],
    lecturingItems: [
      { year: '2023 - Heute', role: 'Gastdozent AI Ethics', institution: 'ETH Zürich' },
      { year: '2021 - Heute', role: 'Executive Education Lead', institution: 'Universität St. Gallen' }
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

// English translations
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
      mainTitle: 'Prozesse & Automatisierung',
      description: 'We integrate AI deep into your core operational processes. We follow the "Centaur" approach: the human holds the reins and gives the strategic direction, while the AI takes over the burden of repetitive tasks. We build customized systems that do not replace, but strengthen.',
      resultLabel: 'ZIEL',
      resultValue: '0% Admin. 100% Focus.',
      scopeTitle: 'Scope of Services',
      scopeItems: [
        'Analysis of existing workflows for automation potential',
        'Integration into existing software (ERP, CRM, Slack)',
        'Development of custom LLM wrappers for data privacy compliance',
        'Intelligent document processing & data extraction'
      ],
      ctaText: 'Request More Details'
    },
    {
      id: '2',
      icon: 'lightbulb',
      title: 'Mindset Shift',
      mainTitle: 'Kultur & Kompetenz',
      description: 'Technology is worthless without the people who operate it. Our workshops and keynotes are designed to reduce fears and awaken pragmatic curiosity. We transform your workforce\'s skepticism into productive drive and establish a culture of lifelong learning.',
      resultLabel: 'ZIEL',
      resultValue: 'A team that leverages AI.',
      scopeTitle: 'Scope of Services',
      scopeItems: [
        'Interactive workshops for Prompt Engineering',
        'Identification of "AI Champions" within the company',
        'C-Level Strategy Sessions on the AI Roadmap',
        'Development of internal AI guidelines'
      ],
      ctaText: 'Book Workshop'
    },
    {
      id: '3',
      icon: 'campaign',
      title: 'Authentic Reach',
      mainTitle: 'Kommunikation & Skalierung',
      description: 'Marketing communication that scales through AI but resonates through human empathy. We train models to your specific "Brand Voice" so you can produce content that doesn\'t sound like a robot. More output, with the same or higher emotional quality.',
      resultLabel: 'ZIEL',
      resultValue: 'Visibility without loss of identity.',
      scopeTitle: 'Scope of Services',
      scopeItems: [
        'Fine-tuning of models to your Brand Voice',
        'Scalable personalization for outreach',
        'Automated content repurposing workflows',
        'SEO optimization through assisted content creation'
      ],
      ctaText: 'Start Potential Analysis'
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
  insightsHeading: 'Frameworks & Praxiswissen',
  insightsIntro: 'Kuratierte Checklisten, relevante Reports und wegweisende Artikel zu globalen KI-Themen – ergänzt durch Ansichten führender KI-Vordenker. Alles mit Fokus auf Praxis, Klarheit und menschenzentrierte Umsetzung.',
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
    ceoName: 'Alexander Fürer',
    ceoTitle: 'Founder',
    bio: 'Alex is a thinking pioneer and AI visionary. He believes that the true power of technology is not to replace humans, but to amplify our most unique qualities: empathy, creativity, and leadership.',
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
    { name: 'TEST', url: 'https://apple.com' },
    { name: 'SPOTIFY', url: 'https://spotify.com' },
    { name: 'NOTION', url: 'https://notion.so' },
    { name: 'SCALE', url: 'https://scale.com' },
    { name: 'JASPER', url: 'https://jasper.ai' }
  ]
};

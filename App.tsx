
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { WebsiteData, Service, Project, Insight, MissionContent, AboutContent, Partner } from './types';
import { INITIAL_DATA, HARDCODED_LOGO_URL } from './constants';

// --- Utility Functions ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const resizeImage = (base64Str: string, maxWidth = 800, maxHeight = 600): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = (e) => {
      console.error("Image load failed", e);
      reject(new Error("Failed to load image for resizing."));
    };
  });
};

// --- Component to render Markdown-style links ---
const FormattedText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  if (!text) return null;

  // Split by markdown link pattern [text](url)
  const parts = text.split(/(\[.*?\]\(.*?\))/g);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const match = part.match(/\[(.*?)\]\(.*?\)/);
        if (match) {
          const urlMatch = part.match(/\((.*?)\)/);
          const url = urlMatch ? urlMatch[1] : "#";
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary-blue hover:text-secondary-orange underline decoration-secondary-blue/30 transition-all font-semibold"
            >
              {match[1]}
            </a>
          );
        }
        return part;
      })}
    </span>
  );
};

// --- Backend Service Mock ---
const DataService = {
  async save(translations: Record<string, WebsiteData>): Promise<void> {
    try {
      const serialized = JSON.stringify(translations);
      localStorage.setItem('rdcl_translations', serialized);
    } catch (e) {
      console.error("LocalStorage Save Error:", e);
      throw new Error("Storage quota exceeded or unavailable.");
    }
  },
  async load(): Promise<Record<string, WebsiteData> | null> {
    try {
      const saved = localStorage.getItem('rdcl_translations');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to load data", e);
      return null;
    }
  },
  saveSubscribers(subscribers: Subscriber[]): void {
    localStorage.setItem('rdcl_subscribers', JSON.stringify(subscribers));
  },
  loadSubscribers(): Subscriber[] {
    const saved = localStorage.getItem('rdcl_subscribers');
    return saved ? JSON.parse(saved) : [];
  }
};

interface Subscriber {
  email: string;
  date: string;
}

// --- CMS Field Component (Defined outside to fix focus issues) ---
const CMSField = ({ label, value, onChange, textarea = false, type = "text" }: { label: string, value: string, onChange: (v: string) => void, textarea?: boolean, type?: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</label>
    {textarea ? (
      <textarea
        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-white/20 outline-none text-sm min-h-[100px]"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    ) : (
      <input
        type={type}
        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 focus:ring-1 focus:ring-white/20 outline-none text-sm"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    )}
  </div>
);

// --- Shared UI Components ---

const Logo = ({ className = "h-12", logoUrl }: { className?: string, logoUrl?: string }) => {
  return (
    <img
      src={logoUrl || HARDCODED_LOGO_URL}
      alt="RDCL"
      loading="eager"
      className={`${className} object-contain mix-blend-multiply block`}
      style={{ minWidth: '80px' }}
    />
  );
};

const Navbar = ({
  onNavigate,
  currentView,
  openCms,
  openContact,
  isAuthenticated,
  currentLanguage,
  setLanguage,
  isTranslating,
  logoUrl
}: {
  onNavigate: (view: string) => void,
  currentView: string,
  openCms: () => void,
  openContact: () => void,
  isAuthenticated: boolean,
  currentLanguage: 'en' | 'de',
  setLanguage: (lang: 'en' | 'de') => void,
  isTranslating: boolean,
  logoUrl: string
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Mission', 'Services', 'Projects', 'Insights', 'About'];

  const handleMobileNav = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-[#f9f8f6]/90 backdrop-blur-md border-b border-black/5">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <Logo className="h-10 md:h-12" logoUrl={logoUrl} />
            </div>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => onNavigate(item.toLowerCase())}
                  className={`text-[15px] font-medium transition-colors relative group ${currentView === item.toLowerCase() ? 'text-black' : 'text-[#6b6965] hover:text-black'}`}
                >
                  {item}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-secondary-blue transition-transform duration-300 origin-left ${currentView === item.toLowerCase() ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden sm:flex items-center bg-black/5 rounded-full p-1 h-10 px-2 relative">
                {isTranslating && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-secondary-orange animate-pulse whitespace-nowrap">AI TRANSLATING...</div>
                )}
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${currentLanguage === 'en' ? 'bg-white text-black shadow-sm' : 'text-[#6b6965] hover:text-black'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('de')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${currentLanguage === 'de' ? 'bg-white text-black shadow-sm' : 'text-[#6b6965] hover:text-black'}`}
                >
                  DE
                </button>
              </div>

              {isAuthenticated && (
                <button
                  onClick={openCms}
                  className="hidden sm:flex items-center gap-2 h-10 px-4 rounded-full border border-black/10 text-[#6b6965] text-xs font-medium hover:bg-black/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Backend
                </button>
              )}

              <button
                onClick={openContact}
                className="hidden sm:block h-10 px-5 rounded-full bg-black text-white text-[15px] font-medium hover:bg-secondary-orange transition-colors"
              >
                Contact Us
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-black hover:bg-black/10 transition-colors"
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined">
                  {isMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[45] bg-[#f9f8f6] transition-transform duration-500 ease-in-out md:hidden ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="flex flex-col h-full pt-28 px-6 pb-12 overflow-y-auto">
          <nav className="flex flex-col gap-6 mb-12">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => handleMobileNav(item.toLowerCase())}
                className={`text-left font-serif text-5xl tracking-tight transition-colors ${currentView === item.toLowerCase() ? 'text-secondary-blue' : 'text-black'}`}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-8">
            <div className="flex items-center justify-between border-t border-black/5 pt-8">
              <span className="text-xs font-bold tracking-widest text-[#6b6965] uppercase">Language</span>
              <div className="flex bg-black/5 rounded-full p-1">
                <button onClick={() => setLanguage('en')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${currentLanguage === 'en' ? 'bg-white text-black shadow-sm' : 'text-[#6b6965]'}`}>EN</button>
                <button onClick={() => setLanguage('de')} className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${currentLanguage === 'de' ? 'bg-white text-black shadow-sm' : 'text-[#6b6965]'}`}>DE</button>
              </div>
            </div>
            {isAuthenticated && (
              <button onClick={() => { openCms(); setIsMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl border border-black/10 text-black font-medium hover:bg-black/5 transition-colors">
                <span className="material-symbols-outlined">settings</span> Backend
              </button>
            )}
            <button onClick={() => { openContact(); setIsMenuOpen(false); }} className="w-full h-14 rounded-2xl bg-black text-white font-medium text-lg hover:bg-secondary-orange transition-colors">Contact Us</button>
          </div>
        </div>
      </div>
    </>
  );
};

const NeuralNetworkCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 100;
    const connectionDistance = 210;
    class Particle {
      x: number; y: number; vx: number; vy: number; radius: number; color: string; baseAlpha: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 5 + 4;
        this.baseAlpha = 0.95;
        const colors = ['#5a7da3', '#ff4e05', '#6d8a7a', '#111111'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < -60) this.x = canvas!.width + 60;
        if (this.x > canvas!.width + 60) this.x = -60;
        if (this.y < -60) this.y = canvas!.height + 60;
        if (this.y > canvas!.height + 60) this.y = -60;
        this.vx += (Math.random() - 0.5) * 0.008;
        this.vy += (Math.random() - 0.5) * 0.008;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 1.1) { this.vx *= 0.96; this.vy *= 0.96; }
      }
      draw() {
        ctx!.beginPath(); ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = this.color; ctx!.globalAlpha = this.baseAlpha; ctx!.fill();
      }
    }
    const init = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    };
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]; p1.update(); p1.draw();
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x; const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) {
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - (distance / connectionDistance)) * 0.5;
            ctx.strokeStyle = `rgba(90, 125, 163, ${alpha})`; ctx.lineWidth = 2.2; ctx.stroke();
            const uniqueSpeed = 0.0007 + ((i * j) % 8) * 0.00018;
            const uniqueOffset = (i + j) * 2;
            const flowTime = (time * uniqueSpeed + uniqueOffset) % 1;
            if ((i + j) % 15 === 0) {
              const sx = p1.x + (p2.x - p1.x) * flowTime;
              const sy = p1.y + (p2.y - p1.y) * flowTime;
              ctx.beginPath(); ctx.arc(sx, sy, 2.0, 0, Math.PI * 2);
              ctx.fillStyle = '#ff4e05'; ctx.globalAlpha = alpha * 4.5 * Math.min(1, flowTime * 8); ctx.fill();
            }
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    init(); animate(0);
    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return <div className="relative w-full h-[650px] flex items-center justify-center"><canvas ref={canvasRef} className="w-full h-full relative z-10" /></div>;
};

const HeroLogo = ({ logoUrl }: { logoUrl: string }) => {
  return (
    <div className="relative mb-6 pointer-events-none z-30 flex items-center justify-start">
      <img
        src={logoUrl || HARDCODED_LOGO_URL}
        alt="RDCL Ink Logo"
        loading="eager"
        className="w-[280px] md:w-[420px] h-auto object-contain mix-blend-multiply block"
      />
    </div>
  );
};

const Hero = ({ subtitle, logoUrl }: { subtitle: string, logoUrl: string }) => (
  <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-20">
    <div className="hero-grain"></div>
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(90,125,163,0.12)_0%,_rgba(255,78,5,0.04)_30%,_rgba(109,138,122,0.02)_60%,_transparent_80%)] animate-mesh-flow"></div>
    </div>
    <div className="relative z-10 w-full max-w-[1400px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="flex flex-col items-start text-left relative pt-0 pb-12 lg:pb-24">
        <HeroLogo logoUrl={logoUrl} />
        <h1 className="font-serif font-normal text-6xl md:text-7xl lg:text-[6.5rem] leading-[0.9] tracking-tight text-black mb-8 relative z-20">Human Centered AI-Consulting</h1>
        <div className="text-xl md:text-2xl text-[#6b6965] font-normal max-w-xl mb-10 leading-relaxed tracking-tight relative z-20">
          <FormattedText text={subtitle} />
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center relative w-full"><NeuralNetworkCanvas /></div>
    </div>
  </section>
);

const Footer = ({ readinessUrl, onAdminTrigger, logoUrl }: { readinessUrl: string, onAdminTrigger: () => void, logoUrl: string }) => (
  <footer className="bg-[#f9f8f6] pt-12 pb-12 mt-0">
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="mb-24 flex flex-col md:flex-row items-center justify-between p-12 rounded-[3rem] bg-black border border-white/5 shadow-2xl shadow-black/10">
        <div className="mb-8 md:mb-0 max-w-xl">
          <h3 className="font-serif text-4xl mb-4 text-white">Evaluate your organization's potential.</h3>
          <p className="text-white/60">Discover where AI can create the most value for your team while preserving your unique human competitive edge.</p>
        </div>
        <a href={readinessUrl} target="_blank" rel="noopener noreferrer" className="h-14 px-10 rounded-full bg-secondary-orange text-white font-medium text-lg hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-xl shadow-secondary-orange/20 flex items-center gap-2">
          AI Readiness Check <span className="material-symbols-outlined">trending_up</span>
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        <div className="lg:col-span-2 pr-8">
          <div className="mb-6"><Logo className="h-14" logoUrl={logoUrl} /></div>
          <p className="text-sm text-[#6b6965] mb-6 max-w-xs">Human Centered AI Agency. We accompany companies into a future where technology serves the human being.</p>
        </div>
        <div>
          <h4 className="font-medium text-black mb-6">Legal</h4>
          <ul className="space-y-4 text-sm text-[#6b6965]">
            <li><a href="#" className="hover:text-secondary-blue transition-colors">Imprint</a></li>
            <li><a href="#" className="hover:text-secondary-blue transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-black mb-6">Connect</h4>
          <ul className="space-y-4 text-sm text-[#6b6965]">
            <li><a href="https://www.linkedin.com/in/alexanderfuerer/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-blue transition-colors flex items-center gap-2">LinkedIn <span className="material-symbols-outlined text-xs">north_east</span></a></li>
            <li><a href="https://x.com/alexanderfuerer" target="_blank" rel="noopener noreferrer" className="hover:text-secondary-orange transition-colors flex items-center gap-2">X <span className="material-symbols-outlined text-xs">north_east</span></a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 text-sm text-[#6b6965]">
        <p>© 2024 RDCL. All rights reserved.</p>
        <span onDoubleClick={onAdminTrigger} className="flex items-center gap-2 mt-4 md:mt-0 cursor-default select-none group" title="System Status">
          <span className="w-2 h-2 bg-secondary-blue rounded-full animate-pulse group-hover:scale-125 transition-transform"></span> AI Systems Online
        </span>
      </div>
    </div>
  </footer>
);

const AdminAuthModal = ({ onLogin, onClose }: { onLogin: () => void, onClose: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'rdcl2024') onLogin();
    else { setError(true); setTimeout(() => setError(false), 1000); }
  };
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className={`w-full max-w-md bg-white rounded-[2.5rem] p-12 shadow-2xl border border-black/5 transform transition-all duration-300 ${error ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl text-secondary-blue">shield_person</span>
          </div>
          <h2 className="font-serif text-3xl mb-2">Backend Access</h2>
          <p className="text-sm text-[#6b6965]">Verify admin credentials to access core systems.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="password" autoFocus placeholder="System Password"
            className={`w-full h-14 bg-[#f9f8f6] border-none rounded-2xl px-6 focus:ring-2 focus:ring-secondary-blue transition-all outline-none text-center tracking-[0.5em] font-bold ${error ? 'text-red-500 ring-2 ring-red-200' : 'text-black'}`}
            value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 h-14 rounded-2xl text-sm font-medium text-[#6b6965] hover:bg-black/5 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 h-14 bg-black text-white rounded-2xl text-sm font-medium hover:bg-secondary-blue transition-all">Authorize</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ContactModal = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("https://formsubmit.co/ajax/ale.fuerer@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name, email, message, _subject: "New Inquiry from RDCL Website", _captcha: "false" })
      });
      const result = await response.json();
      if (response.ok && (result.success === "true" || result.success === true)) setIsSuccess(true);
      else throw new Error(result.message || "Submission failed.");
    } catch (err: any) {
      setError("Delivery error: " + (err.message || "Please try again later."));
    } finally { setIsSubmitting(false); }
  };

  if (isSuccess) return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[3rem] p-16 shadow-2xl border border-black/5 text-center animate-in zoom-in-95">
        <div className="w-20 h-20 bg-secondary-green/10 rounded-full flex items-center justify-center mx-auto mb-8"><span className="material-symbols-outlined text-4xl text-secondary-green">check_circle</span></div>
        <h2 className="font-serif text-4xl mb-4">Message Sent</h2>
        <p className="text-[#6b6965] mb-10 leading-relaxed">Thank you, <span className="font-bold text-black">{name}</span>. We will get back to you shortly at <span className="font-bold text-black">{email}</span>.</p>
        <button onClick={onClose} className="h-14 px-10 bg-black text-white rounded-2xl font-medium hover:bg-secondary-blue transition-all">Close</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-[3rem] p-12 md:p-16 shadow-2xl border border-black/5 animate-in zoom-in-95">
        <div className="flex justify-between items-start mb-10">
          <div><h2 className="font-serif text-5xl mb-3">Let's Connect</h2><p className="text-[#6b6965]">Tell us about your organization's vision for AI integration.</p></div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"><span className="material-symbols-outlined">close</span></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-start gap-3"><span className="material-symbols-outlined text-lg">error</span><p>{error}</p></div>}
          <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6965]">Full Name</label><input required type="text" placeholder="John Doe" className="w-full h-14 bg-[#f9f8f6] border-none rounded-2xl px-6 focus:ring-2 focus:ring-secondary-orange transition-all outline-none text-lg" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6965]">Your Email</label><input required type="email" placeholder="name@company.com" className="w-full h-14 bg-[#f9f8f6] border-none rounded-2xl px-6 focus:ring-2 focus:ring-secondary-orange transition-all outline-none text-lg" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="space-y-2"><label className="text-[10px] font-bold uppercase tracking-widest text-[#6b6965]">Your Message</label><textarea required rows={4} placeholder="How can we help you?" className="w-full bg-[#f9f8f6] border-none rounded-2xl p-6 focus:ring-2 focus:ring-secondary-orange transition-all outline-none text-lg resize-none" value={message} onChange={(e) => setMessage(e.target.value)} /></div>
          <button type="submit" disabled={isSubmitting} className="w-full h-16 bg-black text-white rounded-2xl text-lg font-medium hover:bg-secondary-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50">{isSubmitting ? <span className="animate-pulse">Sending...</span> : <><>Send Message</><span className="material-symbols-outlined">send</span></>}</button>
        </form>
      </div>
    </div>
  );
};

const NewsletterSection = ({ onSubscribe }: { onSubscribe: (email: string) => void }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    onSubscribe(email);
    try {
      const response = await fetch("https://formsubmit.co/ajax/ale.fuerer@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, _subject: "New Newsletter Subscription", _captcha: "false" })
      });
      const result = await response.json();
      if (response.ok && (result.success === true || result.success === "true")) {
        setStatus('success'); setEmail('');
      } else {
        setStatus('success'); // Still show success locally
      }
    } catch (err) {
      setStatus('success');
    }
  };

  return (
    <section className="pt-32 pb-0 bg-[#f9f8f6]">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="bg-white rounded-[3rem] p-12 md:p-20 shadow-xl shadow-black/[0.02] border border-black/5 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="font-serif text-4xl md:text-5xl text-black mb-4">Stay at the forefront of human-centered AI.</h2>
            <p className="text-lg text-[#6b6965] font-light">Curated insights on machine intelligence and organizational evolution, delivered monthly.</p>
          </div>
          <div className="w-full lg:w-auto lg:min-w-[400px]">
            {status === 'success' ? (
              <div className="flex items-center gap-3 text-secondary-green bg-secondary-green/10 p-6 rounded-2xl animate-in fade-in zoom-in-95">
                <span className="material-symbols-outlined">verified</span>
                <p className="font-medium">You're on the list. Thank you for joining us.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative">
                <input required type="email" placeholder="Your Email Address" className="w-full h-16 bg-[#f9f8f6] border-none rounded-2xl px-8 pr-40 focus:ring-2 focus:ring-secondary-blue transition-all outline-none text-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit" disabled={status === 'submitting'} className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-xl font-medium text-sm hover:bg-secondary-blue transition-all disabled:opacity-50">
                  {status === 'submitting' ? 'Joining...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const AdminDashboard = ({ initialTranslations, subscribers, onSave, onClose, onDeleteSubscriber, onClearSubscribers }: { initialTranslations: Record<string, WebsiteData>, subscribers: Subscriber[], onSave: (t: Record<string, WebsiteData>) => void, onClose: () => void, onDeleteSubscriber: (email: string) => void, onClearSubscribers: () => void }) => {
  const [transMap, setTransMap] = useState(JSON.parse(JSON.stringify(initialTranslations)) as Record<string, WebsiteData>);
  const [activeLang, setActiveLang] = useState<'en' | 'de'>('en');
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const updateActiveData = (updater: (data: WebsiteData) => WebsiteData) => {
    setTransMap(prev => ({ ...prev, [activeLang]: updater(prev[activeLang] || INITIAL_DATA) }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: string, index?: number) => {
    const file = event.target.files?.[0]; if (!file) return;

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Maximum size is 2MB.");
      return;
    }

    try {
      setIsUploading(true);
      let finalData: string;
      if (file.type === 'application/pdf') {
        finalData = await fileToBase64(file);
      } else {
        finalData = await resizeImage(await fileToBase64(file), 800, 1000);
      }

      updateActiveData(d => {
        const next = { ...d };
        if (target === 'logo') next.logoUrl = finalData;
        else if (target === 'about-ceo') next.about.imageUrl = finalData;
        else if (target === 'service-image' && index !== undefined) next.services[index].imageUrl = finalData;
        else if (target === 'project-image' && index !== undefined) next.projects[index].image = finalData;
        else if (target === 'cv-logo' && index !== undefined) next.about.cvItems[index].logoUrl = finalData;
        else if (target === 'edu-logo' && index !== undefined) {
          if (!next.about.educationItems) next.about.educationItems = [];
          next.about.educationItems[index].logoUrl = finalData;
        }
        else if (target === 'lecturing-logo' && index !== undefined) {
          if (!next.about.lecturingItems) next.about.lecturingItems = [];
          next.about.lecturingItems[index].logoUrl = finalData;
        }
        else if (target === 'insight-pdf' && index !== undefined) {
          next.insights[index].downloadUrl = finalData;
        }
        return next;
      });
    } catch (err) { alert("Upload failed."); } finally { setIsUploading(false); }
  };

  const publish = async () => {
    try { setIsSaving(true); await DataService.save(transMap); onSave(transMap); onClose(); }
    catch (err) { alert("Publish failed: Storage limit exceeded."); } finally { setIsSaving(false); }
  };

  const data = transMap[activeLang] || INITIAL_DATA;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col text-white font-sans">
      <div className="flex h-16 items-center justify-between px-8 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-6"><Logo className="h-6 filter invert grayscale" /><div className="h-8 w-px bg-white/10"></div>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button onClick={() => setActiveLang('en')} className={`px-4 py-1 rounded text-xs font-bold ${activeLang === 'en' ? 'bg-white text-black' : 'text-white/40'}`}>EN</button>
            <button onClick={() => setActiveLang('de')} className={`px-4 py-1 rounded text-xs font-bold ${activeLang === 'de' ? 'bg-white text-black' : 'text-white/40'}`}>DE</button>
          </div>
        </div>
        <div className="flex items-center gap-4"><button onClick={onClose} className="text-white/60 text-sm hover:text-white">Cancel</button><button disabled={isSaving || isUploading} onClick={publish} className="h-10 px-6 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-50">{isSaving ? 'Publishing...' : 'Publish'}</button></div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r border-white/5 p-4 flex flex-col gap-1 overflow-y-auto bg-black/20">
          {[
            { id: 'general', label: 'General', icon: 'settings' },
            { id: 'mission', label: 'Mission', icon: 'visibility' },
            { id: 'services', label: 'Services', icon: 'architecture' },
            { id: 'portfolio', label: 'Portfolio', icon: 'gallery_thumbnail' },
            { id: 'insights', label: 'Insights', icon: 'library_books' },
            { id: 'about', label: 'About', icon: 'person' },
            { id: 'subscribers', label: 'Subscribers', icon: 'mail_outline' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === tab.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>{tab.label}{tab.id === 'subscribers' && subscribers.length > 0 && <span className="ml-auto bg-secondary-blue text-[10px] px-2 py-0.5 rounded-full">{subscribers.length}</span>}
            </button>
          ))}

          <div className="mt-auto p-5 bg-white/10 rounded-2xl border border-white/5 mx-2 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-secondary-blue text-lg">info</span>
              <p className="text-[10px] text-white font-bold uppercase tracking-widest">Editor Hint</p>
            </div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              To add links in text fields, use markdown format:<br />
              <code className="text-secondary-blue bg-black px-1 rounded">[Text](URL)</code>
            </p>
          </div>
        </div>
        <div className="flex-1 bg-white/[0.02] overflow-y-auto p-12">
          <div className="max-w-4xl mx-auto space-y-12 pb-32">
            {activeTab === 'general' && (
              <section className="space-y-8">
                <h3 className="text-xl font-serif">General Settings</h3>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase text-white/40">Website Logo</label>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-6">
                    <div className="h-20 w-auto bg-white/10 rounded-lg p-2 flex items-center justify-center">
                      <img src={data.logoUrl || HARDCODED_LOGO_URL} className="h-full w-auto object-contain mix-blend-multiply" alt="Logo Preview" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-white/60 mb-2">Upload a new logo (PNG/JPG, max 2MB).</p>
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-200 transition-colors">
                        <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'logo')} />
                        <span className="material-symbols-outlined text-sm">upload</span> Upload Logo
                      </label>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'mission' && (
              <section className="space-y-8">
                <CMSField label="Mission Heading" value={data.mission.heading} onChange={v => updateActiveData(d => ({ ...d, mission: { ...d.mission, heading: v } }))} textarea />
                <CMSField label="Mission Subheading" value={data.mission.subheading} onChange={v => updateActiveData(d => ({ ...d, mission: { ...d.mission, subheading: v } }))} textarea />
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <label className="text-[10px] uppercase text-white/40">Mission Pillars</label>
                  {data.mission.pillars.map((p, idx) => (
                    <div key={idx} className="bg-white/5 p-4 rounded-xl space-y-2">
                      <CMSField label={`Pillar ${idx + 1} Title`} value={p.title} onChange={v => updateActiveData(d => { const n = [...d.mission.pillars]; n[idx].title = v; return { ...d, mission: { ...d.mission, pillars: n } }; })} />
                      <CMSField label={`Pillar ${idx + 1} Text`} value={p.text} onChange={v => updateActiveData(d => { const n = [...d.mission.pillars]; n[idx].text = v; return { ...d, mission: { ...d.mission, pillars: n } }; })} textarea />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'services' && (
              <section className="space-y-8">
                <div className="flex justify-between items-center"><h3 className="text-xl font-serif">Services</h3><button onClick={() => updateActiveData(d => ({ ...d, services: [...d.services, { id: Date.now().toString(), icon: 'engineering', title: 'New', mainTitle: 'Service', description: '', resultLabel: '', resultValue: '', scopeTitle: '', scopeItems: [], ctaText: '' }] }))} className="text-xs text-secondary-blue font-bold">+ Add Service</button></div>
                {data.services.map((s, idx) => (
                  <div key={s.id} className="bg-white/5 p-6 rounded-2xl space-y-4 group relative">
                    <button className="absolute top-4 right-4 text-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => updateActiveData(d => ({ ...d, services: d.services.filter((_, i) => i !== idx) }))}><span className="material-symbols-outlined">delete</span></button>
                    <div className="grid grid-cols-2 gap-4">
                      <CMSField label="Card Subtitle" value={s.title} onChange={v => updateActiveData(d => { const n = [...d.services]; n[idx].title = v; return { ...d, services: n }; })} />
                      <CMSField label="Main Title" value={s.mainTitle} onChange={v => updateActiveData(d => { const n = [...d.services]; n[idx].mainTitle = v; return { ...d, services: n }; })} />
                    </div>
                    <CMSField label="Description" value={s.description} onChange={v => updateActiveData(d => { const n = [...d.services]; n[idx].description = v; return { ...d, services: n }; })} textarea />
                    <div className="grid grid-cols-2 gap-4">
                      <CMSField label="Result Label" value={s.resultLabel} onChange={v => updateActiveData(d => { const n = [...d.services]; n[idx].resultLabel = v; return { ...d, services: n }; })} />
                      <CMSField label="Result Value" value={s.resultValue} onChange={v => updateActiveData(d => { const n = [...d.services]; n[idx].resultValue = v; return { ...d, services: n }; })} />
                    </div>
                  </div>
                ))}
              </section>
            )}

            {activeTab === 'portfolio' && (
              <section className="space-y-8">
                <CMSField label="Portfolio Heading" value={data.projectsHeading} onChange={v => updateActiveData(d => ({ ...d, projectsHeading: v }))} />
                <CMSField label="Portfolio Intro" value={data.projectsIntro} onChange={v => updateActiveData(d => ({ ...d, projectsIntro: v }))} textarea />
                <div className="flex justify-between items-center pt-8 border-t border-white/10"><h3 className="text-xl font-serif">Projects</h3><button onClick={() => updateActiveData(d => ({ ...d, projects: [...d.projects, { id: Date.now().toString(), title: 'New', category: 'Category', image: '', description: '' }] }))} className="text-xs text-secondary-green font-bold">+ Add Project</button></div>
                {data.projects.map((p, idx) => (
                  <div key={p.id} className="bg-white/5 p-6 rounded-2xl space-y-4 group relative">
                    <button className="absolute top-4 right-4 text-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => updateActiveData(d => ({ ...d, projects: d.projects.filter((_, i) => i !== idx) }))}><span className="material-symbols-outlined">delete</span></button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-[10px] uppercase text-white/40">Project Image</label><div className="aspect-video bg-white/10 rounded-lg overflow-hidden relative cursor-pointer group/img">{p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-white/20">image</span></div>}<label className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'project-image', idx)} /><span className="material-symbols-outlined">upload</span></label></div></div>
                      <div className="space-y-4">
                        <CMSField label="Project Title" value={p.title} onChange={v => updateActiveData(d => { const n = [...d.projects]; n[idx].title = v; return { ...d, projects: n }; })} />
                        <CMSField label="Category" value={p.category} onChange={v => updateActiveData(d => { const n = [...d.projects]; n[idx].category = v; return { ...d, projects: n }; })} />
                      </div>
                    </div>
                    <CMSField label="Description" value={p.description} onChange={v => updateActiveData(d => { const n = [...d.projects]; n[idx].description = v; return { ...d, projects: n }; })} textarea />
                  </div>
                ))}
              </section>
            )}

            {activeTab === 'insights' && (
              <section className="space-y-8">
                <div className="flex justify-between items-center"><h3 className="text-xl font-serif">Insights Library</h3><button onClick={() => updateActiveData(d => ({ ...d, insights: [...d.insights, { id: Date.now().toString(), title: 'New', type: 'Checklist', description: '', downloadUrl: '#' }] }))} className="text-xs text-secondary-orange font-bold">+ Add Insight</button></div>
                {data.insights.map((ins, idx) => (
                  <div key={ins.id} className="bg-white/5 p-6 rounded-2xl space-y-4 group relative">
                    <button className="absolute top-4 right-4 text-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => updateActiveData(d => ({ ...d, insights: d.insights.filter((_, i) => i !== idx) }))}><span className="material-symbols-outlined">delete</span></button>
                    <div className="grid grid-cols-2 gap-4">
                      <CMSField label="Title" value={ins.title} onChange={v => updateActiveData(d => { const n = [...d.insights]; n[idx].title = v; return { ...d, insights: n }; })} />
                      <div className="space-y-2"><label className="text-[10px] uppercase text-white/40">Type</label><select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none" value={ins.type} onChange={e => updateActiveData(d => { const n = [...d.insights]; n[idx].type = e.target.value as any; return { ...d, insights: n }; })}><option value="Checklist">Checklist</option><option value="Report">Report</option><option value="Whitepaper">Whitepaper</option></select></div>
                    </div>
                    <div className="flex gap-4 items-end">
                      <div className="flex-grow">
                        <CMSField label="Download URL / File" value={ins.downloadUrl} onChange={v => updateActiveData(d => { const n = [...d.insights]; n[idx].downloadUrl = v; return { ...d, insights: n }; })} />
                      </div>
                      <label className="h-[54px] px-4 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all group/pdf border border-white/5 shrink-0" title="Upload PDF">
                        <input type="file" className="hidden" accept=".pdf" onChange={e => handleFileUpload(e, 'insight-pdf', idx)} />
                        <span className="material-symbols-outlined text-white/40 group-hover/pdf:text-white">upload_file</span>
                      </label>
                    </div>
                    <CMSField label="Brief Description" value={ins.description} onChange={v => updateActiveData(d => { const n = [...d.insights]; n[idx].description = v; return { ...d, insights: n }; })} />
                  </div>
                ))}
              </section>
            )}

            {activeTab === 'about' && (
              <section className="space-y-12">
                <div className="grid grid-cols-2 gap-8"><div className="space-y-4"><CMSField label="Founder Name" value={data.about.ceoName} onChange={v => updateActiveData(d => ({ ...d, about: { ...d.about, ceoName: v } }))} /><CMSField label="Title" value={data.about.ceoTitle} onChange={v => updateActiveData(d => ({ ...d, about: { ...d.about, ceoTitle: v } }))} /></div><div className="space-y-2"><label className="text-[10px] uppercase text-white/40">Portrait</label><div className="aspect-square w-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative group overflow-hidden">{data.about.imageUrl ? <img src={data.about.imageUrl} className="w-full h-full object-cover" /> : <span className="text-white/20 text-xs">No Photo</span>}<label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'about-ceo')} /><span className="material-symbols-outlined">upload</span></label></div></div></div>
                <CMSField label="Bio" value={data.about.bio} onChange={v => updateActiveData(d => ({ ...d, about: { ...d.about, bio: v } }))} textarea />
                <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center"><label className="text-[10px] uppercase text-white/40">Career Milestones</label><button className="text-xs text-secondary-blue font-bold" onClick={() => updateActiveData(d => ({ ...d, about: { ...d.about, cvItems: [...d.about.cvItems, { year: "2024", role: "Role", company: "Company" }] } }))}>+ Add</button></div>
                  {data.about.cvItems.map((item, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl flex gap-4 items-center group relative">
                      <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500/40" onClick={() => updateActiveData(d => ({ ...d, about: { ...d.about, cvItems: d.about.cvItems.filter((_, idx) => idx !== i) } }))}><span className="material-symbols-outlined text-sm">delete</span></button>
                      <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden relative cursor-pointer group/logo flex-shrink-0">
                        {item.logoUrl ? <img src={item.logoUrl} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-white/20 text-sm">image</span></div>}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                          <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'cv-logo', i)} />
                          <span className="material-symbols-outlined text-xs">upload</span>
                        </label>
                      </div>
                      <input className="w-24 bg-transparent border-none p-0 text-sm outline-none text-white/40" value={item.year} onChange={e => updateActiveData(d => { const n = [...d.about.cvItems]; n[i].year = e.target.value; return { ...d, about: { ...d.about, cvItems: n } }; })} />
                      <input className="flex-grow bg-transparent border-none p-0 text-sm outline-none font-bold" value={item.role} onChange={e => updateActiveData(d => { const n = [...d.about.cvItems]; n[i].role = e.target.value; return { ...d, about: { ...d.about, cvItems: n } }; })} />
                      <input className="flex-grow bg-transparent border-none p-0 text-sm outline-none text-white/60" value={item.company} onChange={e => updateActiveData(d => { const n = [...d.about.cvItems]; n[i].company = e.target.value; return { ...d, about: { ...d.about, cvItems: n } }; })} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === 'subscribers' && (
              <section className="space-y-8">
                <div className="flex justify-between items-center"><div><h3 className="text-xl font-serif">Mailing List</h3><p className="text-sm text-white/40">Captured Leads</p></div><button onClick={onClearSubscribers} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 flex items-center gap-2"><span className="material-symbols-outlined text-sm">delete_sweep</span> Clear All</button></div>
                <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                  {subscribers.length === 0 ? <div className="p-12 text-center text-white/30 italic">No subscribers.</div> :
                    <table className="w-full text-left text-sm">
                      <thead><tr className="bg-white/5 text-[10px] uppercase text-white/40"><th className="px-6 py-4">Email</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
                      <tbody className="divide-y divide-white/5">{subscribers.map((sub, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors"><td className="px-6 py-4 font-medium">{sub.email}</td><td className="px-6 py-4 text-white/40">{new Date(sub.date).toLocaleDateString()}</td><td className="px-6 py-4 text-right"><button onClick={() => onDeleteSubscriber(sub.email)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><span className="material-symbols-outlined text-sm">delete</span></button></td></tr>
                      ))}</tbody>
                    </table>}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Page Content Sections ---

const MissionSection = ({ content }: { content: MissionContent }) => (
  <section className="py-32 bg-[#f9f8f6]">
    <div className="mx-auto max-w-[1400px] px-6">
      <div className="max-w-[1100px] mb-20">
        <h2 className="font-serif text-6xl md:text-[6.5rem] text-black leading-[0.9] tracking-tight mb-4">
          <FormattedText text={content.heading} />
        </h2>
        <div className="text-xl md:text-2xl text-[#6b6965] font-normal leading-relaxed max-w-2xl">
          <FormattedText text={content.subheading} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-32">{content.pillars.map((pillar, idx) => (
        <div key={idx} className="group space-y-6">
          <div className="flex items-center gap-4"><span className={`text-[10px] font-bold tracking-[0.2em] ${idx % 3 === 0 ? 'text-secondary-orange' : idx % 3 === 1 ? 'text-secondary-blue' : 'text-secondary-green'}`}>0{idx + 1}</span><div className="h-[1px] flex-grow bg-black/5"></div></div>
          <h3 className="font-serif text-3xl text-black group-hover:translate-x-2 transition-transform">{pillar.title}</h3>
          <div className="text-[#6b6965] leading-relaxed text-[15px] font-medium">
            <FormattedText text={pillar.text} />
          </div>
        </div>
      ))}</div>
    </div>
  </section>
);

const ServiceSection = ({ services }: { services: Service[] }) => (
  <section className="py-32 bg-white"><div className="mx-auto max-w-[1200px] px-6"><div className="space-y-40">{services.map((service, index) => {
    const colorClass = index % 3 === 0 ? 'text-secondary-blue' : index % 3 === 1 ? 'text-secondary-orange' : 'text-secondary-green';
    const bgClass = index % 3 === 0 ? 'bg-secondary-blue' : index % 3 === 1 ? 'bg-secondary-orange' : 'bg-secondary-green';

    return (
      <div key={service.id} className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start group/service">
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="aspect-[4/5] bg-[#f5f1ed] rounded-[2.5rem] relative flex flex-col items-center justify-center p-8 transition-transform duration-500 group-hover/service:scale-[1.02] shadow-sm">
            <div className="bg-white p-5 rounded-[1.5rem] shadow-sm mb-6 border border-black/5 w-20 h-20 flex items-center justify-center">
              {service.imageUrl ? <img src={service.imageUrl} className="w-full h-full object-contain" alt={service.title} /> : <span className={`material-symbols-outlined text-4xl ${colorClass}`}>{service.icon || 'engineering'}</span>}
            </div>
            <h3 className="font-serif text-4xl text-black text-center mb-16 leading-tight max-w-[200px]">{service.title}</h3>
            <div className="bg-white px-8 py-6 rounded-[1.2rem] shadow-[0_15px_30px_rgba(0,0,0,0.12)] flex flex-col items-center border border-black/[0.03] absolute bottom-12 w-[calc(100%-4rem)]">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#6b6965] uppercase mb-1 font-sans">{service.resultLabel}</span>
              <p className="font-serif italic text-[1.4rem] text-black text-center">
                <FormattedText text={service.resultValue} />
              </p>
            </div>
          </div>
        </div>
        <div className="w-full lg:flex-grow flex flex-col">
          <h2 className="font-serif text-5xl md:text-6xl text-black mb-8 leading-[1.1]">{service.mainTitle}</h2>
          <div className="text-xl text-[#6b6965] font-light leading-relaxed mb-10 max-w-2xl">
            <FormattedText text={service.description} />
          </div>
          <div className="bg-[#f9f8f6] p-10 rounded-[2.5rem] mb-10 border border-black/5">
            <div className="flex items-center gap-3 mb-8"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-white ${bgClass}`}><span className="material-symbols-outlined text-sm font-bold">check</span></div><h4 className="font-bold text-xs tracking-widest uppercase">{service.scopeTitle || 'Scope'}</h4></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {service.scopeItems?.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-1.5 h-1.5 rounded-full ${bgClass} mt-2.5 flex-shrink-0 opacity-20`}></div>
                  <div className="text-[15px] text-[#4a4846] font-medium">
                    <FormattedText text={item} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className={`flex items-center gap-2 group text-black font-semibold hover:${colorClass} transition-all`}>
            <span className="text-[15px] font-bold">{service.ctaText || 'Learn More'}</span>
            <span className={`material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform ${colorClass}`}>arrow_forward</span>
          </button>
        </div>
      </div>
    );
  })}</div></div></section>
);

const ProjectGrid = ({ projects, heading, intro }: { projects: Project[], heading: string, intro: string }) => (
  <section className="py-32"><div className="mx-auto max-w-[1400px] px-6">
    <div className="text-center mb-24 max-w-3xl mx-auto">
      <h2 className="font-serif text-5xl md:text-6xl text-black mb-8">{heading}</h2>
      <div className="text-lg text-[#6b6965] font-light leading-relaxed">
        <FormattedText text={intro} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">{projects.map((p, idx) => (
      <div key={p.id} className="group cursor-pointer">
        <div className="aspect-[4/3] rounded-3xl overflow-hidden mb-6 relative shadow-lg shadow-black/5"><img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
        <h3 className="font-serif text-2xl text-black mb-2 group-hover:text-secondary-blue transition-colors">{p.title}</h3>
        <div className="text-[#6b6965] text-sm leading-relaxed">
          <FormattedText text={p.description} />
        </div>
      </div>
    ))}</div>
  </div></section>
);

const InsightsSection = ({ insights }: { insights: Insight[] }) => (
  <section className="py-32 bg-[#111111] text-white"><div className="mx-auto max-w-[1400px] px-6"><div className="mb-20"><h2 className="font-serif text-5xl mb-6">Strategic Insights</h2><p className="text-gray-400 max-w-xl">Frameworks for <span className="text-secondary-blue">Human-Centered AI</span>.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-8">{insights.map((i, idx) => (
    <div key={i.id} className="p-8 border border-white/10 rounded-3xl group flex items-start justify-between hover:bg-white/[0.02] hover:border-white/30 transition-all">
      <div className="max-w-md">
        <span className={`text-xs font-bold tracking-widest uppercase mb-3 block ${idx % 2 === 0 ? 'text-secondary-blue' : 'text-secondary-orange'}`}>{i.type}</span>
        <h3 className="text-2xl font-serif mb-3">{i.title}</h3>
        <div className="text-gray-400 text-sm mb-6">
          <FormattedText text={i.description} />
        </div>
        <a href={i.downloadUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white font-medium hover:underline">View <span className="material-symbols-outlined text-sm">open_in_new</span></a>
      </div>
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 group-hover:text-white/80 transition-colors"><span className="material-symbols-outlined text-4xl">description</span></div>
    </div>
  ))}</div></div></section>
);

const AboutSection = ({ content }: { content: AboutContent }) => (
  <section className="py-32"><div className="mx-auto max-w-[1400px] px-6"><div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
    <div className="order-2 lg:order-1"><span className="text-xs font-bold text-secondary-orange uppercase mb-6 block">The Founder</span><h2 className="font-serif text-5xl md:text-7xl mb-8 leading-tight">{content.ceoName}<span className="block text-2xl font-sans font-medium text-[#6b6965] mt-2 italic">{content.ceoTitle}</span></h2>
      <div className="relative mb-12">
        <div className="absolute -left-6 top-0 bottom-0 w-1 bg-secondary-orange/30"></div>
        <div className="text-xl text-[#6b6965] font-light leading-relaxed italic">
          "<FormattedText text={content.bio} />"
        </div>
      </div>
      <div className="space-y-8"><h3 className="font-serif text-3xl">Core Beliefs</h3><ul className="space-y-4">{content.beliefs?.map((b, i) => (<li key={i} className="flex items-center gap-4 text-lg group"><div className="w-2 h-2 rounded-full transition-all bg-secondary-orange group-hover:scale-150"></div>{b}</li>))}</ul></div>
      <div className="mt-20"><h3 className="font-serif text-3xl mb-8 text-secondary-blue">Experience</h3><div className="space-y-6">{content.cvItems?.map((item, i) => (<div key={i} className="flex items-center gap-6 border-b border-black/5 pb-4 group">
        {item.logoUrl && <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 p-1.5 grayscale group-hover:grayscale-0 transition-all"><img src={item.logoUrl} alt={item.company} className="w-full h-full object-contain" /></div>}
        <div className="flex-grow flex justify-between items-center"><div><p className="font-bold text-black group-hover:text-secondary-blue transition-colors">{item.role}</p><p className="text-[#6b6965]">{item.company}</p></div><span className="text-secondary-blue/50 font-mono text-sm font-bold">{item.year}</span></div>
      </div>))}</div></div>
      {content.lecturingItems && content.lecturingItems.length > 0 && <div className="mt-20"><h3 className="font-serif text-3xl mb-8 text-secondary-orange">Lecturing</h3><div className="space-y-6">{content.lecturingItems.map((item, i) => (<div key={i} className="flex items-center gap-6 border-b border-black/5 pb-4 group">
        {item.logoUrl && <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 p-1.5 grayscale group-hover:grayscale-0 transition-all"><img src={item.logoUrl} alt={item.institution} className="w-full h-full object-contain" /></div>}
        <div className="flex-grow flex justify-between items-center"><div><p className="font-bold text-black group-hover:text-secondary-orange transition-colors">{item.role}</p><p className="text-[#6b6965]">{item.institution}</p></div><span className="text-secondary-orange/50 font-mono text-sm font-bold">{item.year}</span></div>
      </div>))}</div></div>}
      {content.educationItems && content.educationItems.length > 0 && <div className="mt-20"><h3 className="font-serif text-3xl mb-8 text-secondary-green">Education</h3><div className="space-y-6">{content.educationItems.map((item, i) => (<div key={i} className="flex items-center gap-6 border-b border-black/5 pb-4 group">
        {item.logoUrl && <div className="w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white shadow-sm border border-black/5 p-1.5 grayscale group-hover:grayscale-0 transition-all"><img src={item.logoUrl} alt={item.institution} className="w-full h-full object-contain" /></div>}
        <div className="flex-grow flex justify-between items-center"><div><p className="font-bold text-black group-hover:text-secondary-green transition-colors">{item.degree}</p><p className="text-[#6b6965]">{item.institution}</p></div><span className="text-secondary-green/50 font-mono text-sm font-bold">{item.year}</span></div>
      </div>))}</div></div>}
    </div>
    <div className="order-1 lg:order-2"><div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl relative"><img src={content.imageUrl} alt={content.ceoName} className="w-full h-full object-cover" /></div></div>
  </div></div></section>
);

const App: React.FC = () => {
  const [translations, setTranslations] = useState<Record<string, WebsiteData>>({});
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'de'>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const auth = sessionStorage.getItem('rdcl_admin_auth');
      if (auth === 'true') setIsAuthenticated(true);
      const saved = await DataService.load();
      setTranslations(saved || { en: INITIAL_DATA });
      setSubscribers(DataService.loadSubscribers());
      setIsLoading(false);
    })();
  }, []);

  const handleNewSubscriber = (email: string) => {
    setSubscribers(prev => {
      if (prev.some(s => s.email === email)) return prev;
      const next = [{ email, date: new Date().toISOString() }, ...prev];
      DataService.saveSubscribers(next);
      return next;
    });
  };

  const translateToGerman = async (sourceData: WebsiteData) => {
    if (translations.de || isTranslating) return;
    try {
      setIsTranslating(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Translate this RDCL website JSON to professional German. Schema: ${JSON.stringify(sourceData)}`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectsHeading: { type: Type.STRING }, projectsIntro: { type: Type.STRING },
              mission: { type: Type.OBJECT, properties: { heading: { type: Type.STRING }, subheading: { type: Type.STRING }, pillars: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, text: { type: Type.STRING } } } } } },
              services: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, mainTitle: { type: Type.STRING }, description: { type: Type.STRING }, resultLabel: { type: Type.STRING }, resultValue: { type: Type.STRING }, scopeTitle: { type: Type.STRING }, scopeItems: { type: Type.ARRAY, items: { type: Type.STRING } }, ctaText: { type: Type.STRING } } } },
              about: { type: Type.OBJECT, properties: { ceoTitle: { type: Type.STRING }, bio: { type: Type.STRING }, beliefs: { type: Type.ARRAY, items: { type: Type.STRING } }, cvItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { role: { type: Type.STRING }, company: { type: Type.STRING } } } }, lecturingItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { role: { type: Type.STRING }, institution: { type: Type.STRING } } } }, educationItems: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { degree: { type: Type.STRING }, institution: { type: Type.STRING } } } } } }
            }
          }
        }
      });
      const res = JSON.parse(response.text);
      const de: WebsiteData = {
        ...sourceData, ...res,
        about: {
          ...sourceData.about, ...res.about,
          cvItems: sourceData.about.cvItems.map((item, i) => ({ ...item, role: res.about.cvItems[i]?.role || item.role, company: res.about.cvItems[i]?.company || item.company })),
          lecturingItems: (sourceData.about.lecturingItems || []).map((item, i) => ({ ...item, role: res.about.lecturingItems?.[i]?.role || item.role, institution: res.about.lecturingItems?.[i]?.institution || item.institution })),
          educationItems: (sourceData.about.educationItems || []).map((item, i) => ({ ...item, degree: res.about.educationItems?.[i]?.degree || item.degree, institution: res.about.educationItems?.[i]?.institution || item.institution }))
        }
      };
      setTranslations(p => { const next = { ...p, de }; DataService.save(next); return next; });
    } catch (err) { console.error(err); } finally { setIsTranslating(false); }
  };

  const currentData = useMemo(() => translations[currentLanguage] || translations.en || INITIAL_DATA, [currentLanguage, translations]);
  const handleLanguageChange = (lang: 'en' | 'de') => { setCurrentLanguage(lang); if (lang === 'de') translateToGerman(translations.en || INITIAL_DATA); };

  if (isLoading) return <div className="min-h-screen bg-[#f9f8f6] flex items-center justify-center font-serif text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#f9f8f6] text-[#191716] font-sans selection:bg-secondary-orange selection:text-white">
      <Navbar onNavigate={setCurrentView} currentView={currentView} openCms={() => setIsAdminOpen(true)} openContact={() => setIsContactOpen(true)} isAuthenticated={isAuthenticated} currentLanguage={currentLanguage} setLanguage={handleLanguageChange} isTranslating={isTranslating} logoUrl={currentData.logoUrl} />
      <main className="pt-20">
        {currentView === 'home' ? <><Hero subtitle={currentData.mission.subheading} logoUrl={currentData.logoUrl} /><MissionSection content={currentData.mission} /><ServiceSection services={currentData.services} /><ProjectGrid projects={currentData.projects} heading={currentData.projectsHeading} intro={currentData.projectsIntro} /><InsightsSection insights={currentData.insights} /><NewsletterSection onSubscribe={handleNewSubscriber} /></> :
          currentView === 'mission' ? <MissionSection content={currentData.mission} /> :
            currentView === 'services' ? <ServiceSection services={currentData.services} /> :
              currentView === 'projects' ? <ProjectGrid projects={currentData.projects} heading={currentData.projectsHeading} intro={currentData.projectsIntro} /> :
                currentView === 'insights' ? <InsightsSection insights={currentData.insights} /> :
                  currentView === 'about' ? <AboutSection content={currentData.about} /> : <Hero subtitle={currentData.mission.subheading} logoUrl={currentData.logoUrl} />}
      </main>
      <Footer readinessUrl={currentData.aiReadinessUrl} onAdminTrigger={() => setIsAuthModalOpen(true)} logoUrl={currentData.logoUrl} />
      {isAuthModalOpen && <AdminAuthModal onLogin={() => { sessionStorage.setItem('rdcl_admin_auth', 'true'); setIsAuthenticated(true); setIsAuthModalOpen(false); setIsAdminOpen(true); }} onClose={() => setIsAuthModalOpen(false)} />}
      {isAdminOpen && isAuthenticated && <AdminDashboard initialTranslations={translations} subscribers={subscribers} onSave={setTranslations} onClose={() => setIsAdminOpen(false)} onDeleteSubscriber={(e) => { const n = subscribers.filter(s => s.email !== e); setSubscribers(n); DataService.saveSubscribers(n); }} onClearSubscribers={() => { if (confirm("Clear list?")) { setSubscribers([]); DataService.saveSubscribers([]); } }} />}
      {isContactOpen && <ContactModal onClose={() => setIsContactOpen(false)} />}
    </div>
  );
};
export default App;

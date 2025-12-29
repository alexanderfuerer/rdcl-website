import React, { useState } from 'react';
import { INITIAL_DATA } from '../../constants';
import { WebsiteData } from '../../types';
import { DataService, Subscriber, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Logo } from '../ui/Logo';
import { CMSField } from './CMSField';
import { fileToBase64, resizeImage } from '../../utils/image';

interface AdminDashboardProps {
    initialTranslations: Record<string, WebsiteData>;
    subscribers: Subscriber[];
    onSave: (t: Record<string, WebsiteData>) => void;
    onClose: () => void;
    onDeleteSubscriber: (email: string) => void;
    onClearSubscribers: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    initialTranslations,
    subscribers,
    onSave,
    onClose,
    onDeleteSubscriber,
    onClearSubscribers
}) => {
    const [transMap, setTransMap] = useState(JSON.parse(JSON.stringify(initialTranslations)) as Record<string, WebsiteData>);
    // Hardcoded to 'en' for single language support
    const activeLang = 'en';
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const updateActiveData = (updater: (data: WebsiteData) => WebsiteData) => {
        setTransMap(prev => ({ ...prev, [activeLang]: updater(prev[activeLang] || INITIAL_DATA) }));
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, target: string, index?: number) => {
        const file = event.target.files?.[0]; if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert("File is too large. Maximum size is 2MB.");
            return;
        }

        try {
            setIsUploading(true);
            let finalData: string;

            // Helper to upload to Firebase Storage
            const uploadToStorage = async (file: File, path: string): Promise<string> => {
                const storageRef = ref(storage, path);
                await uploadBytes(storageRef, file);
                return await getDownloadURL(storageRef);
            };

            if (target === 'project-pdf' && index !== undefined) {
                // Upload PDF to Firebase Storage
                const filename = `projects/${Date.now()}_${file.name}`;
                finalData = await uploadToStorage(file, filename);
                console.log('PDF Uploaded, URL:', finalData);
            } else if (file.type === 'application/pdf') {
                finalData = await fileToBase64(file);
            } else {
                finalData = await resizeImage(await fileToBase64(file), 800, 1000);
            }

            updateActiveData(d => {
                const next = { ...d };
                if (target === 'logo') next.logoUrl = finalData;
                else if (target === 'about-ceo') next.about = { ...next.about, imageUrl: finalData };
                else if (target === 'service-image' && index !== undefined) {
                    const services = [...next.services];
                    services[index] = { ...services[index], imageUrl: finalData };
                    next.services = services;
                }
                else if (target === 'project-image' && index !== undefined) {
                    const projects = [...next.projects];
                    projects[index] = { ...projects[index], image: finalData };
                    next.projects = projects;
                }
                else if (target === 'project-pdf' && index !== undefined) {
                    const projects = [...next.projects];
                    projects[index] = { ...projects[index], pdfUrl: finalData };
                    next.projects = projects;
                }
                else if (target === 'cv-logo' && index !== undefined) {
                    const cvItems = [...next.about.cvItems];
                    cvItems[index] = { ...cvItems[index], logoUrl: finalData };
                    next.about = { ...next.about, cvItems };
                }
                else if (target === 'edu-logo' && index !== undefined) {
                    if (!next.about.educationItems) next.about.educationItems = [];
                    const eduItems = [...next.about.educationItems];
                    eduItems[index] = { ...eduItems[index], logoUrl: finalData };
                    next.about = { ...next.about, educationItems: eduItems };
                }
                else if (target === 'lecturing-logo' && index !== undefined) {
                    if (!next.about.lecturingItems) next.about.lecturingItems = [];
                    const lecItems = [...next.about.lecturingItems];
                    lecItems[index] = { ...lecItems[index], logoUrl: finalData };
                    next.about = { ...next.about, lecturingItems: lecItems };
                }
                else if (target === 'insight-pdf' && index !== undefined) {
                    const insights = [...next.insights];
                    insights[index] = { ...insights[index], downloadUrl: finalData };
                    next.insights = insights;
                }
                return next;
            });
        } catch (err) {
            console.error(err);
            alert("Upload failed. Make sure Firebase Storage is enabled in your console.");
        } finally { setIsUploading(false); }
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
                    <span className="text-xs font-bold text-white/40 tracking-widest uppercase">Content Management</span>
                </div>
                <div className="flex items-center gap-4"><button onClick={onClose} className="text-white/60 text-sm hover:text-white">Cancel</button><button disabled={isSaving || isUploading} onClick={publish} className="h-10 px-6 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-50">{isSaving ? 'Publishing...' : 'Publish'}</button></div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <div className="w-72 border-r border-white/5 p-4 flex flex-col gap-1 overflow-y-auto bg-black/20">
                    {[
                        { id: 'general', label: 'General', icon: 'settings' },
                        { id: 'mission', label: 'Mission', icon: 'visibility' },
                        { id: 'services', label: 'Services', icon: 'architecture' },
                        { id: 'portfolio', label: 'Portfolio', icon: 'gallery_thumbnail' },
                        { id: 'insights', label: 'Insights', icon: 'library_books' },
                        { id: 'partners', label: 'Partners', icon: 'handshake' },
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
                                            <img src={data.logoUrl} className="h-full w-auto object-contain mix-blend-multiply" alt="Logo Preview" />
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
                                <div className="pt-8 border-t border-white/10">
                                    <CMSField
                                        label="AI Readiness Check URL"
                                        value={data.aiReadinessUrl}
                                        onChange={v => updateActiveData(d => ({ ...d, aiReadinessUrl: v }))}
                                    />
                                    <p className="text-[10px] text-white/40 mt-2 italic">This URL is linked to the "AI Readiness Check" button in the footer.</p>
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
                                                <div className="flex gap-2 items-end">
                                                    <div className="flex-grow">
                                                        <CMSField label="PDF URL (Optional)" value={p.pdfUrl || ''} onChange={v => updateActiveData(d => { const n = [...d.projects]; n[idx].pdfUrl = v; return { ...d, projects: n }; })} />
                                                    </div>
                                                    <label className="h-[54px] px-4 bg-white/10 rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all group/pdf border border-white/5 shrink-0" title="Upload PDF">
                                                        <input type="file" className="hidden" accept=".pdf" onChange={e => handleFileUpload(e, 'project-pdf', idx)} />
                                                        <span className="material-symbols-outlined text-white/40 group-hover/pdf:text-white">upload_file</span>
                                                    </label>
                                                </div>
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

                        {activeTab === 'partners' && (
                            <section className="space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-serif">Partners</h3>
                                    <button
                                        onClick={() => updateActiveData(d => ({ ...d, partners: [...(d.partners || []), { name: 'New Partner', url: '' }] }))}
                                        className="text-xs text-secondary-blue font-bold"
                                    >
                                        + Add Partner
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {(data.partners || []).map((partner, idx) => (
                                        <div key={idx} className="bg-white/5 p-6 rounded-2xl flex gap-4 items-end group relative">
                                            <button
                                                className="absolute top-4 right-4 text-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => updateActiveData(d => ({ ...d, partners: d.partners.filter((_, i) => i !== idx) }))}
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                            <div className="flex-grow grid grid-cols-2 gap-4">
                                                <CMSField
                                                    label="Partner Name"
                                                    value={partner.name}
                                                    onChange={v => updateActiveData(d => {
                                                        const n = [...(d.partners || [])];
                                                        n[idx].name = v;
                                                        return { ...d, partners: n };
                                                    })}
                                                />
                                                <CMSField
                                                    label="Partner URL (Optional)"
                                                    value={partner.url || ''}
                                                    onChange={v => updateActiveData(d => {
                                                        const n = [...(d.partners || [])];
                                                        n[idx].url = v;
                                                        return { ...d, partners: n };
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeTab === 'about' && (
                            <section className="space-y-12">
                                <div className="grid grid-cols-2 gap-8"><div className="space-y-4"><CMSField label="Founder Name" value={data.about.ceoName} onChange={v => updateActiveData(d => ({ ...d, about: { ...d.about, ceoName: v } }))} /><CMSField label="Title" value={data.about.ceoTitle} onChange={v => updateActiveData(d => ({ ...d, about: { ...d.about, ceoTitle: v } }))} /></div><div className="space-y-2"><label className="text-[10px] uppercase text-white/40">Portrait</label><div className="aspect-square w-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center relative group overflow-hidden">{data.about.imageUrl ? <img src={data.about.imageUrl} className="w-full h-full object-cover" /> : <span className="text-white/20 text-xs">No Photo</span>}<label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'about-ceo')} /><span className="material-symbols-outlined">upload</span></label></div></div></div>
                                <CMSField label="Bio" value={data.about.bio} onChange={v => updateActiveData(d => ({ ...d, about: { ...d.about, bio: v } }))} textarea />
                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center"><label className="text-[10px] uppercase text-white/40">Career Milestones</label><button className="text-xs text-secondary-blue font-bold" onClick={() => updateActiveData(d => ({ ...d, about: { ...d.about, cvItems: [...d.about.cvItems, { year: "2024", role: "Role", company: "Company", logoUrl: "" }] } }))}>+ Add</button></div>
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
                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center"><label className="text-[10px] uppercase text-white/40">Lecturing Activities</label><button className="text-xs text-secondary-orange font-bold" onClick={() => updateActiveData(d => ({ ...d, about: { ...d.about, lecturingItems: [...(d.about.lecturingItems || []), { year: "2024", role: "Role", institution: "Institution", logoUrl: "" }] } }))}>+ Add</button></div>
                                    {(data.about.lecturingItems || []).map((item, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-xl flex gap-4 items-center group relative">
                                            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500/40" onClick={() => updateActiveData(d => ({ ...d, about: { ...d.about, lecturingItems: (d.about.lecturingItems || []).filter((_, idx) => idx !== i) } }))}><span className="material-symbols-outlined text-sm">delete</span></button>
                                            <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden relative cursor-pointer group/logo flex-shrink-0">
                                                {item.logoUrl ? <img src={item.logoUrl} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-white/20 text-sm">image</span></div>}
                                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'lecturing-logo', i)} />
                                                    <span className="material-symbols-outlined text-xs">upload</span>
                                                </label>
                                            </div>
                                            <input className="w-24 bg-transparent border-none p-0 text-sm outline-none text-white/40" value={item.year} onChange={e => updateActiveData(d => { const n = [...(d.about.lecturingItems || [])]; n[i].year = e.target.value; return { ...d, about: { ...d.about, lecturingItems: n } }; })} />
                                            <input className="flex-grow bg-transparent border-none p-0 text-sm outline-none font-bold" value={item.role} onChange={e => updateActiveData(d => { const n = [...(d.about.lecturingItems || [])]; n[i].role = e.target.value; return { ...d, about: { ...d.about, lecturingItems: n } }; })} />
                                            <input className="flex-grow bg-transparent border-none p-0 text-sm outline-none text-white/60" value={item.institution} onChange={e => updateActiveData(d => { const n = [...(d.about.lecturingItems || [])]; n[i].institution = e.target.value; return { ...d, about: { ...d.about, lecturingItems: n } }; })} />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-6 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center"><label className="text-[10px] uppercase text-white/40">Education History</label><button className="text-xs text-secondary-green font-bold" onClick={() => updateActiveData(d => ({ ...d, about: { ...d.about, educationItems: [...(d.about.educationItems || []), { year: "2024", degree: "Degree", institution: "Institution", logoUrl: "" }] } }))}>+ Add</button></div>
                                    {(data.about.educationItems || []).map((item, i) => (
                                        <div key={i} className="bg-white/5 p-4 rounded-xl flex gap-4 items-center group relative">
                                            <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500/40" onClick={() => updateActiveData(d => ({ ...d, about: { ...d.about, educationItems: (d.about.educationItems || []).filter((_, idx) => idx !== i) } }))}><span className="material-symbols-outlined text-sm">delete</span></button>
                                            <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden relative cursor-pointer group/logo flex-shrink-0">
                                                {item.logoUrl ? <img src={item.logoUrl} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-white/20 text-sm">image</span></div>}
                                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                                    <input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'edu-logo', i)} />
                                                    <span className="material-symbols-outlined text-xs">upload</span>
                                                </label>
                                            </div>
                                            <input className="w-24 bg-transparent border-none p-0 text-sm outline-none text-white/40" value={item.year} onChange={e => updateActiveData(d => { const n = [...(d.about.educationItems || [])]; n[i].year = e.target.value; return { ...d, about: { ...d.about, educationItems: n } }; })} />
                                            <input className="flex-grow bg-transparent border-none p-0 text-sm outline-none font-bold" value={item.degree} onChange={e => updateActiveData(d => { const n = [...(d.about.educationItems || [])]; n[i].degree = e.target.value; return { ...d, about: { ...d.about, educationItems: n } }; })} />
                                            <input className="flex-grow bg-transparent border-none p-0 text-sm outline-none text-white/60" value={item.institution} onChange={e => updateActiveData(d => { const n = [...(d.about.educationItems || [])]; n[i].institution = e.target.value; return { ...d, about: { ...d.about, educationItems: n } }; })} />
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

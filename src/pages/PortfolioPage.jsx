import React, { useState } from 'react'; // <-- Mengimpor useState
import { motion, AnimatePresence } from 'framer-motion'; // <-- Mengimpor AnimatePresence
import { Edit, ChevronDown } from 'lucide-react'; // <-- Mengimpor ChevronDown
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// --- Komponen SkillBar (untuk persentase) ---
function SkillBar({ name, level }) {
    const safeLevel = Math.max(0, Math.min(100, level || 0));

    return (
        <div>
            <div className="flex justify-between mb-1">
                <span className="text-base font-medium text-blue-800">{name}</span>
                <span className="text-sm font-medium text-blue-800">{safeLevel}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2.5">
                <motion.div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    initial={{ width: "0%" }}
                    whileInView={{ width: `${safeLevel}%` }} 
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}

// --- Komponen Dropdown (Accordion) ---
function SkillAccordion({ title, skills }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-2 overflow-hidden rounded-lg shadow-card border border-blue-100">
            {/* Tombol Header yang bisa diklik */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full p-4 bg-white hover:bg-blue-50 transition-colors"
            >
                <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }} // Animasi ikon panah
                >
                    <ChevronDown className="w-5 h-5 text-blue-700" />
                </motion.div>
            </motion.button>

            {/* Konten Dropdown yang Bisa Buka/Tutup */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        {/* Wrapper untuk padding dan daftar skill bar */}
                        <div className="space-y-4 p-4 bg-white border-t border-blue-100">
                            {(skills ?? []).map((skill, i) => (
                                <SkillBar key={i} name={skill.name} level={skill.level} />
                            ))}
                            {(skills ?? []).length === 0 && (
                                <p className="text-sm text-gray-500">No skills listed in this category yet.</p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- Komponen Halaman "Portfolio" (CV/Teks) ---
export default function PortfolioPage({ 
    isAdmin, 
    portfolioCVContent, 
    onEditPortfolioClick 
}) {
    
    // Mengambil data yang aman jika belum dimuat
    const content = {
        headline: portfolioCVContent?.headline || "My Portfolio (CV)",
        summary: portfolioCVContent?.summary || "Loading...",
        skills: portfolioCVContent?.skills || { ai: [], ds: [], sd: [] },
        journey: portfolioCVContent?.journey || []
    };

    return (
        <div className="max-w-3xl mx-auto">
            
            {/* ======================= VIEW MODE ======================= */}
            <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 }} }}>
                
                <motion.h1 
                    className="text-4xl font-bold text-blue-900 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {content.headline}
                </motion.h1>

                {/* Summary */}
                <motion.div 
                    className="relative text-lg text-gray-900 font-medium leading-relaxed mb-6 p-4 bg-white/100 backdrop-blur-md rounded-lg shadow-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <article className="prose prose-blue max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content.summary}
                        </ReactMarkdown>
                    </article>
                </motion.div>

                {/* --- PERBAIKAN --- Skills (My Toolkit) --- */}
                <motion.div 
                    className="mb-8"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">My Toolkit</h2>
                    
                    {/* Mengganti daftar lama dengan 3 Accordion */}
                    <div className="space-y-2">
                        <SkillAccordion className="bg-white/10 backdrop-blur-md shadow-card"
                            title="AI Engineering" 
                            skills={content.skills.ai} 
                        />
                        <SkillAccordion 
                            title="Data Science" 
                            skills={content.skills.ds} 
                        />
                        <SkillAccordion 
                            title="Software Development" 
                            skills={content.skills.sd} 
                        />
                    </div>
                </motion.div>

                {/* --- PERBAIKAN --- Tampilan Baru "My Journey" --- */}
                <motion.div 
                    className="mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">My Journey</h2>
                    
                    <div className="relative space-y-4 border-l-4 border-blue-400 pl-4  ">
                        {(content.journey ?? []).map((item, i) => (
                            <div key={i} className="p-4 bg-white/100 backdrop-blur-md shadow-card rounded-lg "> 
                                <h4 className="text-lg font-semibold text-blue-800">{item.title}</h4>
                                <p className="text-md font-medium text-gray-700">{item.company}</p>
                                <p className="text-sm text-gray-600 italic">{item.position}</p>
                                <p className="text-sm font-bold text-blue-700 mt-1 mb-2">{item.period}</p>
                                <article className="text-gray-900 font-medium prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {item.description}
                                    </ReactMarkdown>
                                </article>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>

            {/* Admin Controls */}
            {isAdmin && (
                <div className="mt-6">
                    <button 
                        onClick={onEditPortfolioClick} // Ini akan membuka PortfolioEditModal
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
                    >
                        <Edit className="w-4 h-4 inline mr-1" /> Edit Page
                    </button>
                </div>
            )}
        </div>
    );
}
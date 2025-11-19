import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Briefcase, 
    Mail, 
    Github, 
    Linkedin, 
    ArrowRight, 
    Edit, 
    Save,
    Cpu,
    Database,
    Layers
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Mengimpor kartu
import ProjectCard from '../components/ProjectCard.jsx';
import CertificationCard from '../components/CertificationCard.jsx';
import PublicationCard from '../components/PublicationCard.jsx'; 

// --- Komponen Kartu Keahlian (Sub-komponen) ---
function ExpertiseCard({ icon, title, description }) {
    return (
        <motion.div 
            className="bg-white p-6 rounded-lg shadow-card border border-blue-100"
            whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 40px -6px rgba(59, 130, 246, 0.3)" }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <motion.div 
                className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4"
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.4 }}
            >
                {React.createElement(icon, { className: "w-6 h-6" })}
            </motion.div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </motion.div>
    );
}

// --- Komponen Halaman Home Utama ---
export default function HomePage({ 
    isAdmin, 
    homeContent, 
    handleSaveHomeContent,
    portfolioCVContent, 
    aboutMeContent, 
    handleSaveAboutMeContent, 
    setPage,
    projects, 
    certifications,
    publications 
}) {
    
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [editableContent, setEditableContent] = useState({ 
        ...homeContent, 
        aboutMe: aboutMeContent?.body || "" 
    });

    useEffect(() => {
        setEditableContent({
            headline: homeContent?.headline || '',
            bio: homeContent?.bio || '',
            subtitle: homeContent?.subtitle || '',
            githubUrl: homeContent?.githubUrl || '',
            linkedinUrl: homeContent?.linkedinUrl || '',
            aboutMe: aboutMeContent?.body || '' 
        });
    }, [homeContent, aboutMeContent]);

    const onSave = async () => {
        setIsSaving(true); 
        try {
            const homeDataToSave = {
                headline: editableContent.headline,
                bio: editableContent.bio,
                subtitle: editableContent.subtitle,
                githubUrl: editableContent.githubUrl,
                linkedinUrl: editableContent.linkedinUrl
            };
            await handleSaveHomeContent(homeDataToSave);
            await handleSaveAboutMeContent({ body: editableContent.aboutMe });
            setIsEditing(false); 
        } catch (error) {
            console.error("Error saving content:", error);
        } finally {
            setIsSaving(false); 
        }
    };

    const featuredProjects = [...projects]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    const latestCerts = [...certifications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
        
    const latestPubs = [...publications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    const skillsObj = portfolioCVContent?.skills || { ai: [], ds: [], sd: [] };
    const techStack = [
        ...(skillsObj.ai || []).map(s => s.name), 
        ...(skillsObj.ds || []).map(s => s.name), 
        ...(skillsObj.sd || []).map(s => s.name)
    ];
    const uniqueTechStack = [...new Set(techStack)];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.2 }
        }
    };
    const wordVariants = {
        hidden: { opacity: 0, y: 20, rotateX: -90 },
        show: { opacity: 1, y: 0, rotateX: 0 }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };
    const scrollVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.98 },
        show: { 
            opacity: 1, y: 0, scale: 1,
            transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
        }
    };
    
    const cardHoverShadow = "0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 40px -6px rgba(59, 130, 246, 0.3)";

    return (
        <div className="max-w-6xl mx-auto">
            {isEditing ? (
                // --- FORM EDIT ---
                <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-blue-900 border-b pb-2">Edit Home Page Content</h2>
                    <h3 className="text-lg font-semibold text-gray-700 mt-4">Hero Section</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Headline</label>
                        <input 
                            type="text" 
                            className="w-full p-2 text-5xl md:text-7xl font-bold bg-white border border-blue-300 rounded"
                            value={editableContent.headline}
                            onChange={(e) => setEditableContent({...editableContent, headline: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                        <input 
                            type="text" 
                            className="w-full p-2 text-xl md:text-2xl font-medium bg-white border border-blue-300 rounded"
                            value={editableContent.subtitle}
                            onChange={(e) => setEditableContent({...editableContent, subtitle: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Short Bio (Hero)</label>
                        <textarea 
                            className="w-full p-2 text-lg md:text-xl bg-white border border-blue-300 rounded h-40"
                            value={editableContent.bio}
                            onChange={(e) => setEditableContent({...editableContent, bio: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                        <input 
                            type="text" 
                            className="w-full p-2 bg-white border border-blue-300 rounded"
                            value={editableContent.githubUrl}
                            onChange={(e) => setEditableContent({...editableContent, githubUrl: e.target.value})}
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                        <input 
                            type="text" 
                            className="w-full p-2 bg-white border border-blue-300 rounded"
                            value={editableContent.linkedinUrl}
                            onChange={(e) => setEditableContent({...editableContent, linkedinUrl: e.target.value})}
                        />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mt-6 pt-4 border-t">About Me Section</h3>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Long "About Me" Body</label>
                        <textarea 
                            className="w-full p-2 text-lg bg-white border border-blue-300 rounded h-64"
                            value={editableContent.aboutMe}
                            onChange={(e) => setEditableContent({...editableContent, aboutMe: e.target.value})}
                        />
                    </div>
                </div>
            ) : (
                // --- TAMPILAN PUBLIK ---
                <motion.div>
                    <motion.h1
                        key={editableContent.headline} 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="text-5xl md:text-7xl font-bold text-blue-900 mb-4"
                        style={{ perspective: 800 }}
                    >
                        {(editableContent.headline || " ").split(/\s+/).map((word, index) => (
                            <motion.span
                                key={`${word}-${index}`}
                                variants={wordVariants}
                                className="inline-block mr-4"
                                transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                    <motion.p 
                        className="text-xl md:text-2xl font-medium text-blue-600 mb-6"
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.5 }}
                    >
                        {editableContent.subtitle}
                    </motion.p>
                    <motion.div 
                        className="text-lg md:text-xl text-gray-700 leading-relaxed mb-8"
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.6 }}
                    >
                        <p className="whitespace-pre-wrap">{editableContent.bio}</p>
                    </motion.div>
                    <motion.div 
                        className="flex flex-col sm:flex-row gap-4 mb-8"
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.7 }}
                    >
                        <motion.button
                            onClick={() => setPage('projects')} 
                            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg flex items-center justify-center"
                            whileHover={{ scale: 1.05, boxShadow: cardHoverShadow }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            <Briefcase className="w-5 h-5 mr-2" />
                            View My Projects 
                        </motion.button>
                        <motion.button
                            onClick={() => setPage('contact')}
                            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-card border border-blue-100 flex items-center justify-center"
                            whileHover={{ scale: 1.05, boxShadow: cardHoverShadow }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            <Mail className="w-5 h-5 mr-2" />
                            Contact Me
                        </motion.button>
                    </motion.div>
                    <motion.div 
                        className="flex gap-6"
                        variants={itemVariants}
                        initial="hidden"
                        animate="show"
                        transition={{ delay: 0.8 }}
                    >
                        <motion.a 
                            href={editableContent.githubUrl} 
                            target="_blank" rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-900"
                            whileHover={{ scale: 1.2, rotate: -5 }}
                        >
                            <Github className="w-8 h-8" />
                        </motion.a>
                        <motion.a 
                            href={editableContent.linkedinUrl} 
                            target="_blank" rel="noopener noreferrer"
                            className="text-gray-500 hover:text-blue-700"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                            <Linkedin className="w-8 h-8" />
                        </motion.a>
                    </motion.div>
                </motion.div>
            )}
            
            {isAdmin && (
                <div className="mt-6">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={onSave} 
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow transition-colors mr-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
                                disabled={isSaving}
                            >
                                <Save className="w-4 h-4 inline mr-1" /> 
                                {isSaving ? "Saving..." : "Save All"}
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors">
                            <Edit className="w-4 h-4 inline mr-1" /> Edit Home Page
                        </button>
                    )}
                </div>
            )}

            <motion.div
                className="mt-20"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }} 
                variants={scrollVariants}
            >
                <div className="bg-white p-8 rounded-lg shadow-card border border-blue-100">
                    <h2 className="text-3xl font-bold text-blue-900 mb-6">About Me</h2>
                    <motion.article 
                        className="text-lg text-gray-700 leading-relaxed prose lg:prose-xl max-w-none"
                        variants={itemVariants}
                    >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {editableContent.aboutMe}
                        </ReactMarkdown>
                    </motion.article>
                </div>
            </motion.div>

             <motion.div 
                className="mt-16"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={scrollVariants}
            >
                <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">My Toolkit</h2>
                <motion.div 
                    className="flex flex-wrap justify-center gap-3"
                    variants={{ show: { transition: { staggerChildren: 0.05 }} }}
                >
                    {uniqueTechStack.map((tech) => (
                        <motion.div
                            key={tech}
                            className="bg-white text-blue-700 font-medium px-4 py-2 rounded-full shadow-card border border-blue-100"
                            variants={itemVariants}
                            whileHover={{ scale: 1.1, backgroundColor: "#eff6ff", boxShadow: cardHoverShadow }} 
                        >
                            {tech}
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>

            <motion.div 
                className="mt-16"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                variants={scrollVariants}
            >
                <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">My Expertise</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ExpertiseCard 
                        icon={Cpu}
                        title="AI Engineering"
                        description="I build and optimize deep learning models for Computer Vision (CV) and NLP, leveraging GPU acceleration with PyTorch."
                    />
                    <ExpertiseCard 
                        icon={Database}
                        title="Data Science"
                        description="From data cleaning with Pandas to training classical ML models with Scikit-learn, I turn raw data into insights."
                    />
                    <ExpertiseCard 
                        icon={Layers}
                        title="Full-Stack Deployment"
                        description="I connect AI models to the real world using Flask, Streamlit, and React, creating interactive web applications."
                    />
                </div>
            </motion.div>

            

            {/* --- BAGIAN CTA --- */}
            <motion.div
                className="mt-20 text-center bg-white p-10 rounded-lg shadow-card border border-blue-100"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={scrollVariants}
            >
                <motion.h2 variants={itemVariants} className="text-4xl font-bold text-blue-900 mb-4">Let's Build Something Together</motion.h2>
                <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                    I'm always looking for new opportunities and collaborations. Feel free to reach out!
                </motion.p>
                <motion.button
                    onClick={() => setPage('contact')}
                    className="px-10 py-4 bg-blue-600 text-white font-bold text-lg rounded-lg shadow-lg flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.05, boxShadow: cardHoverShadow }}
                    whileTap={{ scale: 0.95 }}
                    variants={itemVariants}
                >
                    <Mail className="w-5 h-5 mr-2" />
                    Get in Touch
                </motion.button>
            </motion.div>
        </div>
    );
}
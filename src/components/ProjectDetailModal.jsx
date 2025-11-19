import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ProjectDetailModal({ project, onClose }) {
    if (!project) return null; 

    const hasProjectLink = project.link && project.link.trim() !== '' && project.link.trim() !== '#';
    const hasGithubLink = project.githubLink && project.githubLink.trim() !== '' && project.githubLink.trim() !== '#';

    // --- PERUBAHAN --- Logika yang sama untuk split tech stack
    const techStack = (project.techStack || '')
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => s.length > 0);

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
                        initial={{ scale: 0.9, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 50, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-3xl font-bold text-blue-900 mb-4">{project.title}</h2>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                            {project.category}
                        </span>

                        <img 
                            src={project.imageUrl || 'https://placehold.co/800x500/e0f2fe/0c4a6e?text=Project+Image'} 
                            alt={project.title} 
                            className="w-full h-auto max-h-80 object-cover rounded-lg mb-6 shadow-md" 
                            onError={(e) => e.target.src = 'https://placehold.co/800x500/e0f2fe/0c4a6e?text=Image+Error'}
                        />

                        <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed mb-6">
                            <h3 className="text-xl font-semibold text-blue-800 mb-3">Description</h3>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {project.description || "No detailed description provided yet."}
                            </ReactMarkdown>
                        </div>

                        {/* --- PERUBAHAN: Tampilkan Tech Stack di Modal --- */}
                        {techStack.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-blue-800 mb-3">Technology Stack</h3>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-4 mt-6">
                            {hasProjectLink && (
                                <motion.a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center hover:bg-blue-700 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ExternalLink className="w-5 h-5 mr-2" /> View Live Project
                                </motion.a>
                            )}

                            {hasGithubLink && (
                                <motion.a
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-gray-800 text-white font-bold rounded-lg shadow-md flex items-center hover:bg-gray-900 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Github className="w-5 h-5 mr-2" /> View on GitHub
                                </motion.a>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
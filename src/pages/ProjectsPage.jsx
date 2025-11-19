import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectDetailModal from '../components/ProjectDetailModal.jsx'; 

const categories = [
    { id: 'All', label: 'All Projects' },
    { id: 'AI', label: 'AI Engineering' },
    { id: 'DS', label: 'Data Science' },
    { id: 'SD', label: 'Software Dev' },
];

export default function ProjectsPage({ isAdmin, projects, setEditingItem, handleDeleteItem }) {
    
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null); 

    const filteredProjects = useMemo(() => {
        if (activeFilter === 'All') {
            return projects;
        }
        return projects.filter(project => project.category === activeFilter);
    }, [activeFilter, projects]);

    let subtitle = "All my projects in one place.";
    if (activeFilter === 'AI') subtitle = "My work in Artificial Intelligence.";
    if (activeFilter === 'DS') subtitle = "My work in Data Science.";
    if (activeFilter === 'SD') subtitle = "My work in Software Development.";

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-blue-900">Projects</h1>
                    <motion.p 
                        key={subtitle} 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-lg text-gray-600 mt-1"
                    >
                        {subtitle}
                    </motion.p>
                </div>
                
                {isAdmin && (
                    <motion.button 
                        onClick={() => setEditingItem({ 
                            type: 'projects', 
                            title: '', 
                            description: '', 
                            imageUrl: '', 
                            link: '',
                            githubLink: '', 
                            techStack: '', // <-- PERUBAHAN: Tambahkan ini
                            category: 'AI' 
                        })}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors flex items-center order-first md:order-last"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Project
                    </motion.button>
                )}
            </div>

            <div className="flex items-center gap-2 mb-8 border-b border-blue-100 pb-2">
                {categories.map(category => {
                    const isActive = activeFilter === category.id;
                    return (
                        <motion.button
                            key={category.id}
                            onClick={() => setActiveFilter(category.id)}
                            className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                ${isActive 
                                    ? 'text-blue-700' 
                                    : 'text-gray-600 hover:bg-blue-50'
                                }
                            `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeFilterPill" 
                                    className="absolute inset-0 bg-blue-100 -z-10"
                                    style={{ borderRadius: 8 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                />
                            )}
                            {category.label}
                        </motion.button>
                    )
                })}
            </div>
            
            <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            isAdmin={isAdmin}
                            onEdit={() => setEditingItem({ ...project, type: 'projects' })}
                            onDelete={() => handleDeleteItem('projects', project.id)}
                            onViewDetail={() => setSelectedProject(project)} 
                            
                            layout 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
                        exit={{ opacity: 0 }}
                        className="text-gray-500 text-center mt-10"
                    >
                        No projects found in the "{categories.find(c => c.id === activeFilter).label}" category.
                    </motion.div>
                )}
            </AnimatePresence>

            <ProjectDetailModal 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
            />
        </div>
    );
}
import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2, Github } from 'lucide-react'; 

const ProjectCard = forwardRef(({ project, isAdmin, onEdit, onDelete, onViewDetail, ...props }, ref) => {
    
    const hasGithubLink = project.githubLink && 
                          project.githubLink.trim() !== '' && 
                          project.githubLink.trim() !== '#';

    // --- PERUBAHAN --- Ubah string (dipisah koma) menjadi array
    const techStack = (project.techStack || '')
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => s.length > 0); // Filter string kosong

    return (
        <motion.div 
            ref={ref}
            {...props}
            
            className="bg-white rounded-lg shadow-card overflow-hidden flex flex-col"
            whileHover={{ 
                scale: 1.03, 
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.07), 0 8px 40px -6px rgba(59, 130, 246, 0.3)"
            }}
        >
            <img 
                src={project.imageUrl || 'https://placehold.co/600x400/e0f2fe/0c4a6e?text=Project+Image'} 
                alt={project.title} 
                className="w-full h-48 object-cover" 
                onError={(e) => e.target.src = 'https://placehold.co/600x400/e0f2fe/0c4a6e?text=Image+Error'}
            />
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                </p>

                {/* --- PERUBAHAN --- Tampilkan pil-pil tech stack --- */}
                <div className="flex-1 mb-4"> {/* flex-1 mendorong tombol ke bawah */}
                    <div className="flex flex-wrap gap-2">
                        {techStack.map((tech, i) => (
                            <span 
                                key={i} 
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
                
                <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                    <motion.button 
                        onClick={onViewDetail}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm flex items-center hover:bg-blue-700 transition-colors text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Eye className="w-4 h-4 mr-1" /> View Details
                    </motion.button>

                    {hasGithubLink && (
                        <motion.a 
                            href={project.githubLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg shadow-sm flex items-center hover:bg-gray-900 transition-colors text-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Github className="w-4 h-4" /> 
                        </motion.a>
                    )}
                </div>
            </div>

            {isAdmin && (
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                    <motion.button 
                        onClick={onEdit} className="p-2 text-blue-600 hover:text-blue-800"
                        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    >
                        <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button 
                        onClick={onDelete} className="p-2 text-red-500 hover:text-red-700"
                        whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </motion.button>
                </div>
            )}
        </motion.div>
    );
});

export default ProjectCard;
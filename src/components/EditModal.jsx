import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';

// Modal ini untuk KARTU: Projects, Certifications, Publications
export default function EditModal({ item, type, onClose, onSave }) {
    
    const [formData, setFormData] = useState({ 
        ...item, 
        category: item.category || 'AI',
        imageUrl: item.imageUrl || '',
        description: item.description || '',
        issuer: item.issuer || '',
        link: item.link || '',
        githubLink: item.githubLink || '',
        techStack: item.techStack || '' 
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const isProject = type === 'projects';
    const isCertificate = type === 'certifications';
    const isPublication = type === 'publications';

    let title = "Item";
    if (isProject) title = "Project";
    if (isCertificate) title = "Certificate";
    if (isPublication) title = "Publication";

    return (
         <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white p-8 rounded-lg shadow-card w-full max-w-lg max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{item.id ? 'Edit' : 'Add'} {title}</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800"><X /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" required 
                               className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg" 
                               value={formData.title} onChange={handleChange} />
                    </div>
                    
                    {isProject && (
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <select 
                                name="category" 
                                id="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                            >
                                <option value="AI">AI (Artificial Intelligence)</option>
                                <option value="DS">DS (Data Science)</option>
                                <option value="SD">SD (Software Development)</option>
                            </select>
                        </div>
                    )}
                    
                    {isProject && (
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" id="description" rows="3" 
                                      className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
                                      value={formData.description} onChange={handleChange}></textarea>
                        </div>
                    )}
                    
                    {(isCertificate || isPublication) && (
                         <div>
                            <label htmlFor="issuer" className="block text-sm font-medium text-gray-700">
                                {isCertificate ? 'Issuer (e.g., "Google")' : 'Journal / Conference (e.g., "IEEE")'}
                            </label>
                            <input type="text" name="issuer" id="issuer" 
                                   className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg" 
                                   value={formData.issuer} onChange={handleChange} />
                        </div>
                    )}
                    
                    {/* --- KONDISI IMAGE URL YANG BENAR: untuk Project, Certificate, dan Publication --- */}
                    {(isProject || isCertificate || isPublication) && ( 
                        <div>
                            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL (Sampul Jurnal/Abstract)</label>
                            <input type="text" name="imageUrl" id="imageUrl" 
                                   className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg" 
                                   value={formData.imageUrl} onChange={handleChange} 
                                   placeholder="https://imgur.com/your-image.png" />
                            {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                            {isProject ? 'Live Demo / External Project Link' : (isCertificate ? 'Credential Link' : 'Paper Link')}
                        </label>
                        <input type="text" name="link" id="link" 
                               className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg" 
                               value={formData.link} onChange={handleChange} 
                               placeholder="https://your-project-demo.com" />
                    </div>

                    {isProject && (
                        <div>
                            <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700">GitHub Repository Link</label>
                            <input type="text" name="githubLink" id="githubLink" 
                                   className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg" 
                                   value={formData.githubLink} onChange={handleChange} 
                                   placeholder="https://github.com/your-repo" />
                        </div>
                    )}

                    {/* --- Field Tech Stack --- */}
                    {isProject && (
                        <div>
                            <label htmlFor="techStack" className="block text-sm font-medium text-gray-700">Tech Stack (dipisah koma)</label>
                            <input 
                                type="text" 
                                name="techStack" 
                                id="techStack" 
                                className="mt-1 block w-full p-3 bg-gray-100 border border-gray-300 rounded-lg" 
                                value={formData.techStack} 
                                onChange={handleChange} 
                                placeholder="Contoh: React, PyTorch, Firebase" 
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Save className="w-4 h-4 inline mr-1" /> Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}
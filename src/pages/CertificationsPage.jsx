import React, { useState, useEffect } from 'react'; // <-- Impor hook
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Save } from 'lucide-react'; // <-- Impor ikon baru
import CertificationCard from '../components/CertificationCard.jsx';
import CertificationDetailModal from '../components/CertificationDetailModal.jsx';
import ReactMarkdown from 'react-markdown'; // <-- Impor Markdown
import remarkGfm from 'remark-gfm';

// --- PERUBAHAN --- Menerima prop baru
export default function CertificationsPage({ 
    isAdmin, 
    certifications, 
    setEditingItem, 
    handleDeleteItem,
    certPageContent,
    handleSaveCertPageContent
}) {
    
    const [selectedCert, setSelectedCert] = useState(null);

    // --- PERUBAHAN --- State baru untuk mengedit deskripsi
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editableContent, setEditableContent] = useState(certPageContent);

    useEffect(() => {
        setEditableContent(certPageContent);
    }, [certPageContent]);

    const onSave = async () => {
        setIsSaving(true);
        try {
            await handleSaveCertPageContent(editableContent);
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving cert page content:", error);
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <div>
            {isEditing ? (
                // --- PERUBAHAN --- Tampilan Mode Edit ---
                <div className="space-y-4 bg-white p-6 rounded-lg shadow-card mb-6">
                    <h2 className="text-2xl font-bold text-blue-900 border-b pb-2">Edit Page Content</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Page Description (Markdown)</label>
                        <textarea 
                            className="w-full p-2 text-lg bg-white border border-blue-300 rounded h-32"
                            value={editableContent.description}
                            onChange={(e) => setEditableContent({...editableContent, description: e.target.value})}
                        />
                    </div>
                </div>
            ) : (
                // --- PERUBAHAN --- Tampilan Mode View ---
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div>
                        <h1 className="text-4xl font-bold text-blue-900">Certifications</h1>
                        <motion.div 
                            className="text-lg text-gray-700 mt-2 prose prose-blue max-w-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {certPageContent?.description || ""}
                            </ReactMarkdown>
                        </motion.div>
                    </div>
                    {isAdmin && (
                        <motion.button 
                            onClick={() => setEditingItem({ type: 'certifications', title: '', issuer: '', imageUrl: '', link: '' })}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors flex items-center mt-4 md:mt-0"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-4 h-4 mr-1" /> Add Certificate
                        </motion.button>
                    )}
                </div>
            )}

            {/* --- PERUBAHAN --- Tombol Kontrol Admin --- */}
            {isAdmin && (
                <div className="mt-6 mb-8">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={onSave} 
                                disabled={isSaving}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow transition-colors mr-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600"
                            >
                                <Save className="w-4 h-4 inline mr-1" /> 
                                {isSaving ? "Saving..." : "Save All"}
                            </button>
                            <button 
                                onClick={() => setIsEditing(false)} 
                                disabled={isSaving}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors"
                        >
                            <Edit className="w-4 h-4 inline mr-1" /> Edit Description
                        </button>
                    )}
                </div>
            )}
            
            {/* (Grid Kartu tetap sama) */}
            <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence>
                    {certifications.map((cert) => (
                        <CertificationCard 
                            key={cert.id} 
                            cert={cert} 
                            isAdmin={isAdmin}
                            onEdit={() => setEditingItem({ ...cert, type: 'certifications' })}
                            onDelete={() => handleDeleteItem('certifications', cert.id)}
                            onViewDetail={() => setSelectedCert(cert)}
                            
                            layout="position"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            <AnimatePresence>
                {certifications.length === 0 && (
                    <motion.p 
                        className="text-gray-500 text-center mt-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2 }}}
                    >
                        No certifications added yet. Click "Add Certificate" to get started.
                    </motion.p>
                )}
            </AnimatePresence>

            <CertificationDetailModal 
                cert={selectedCert} 
                onClose={() => setSelectedCert(null)} 
            />
        </div>
    );
}
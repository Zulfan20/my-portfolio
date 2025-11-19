import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Modal ini khusus untuk menampilkan detail Publikasi
export default function PublicationDetailModal({ pub, onClose }) {
    if (!pub) return null; // Jangan render jika tidak ada publikasi

    // Cek apakah ada link paper yang valid
    const hasLink = pub.link && pub.link.trim() !== '' && pub.link.trim() !== '#';

    return (
        <AnimatePresence>
            {pub && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white p-6 md:p-8 rounded-lg shadow-card w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
                        initial={{ scale: 0.9, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 50, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        {/* Tombol Tutup (X) */}
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Judul dan Penerbit */}
                        <h2 className="text-3xl font-bold text-blue-900 mb-2">{pub.title}</h2>
                        <p className="text-lg text-gray-600 font-medium mb-6">
                            Published in: <span className="font-semibold text-blue-800">{pub.issuer}</span>
                        </p>
                        
                        {/* Deskripsi (jika ada) */}
                        {/* Kita bisa gunakan field 'description' jika Anda ingin menambahkannya di EditModal nanti */}
                        {pub.description && (
                             <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed mb-6">
                                <h3 className="text-xl font-semibold text-blue-800 mb-3">Abstract / Description</h3>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {pub.description}
                                </ReactMarkdown>
                            </div>
                        )}

                        {/* Tombol Link Paper */}
                        {hasLink && (
                            <motion.a
                                href={pub.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center justify-center w-full hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ExternalLink className="w-5 h-5 mr-2" /> Read Paper
                            </motion.a>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

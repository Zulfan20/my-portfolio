import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react'; // Impor ikon

// Modal ini khusus untuk menampilkan detail Sertifikat
export default function CertificationDetailModal({ cert, onClose }) {
    if (!cert) return null; // Jangan render jika tidak ada sertifikat

    // Cek apakah ada link kredensial yang valid
    const hasLink = cert.link && cert.link.trim() !== '' && cert.link.trim() !== '#';

    return (
        <AnimatePresence>
            {cert && (
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
                        <h2 className="text-3xl font-bold text-blue-900 mb-2">{cert.title}</h2>
                        <p className="text-lg text-gray-600 font-medium mb-4">
                            Issued by: <span className="font-semibold text-blue-800">{cert.issuer}</span>
                        </p>
                        
                        {/* Gambar Sertifikat */}
                        <img 
                            src={cert.imageUrl || 'https://placehold.co/800x500/e0f2fe/0c4a6e?text=Certificate'} 
                            alt={cert.title} 
                            className="w-full h-auto max-h-[60vh] object-contain rounded-lg mb-6 shadow-md bg-gray-50" 
                            onError={(e) => e.target.src = 'https://placehold.co/800x500/e0f2fe/0c4a6e?text=Image+Error'}
                        />

                        {/* Tombol Link Kredensial */}
                        {hasLink && (
                            <motion.a
                                href={cert.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md flex items-center justify-center w-full hover:bg-blue-700 transition-colors"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <ExternalLink className="w-5 h-5 mr-2" /> View Credential
                            </motion.a>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

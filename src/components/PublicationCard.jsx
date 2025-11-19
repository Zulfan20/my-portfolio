import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, Edit, Trash2 } from 'lucide-react';

const PublicationCard = forwardRef(({ pub, isAdmin, onEdit, onDelete, onViewDetail, ...props }, ref) => {
    
    // Asumsikan pub.imageUrl dapat diisi oleh admin
    const imageUrl = pub.imageUrl || 'https://placehold.co/600x400/1e3a8a/dbeafe?text=ABSTRACT+IMAGE';

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
            {/* --- PERUBAHAN: Mengganti DIV/SVG dengan IMG tag --- */}
            <img 
                src={imageUrl} 
                alt={pub.title} 
                className="w-full h-48 object-cover" 
                // Tampilkan placeholder jika link gambar rusak
                onError={(e) => e.target.src = 'https://placehold.co/600x400/1e3a8a/dbeafe?text=ABSTRACT+IMAGE'}
            />
            
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{pub.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-1">
                    {pub.issuer || "Publication"}
                </p>
                
                <motion.button 
                    onClick={onViewDetail} // <-- Memicu modal
                    className="px-4 py-2 mt-auto bg-blue-600 text-white font-medium rounded-lg shadow-sm flex items-center justify-center hover:bg-blue-700 transition-colors text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Eye className="w-4 h-4 mr-1" /> View Details
                </motion.button>
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

export default PublicationCard;
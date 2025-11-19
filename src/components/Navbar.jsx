import React from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    Briefcase, 
    Award, 
    Mail, 
    Code,
    BookOpen,
    Key,    
    LogOut
} from 'lucide-react';

const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'portfolio', label: 'Portfolio (CV)', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'publications', label: 'Publications', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: Mail },
];

export default function Navbar({ setPage, currentPage, isAdmin, onAdminLoginClick, onLogout, ...props }) {
    return (
        <nav 
            {...props} 
            className={`
                bg-white shadow-lg border-blue-100 
                
                flex flex-row justify-around items-center w-full h-16 border-t
                
                md:flex-col md:justify-start md:items-stretch md:w-20 lg:w-56 md:h-full md:border-t-0 md:border-r md:p-6
                
                ${props.className || ''}
            `}
        >
            
            {/* Judul (hanya terlihat di desktop) */}
            <h1 className="hidden md:block text-2xl font-bold text-blue-600 mb-12"></h1>
            
            {/* Wrapper untuk item menu */}
            <div className="flex flex-row justify-around md:flex-col w-full md:w-auto">
                {navItems.map((item) => {
                    const isActive = currentPage === item.id;
                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            className={`flex-1 flex flex-col md:flex-row items-center justify-center md:justify-start w-full p-2 md:p-3 md:my-1 rounded-lg transition-colors duration-200 relative
                                ${isActive 
                                    ? 'bg-blue-100 text-blue-600' 
                                    : 'text-gray-500 hover:bg-blue-50'
                                }
                            `}
                            whileHover={{ x: isActive ? 0 : 5 }} 
                            whileTap={{ scale: 0.95 }}
                        >
                            <item.icon className="w-5 h-5" />
                            
                            <span className="hidden lg:block lg:ml-4">{item.label}</span>
                            
                            {isActive && (
                                <motion.div 
                                    // --- INI PERBAIKANNYA ---
                                    // Mengubah 'left-1/2 -translate-x-1/2 w-8'
                                    // menjadi 'left-0 w-full'
                                    className="absolute left-0 top-0 h-1 w-full bg-blue-600 rounded-b-lg
                                               md:left-0 md:top-0 md:h-full md:w-1 md:rounded-r-lg"
                                    layoutId="activePill"
                                    initial={false} 
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Tombol Admin (hanya terlihat di desktop) */}
            {/* <div className="hidden md:block mt-auto"> 
                {isAdmin ? (
                    <button 
                        onClick={onLogout}
                        className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center justify-center lg:justify-start w-full p-3"
                    >
                        <LogOut className="w-4 h-4 lg:mr-4" />
                        <span className="hidden lg:block">Logout Admin</span>
                    </button>
                ) : (
                    <button 
                        onClick={onAdminLoginClick}
                        className="text-sm text-gray-500 hover:text-blue-600 font-medium flex items-center justify-center lg:justify-start w-full p-3"
                    >
                        <Key className="w-4 h-4 lg:mr-4" />
                        <span className="hidden lg:block">Admin Login</span>
                    </button>
                )}
            </div> */}
            
        </nav>
    );
}
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    onAuthStateChanged
} from 'firebase/auth';
import { 
    getFirestore, 
    doc, 
    collection, 
    onSnapshot, 
    setDoc, 
    addDoc, 
    deleteDoc, 
    query,
    orderBy,
    setLogLevel
} from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

// --- Impor Komponen & Halaman ---
import Navbar from './components/Navbar.jsx';
import AdminLoginModal from './components/AdminLoginModal.jsx';
import EditModal from './components/EditModal.jsx';
import PortfolioEditModal from './components/PortfolioEditModal.jsx'; 
import HomePage from './pages/HomePage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';     // Halaman CV/Teks Anda
import ProjectsPage from './pages/ProjectsPage.jsx';     // Halaman Kartu Visual Anda
import CertificationsPage from './pages/CertificationsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AnimatedBackground from './components/AiBackground.jsx';
import PublicationPage from './pages/PublicationPage.jsx';

// --- (Kode Firebase Config & Init tetap sama) ---
const firebaseConfig = {
  apiKey: "AIzaSyCbGhevpyGWcpvwrlkNI2k8noQz9PcJUMg",
  authDomain: "my-portfolio-app-15dbe.firebaseapp.com",
  projectId: "my-portfolio-app-15dbe",
  storageBucket: "my-portfolio-app-15dbe.firebasestorage.app",
  messagingSenderId: "1097782778419",
  appId: "1:1097782778419:web:87094dec68ccfb1686a146",
  measurementId: "G-EBLZ72E32K"
};
const appId = firebaseConfig.projectId;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
setLogLevel('Debug');
const publicDataPath = `artifacts/${appId}/public/data`;


// --- 1. Main App Component ---

export default function App() {
    // --- State ---
    const [page, setPage] = useState('home');
    const [isAdmin, setIsAdmin] = useState(false);
    const [userId, setUserId] = useState(null);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [showPortfolioEditModal, setShowPortfolioEditModal] = useState(false);
    
    // --- PERBAIKAN --- Inisialisasi state sebagai 'null' untuk melacak loading
    const [homeContent, setHomeContent] = useState(null); 
    const [portfolioCVContent, setPortfolioCVContent] = useState(null); 
    const [certPageContent, setCertPageContent] = useState(null);
    const [pubPageContent, setPubPageContent] = useState(null);

    const [projects, setProjects] = useState([]); 
    const [certifications, setCertifications] = useState([]);
    const [publications, setPublications] = useState([]); 
    const [contactMessages, setContactMessages] = useState([]);
    const [editingItem, setEditingItem] = useState(null); 
    
    
    // --- (Firebase Auth Effect tetap sama) ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('User is signed in:', user.uid);
                setUserId(user.uid);
            } else {
                console.log('No user. Signing in anonymously...');
                try {
                    const initialAuthToken = null; 
                    if (initialAuthToken) {
                        await signInWithCustomToken(auth, initialAuthToken);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Error signing in: ", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // --- Firestore Data Loading Effect ---
    useEffect(() => {
        if (!userId) return; 

        // Get Home Content
        const homeDocRef = doc(db, publicDataPath, 'portfolioContent', 'home');
        const unsubHome = onSnapshot(homeDocRef, (doc) => {
            if (doc.exists()) { 
                setHomeContent(doc.data()); 
            } else if (isAdmin) {
                 const defaultHome = { 
                    headline: "Your Name Here", 
                    bio: "Your professional bio.",
                    subtitle: "AI Engineer | Data Scientist | Software Developer",
                    githubUrl: "https://github.com/Zulfan20",
                    linkedinUrl: "https://linkedin.com/in/muhammad-zulfan-abidin-b4427b212",
                    aboutMe: "This is the longer 'About Me' section on the Home Page."
                };
                 setDoc(homeDocRef, defaultHome);
                 setHomeContent(defaultHome);
            } else {
                setHomeContent({}); 
            }
        });

        // Get Portfolio CV Content
        const portfolioCVDocRef = doc(db, publicDataPath, 'portfolioContent', 'portfolioCV');
        const unsubPortfolioCV = onSnapshot(portfolioCVDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                // Memastikan data yang dimuat memiliki struktur yang benar
                if (!data.skills || !data.skills.ai) {
                    const convertedData = {
                        ...data,
                        skills: { ai: data.skills || [], ds: [], sd: [] } 
                    };
                    setPortfolioCVContent(convertedData);
                    if(isAdmin) setDoc(portfolioCVDocRef, convertedData, { merge: true });
                } else {
                    setPortfolioCVContent(data);
                }
            } else if (isAdmin) {
                const defaultCV = {
                    headline: "My Portfolio (CV)",
                    summary: "This is my professional summary. I am an AI Engineer...",
                    skills: { 
                        ai: [{name: "PyTorch", level: 80}, {name: "Hugging Face", level: 75}],
                        ds: [{name: "Pandas", level: 90}, {name: "Scikit-learn", level: 85}],
                        sd: [{name: "React", level: 70}, {name: "Firebase", level: 80}]
                    },
                    journey: [
                        { year: "2024", description: "Started my journey in Computer Science." },
                        { year: "2025", description: "Began focusing on AI and full-stack development." }
                    ]
                };
                setDoc(portfolioCVDocRef, defaultCV);
                setPortfolioCVContent(defaultCV); 
            } else {
                setPortfolioCVContent({}); 
            }
        });

        // Get Cert Page Content
        const certPageDocRef = doc(db, publicDataPath, 'portfolioContent', 'certPage');
        const unsubCertPage = onSnapshot(certPageDocRef, (doc) => {
            if (doc.exists()) {
                setCertPageContent(doc.data());
            } else if (isAdmin) {
                const defaultCert = {
                    description: "Ini adalah daftar sertifikasi dan kursus profesional yang telah saya selesaikan."
                };
                setDoc(certPageDocRef, defaultCert);
                setCertPageContent(defaultCert);
            } else {
                setCertPageContent({ description: "Ini adalah daftar sertifikasi..." });
            }
        });

        // Get Pub Page Content
        const pubPageDocRef = doc(db, publicDataPath, 'portfolioContent', 'pubPage');
        const unsubPubPage = onSnapshot(pubPageDocRef, (doc) => {
            if (doc.exists()) {
                setPubPageContent(doc.data());
            } else if (isAdmin) {
                const defaultPub = {
                    description: "Berikut adalah daftar penelitian dan publikasi akademik saya."
                };
                setDoc(pubPageDocRef, defaultPub);
                setPubPageContent(defaultPub);
            } else {
                setPubPageContent({ description: "Berikut adalah daftar penelitian..." });
            }
        });

        // (Listener lain tetap sama)
        const projectsQuery = query(collection(db, publicDataPath, 'projects'));
        const unsubProjects = onSnapshot(projectsQuery, (snapshot) => {
            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const certsQuery = query(collection(db, publicDataPath, 'certifications'));
        const unsubCerts = onSnapshot(certsQuery, (snapshot) => {
            setCertifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const pubsQuery = query(collection(db, publicDataPath, 'publications'));
        const unsubPublications = onSnapshot(pubsQuery, (snapshot) => {
            setPublications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        const messagesQuery = query(collection(db, publicDataPath, 'contactMessages'));
        const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
             if (isAdmin) {
                setContactMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
             }
        });

        return () => {
            unsubHome();
            unsubPortfolioCV(); 
            unsubCertPage();
            unsubPubPage(); 
            unsubProjects();
            unsubCerts();
            unsubPublications(); 
            unsubMessages();
        };
    }, [userId, isAdmin]);

    // --- CRUD Functions (Admin only) ---
    const handleSaveHomeContent = async (newContent) => {
        if (!isAdmin) return;
        const homeDocRef = doc(db, publicDataPath, 'portfolioContent', 'home');
        await setDoc(homeDocRef, newContent, { merge: true });
    };
    const handleSavePortfolioCVContent = async (newContent) => {
        if (!isAdmin) return;
        const portfolioCVDocRef = doc(db, publicDataPath, 'portfolioContent', 'portfolioCV');
        await setDoc(portfolioCVDocRef, newContent, { merge: true });
        setShowPortfolioEditModal(false); 
    };
    const handleSaveCertPageContent = async (newContent) => {
        if (!isAdmin) return;
        const certPageDocRef = doc(db, publicDataPath, 'portfolioContent', 'certPage');
        await setDoc(certPageDocRef, newContent, { merge: true });
    };
    const handleSavePubPageContent = async (newContent) => {
        if (!isAdmin) return;
        const pubPageDocRef = doc(db, publicDataPath, 'portfolioContent', 'pubPage');
        await setDoc(pubPageDocRef, newContent, { merge: true });
    };

    const handleSaveItem = async (type, item) => {
        if (!isAdmin) return;
        const validTypes = ['projects', 'certifications', 'publications'];
        if (!validTypes.includes(type)) return;
        const collectionRef = collection(db, publicDataPath, type); 
        if (item.id) {
            const itemDocRef = doc(db, publicDataPath, type, item.id);
            const { id, ...itemData } = item; 
            await setDoc(itemDocRef, itemData, { merge: true });
        } else {
            await addDoc(collectionRef, { ...item, createdAt: new Date().toISOString() });
        }
        setEditingItem(null); 
    };
    const handleDeleteItem = async (type, id) => {
        if (!isAdmin) return;
        const validTypes = ['projects', 'certifications', 'publications'];
        if (!validTypes.includes(type)) return;
        if (window.confirm("Are you sure you want to delete this item?")) { 
            const itemDocRef = doc(db, publicDataPath, type, id);
            await deleteDoc(itemDocRef);
        }
    };
    const handleContactSubmit = async (formData) => {
        const messagesColRef = collection(db, publicDataPath, 'contactMessages');
        await addDoc(messagesColRef, { 
            ...formData, 
            submittedAt: new Date().toISOString(),
            read: false 
        });
    };
    
    // --- Page Rendering ---
    const renderPage = () => {
        // --- PERBAIKAN BUG --- Menambahkan pemeriksaan loading
        if (!homeContent || !portfolioCVContent || !certPageContent || !pubPageContent) { 
            return (
                <div className="flex items-center justify-center h-full">
                    <h1 className="text-2xl font-medium text-gray-500">Loading...</h1>
                </div>
            );
        }

        const props = { 
            isAdmin, 
            homeContent, handleSaveHomeContent, 
            portfolioCVContent, handleSavePortfolioCVContent, 
            certPageContent, handleSaveCertPageContent,
            pubPageContent, handleSavePubPageContent, 
            projects, 
            certifications, 
            publications, 
            contactMessages, 
            handleSaveItem, handleDeleteItem, setEditingItem, 
            handleContactSubmit, 
            setPage,
            onEditPortfolioClick: () => setShowPortfolioEditModal(true) 
        };
        
        // Ini adalah struktur file ANDA yang benar
        switch (page) {
            case 'home': return <HomePage {...props} />;
            case 'portfolio': return <PortfolioPage {...props} />; // Halaman CV/Teks Anda
            case 'projects': return <ProjectsPage {...props} />;   // Halaman Kartu Visual Anda
            case 'certifications': return <CertificationsPage {...props} />;
            case 'publications': return <PublicationPage {...props} />;
            case 'contact': return <ContactPage {...props} />;
            default: return <HomePage {...props} />;
        }
    };
    
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        out: { opacity: 0, y: -20 }
    };

    return (
        <div className="relative h-screen w-full">
            <AnimatedBackground />

            <div className="relative z-10 flex flex-col md:flex-row h-full text-gray-900 font-sans">
                <Navbar 
                    setPage={setPage} 
                    currentPage={page} 
                    isAdmin={isAdmin}
                    onAdminLoginClick={() => setShowAdminLogin(true)}
                    onLogout={() => setIsAdmin(false)}
                />
                <main className="flex-1 overflow-y-auto p-6 md:p-12 bg-transparent"> 
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={page}
                            variants={pageVariants}
                            initial="initial"
                            animate="in"
                            exit="out"
                            transition={{ duration: 0.3 }}
                            className="relative z-10"
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <AnimatePresence>
                {showAdminLogin && (
                    <AdminLoginModal 
                        onClose={() => setShowAdminLogin(false)} 
                        onLoginSuccess={() => setIsAdmin(true)}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {showPortfolioEditModal && (
                    <PortfolioEditModal 
                        data={portfolioCVContent}
                        onClose={() => setShowPortfolioEditModal(false)}
                        onSave={handleSavePortfolioCVContent}
                    />
                )}
            </AnimatePresence>
            
            <AnimatePresence>
                {editingItem && (
                    <EditModal 
                        item={editingItem} 
                        type={editingItem.type}
                        onClose={() => setEditingItem(null)}
                        onSave={(item) => handleSaveItem(editingItem.type, item)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
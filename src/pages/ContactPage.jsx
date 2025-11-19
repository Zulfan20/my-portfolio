import React, { useState } from 'react';
import { motion } from 'framer-motion';

function ContactPage({ isAdmin, contactMessages, handleContactSubmit }) {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleContactSubmit(formData);
            setIsSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error("Error submitting contact form: ", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-blue-900 mb-6">Contact Me</h1>
            
            {isSubmitted ? (
                <motion.div 
                    className="p-6 bg-green-100 text-green-800 rounded-lg text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <h3 className="text-2xl font-semibold">Thank you!</h3>
                    <p>Your message has been sent successfully.</p>
                </motion.div>
            ) : (
                <motion.form 
                    onSubmit={handleSubmit} 
                    className="bg-white p-8 rounded-lg shadow-lg space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" id="name" required 
                               className="mt-1 block w-full p-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                               value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" required 
                               className="mt-1 block w-full p-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
                               value={formData.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea name="message" id="message" rows="5" required 
                                  className="mt-1 block w-full p-3 bg-blue-50 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  value={formData.message} onChange={handleChange}></textarea>
                    </div>
                    <div>
                        <motion.button 
                            type="submit" 
                            className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Send Message
                        </motion.button>
                    </div>
                </motion.form>
            )}

            {isAdmin && (
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">Inbox</h2>
                    <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                        {contactMessages.length === 0 ? (
                            <p>No messages received yet.</p>
                        ) : (
                            contactMessages.map(msg => (
                                <details key={msg.id} className="border-b border-gray-200 pb-2">
                                    <summary className="font-semibold cursor-pointer">
                                        From: {msg.name} ({msg.email})
                                        <span className="text-sm text-gray-500 ml-2">
                                            {new Date(msg.submittedAt).toLocaleString()}
                                        </span>
                                    </summary>
                                    <p className="mt-2 p-4 bg-gray-50 rounded">{msg.message}</p>
                                </details>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactPage;
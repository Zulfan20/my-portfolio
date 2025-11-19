import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Plus, Trash2 } from 'lucide-react';

export default function PortfolioEditModal({ data, onClose, onSave }) {
    
    const [form, setForm] = useState({
        headline: data?.headline || "",
        summary: data?.summary || "",
        skills: data?.skills || { ai: [], ds: [], sd: [] },
        journey: data?.journey || []
    });

    // Generic updater
    const updateField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // --- (Fungsi Skill tetap sama) ---
    const updateSkill = (category, index, field, value) => {
        setForm(prev => {
            const updatedSkills = { ...prev.skills };
            const updatedCategory = [...(updatedSkills[category] ?? [])];
            updatedCategory[index] = { ...updatedCategory[index], [field]: value };
            return {
                ...prev,
                skills: { ...updatedSkills, [category]: updatedCategory }
            };
        });
    };
    const addSkill = (category) => {
        setForm(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [category]: [...(prev.skills?.[category] ?? []), { name: "New Skill", level: 50 }]
            }
        }));
    };
    const removeSkill = (category, index) => {
        setForm(prev => {
            const updatedCategory = (prev.skills?.[category] ?? []).filter((_, idx) => idx !== index);
            return {
                ...prev,
                skills: { ...prev.skills, [category]: updatedCategory }
            };
        });
    };

    // --- PERUBAHAN --- Fungsi Journey
    const updateJourney = (index, field, value) => {
        setForm(prev => {
            const updated = [...(prev.journey ?? [])];
            updated[index] = { ...(updated[index] || {}), [field]: value };
            return { ...prev, journey: updated };
        });
    };
    const addJourney = () => {
        setForm(prev => ({
            ...prev,
            journey: [...(prev.journey ?? []), { 
                title: "", 
                company: "", 
                position: "", 
                period: "", 
                description: "" 
            }]
        }));
    };
    const removeJourney = (index) => {
        setForm(prev => ({
            ...prev,
            journey: (prev.journey ?? []).filter((_, idx) => idx !== index)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.div
                className="bg-white p-8 rounded-lg shadow-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Portfolio (CV) Page</h2>
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800">
                        <X />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Headline */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Headline</label>
                        <input 
                            type="text"
                            className="w-full p-3 border bg-gray-100 rounded-lg"
                            value={form.headline}
                            onChange={(e) => updateField("headline", e.target.value)}
                        />
                    </div>

                    {/* Summary */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Summary / About Me (Markdown supported)</label>
                        <textarea
                            className="w-full p-3 border bg-gray-100 rounded-lg h-32"
                            value={form.summary}
                            onChange={(e) => updateField("summary", e.target.value)}
                        />
                    </div>

                    {/* (Bagian Skills/Toolkit tetap sama) */}
                    <EditableListSection
                        title="AI Engineering Skills"
                        category="ai"
                        items={form.skills.ai}
                        updateItem={updateSkill}
                        addItem={addSkill}
                        removeItem={removeSkill}
                    />
                    <EditableListSection
                        title="Data Science Skills"
                        category="ds"
                        items={form.skills.ds}
                        updateItem={updateSkill}
                        addItem={addSkill}
                        removeItem={removeSkill}
                    />
                    <EditableListSection
                        title="Software Development Skills"
                        category="sd"
                        items={form.skills.sd}
                        updateItem={updateSkill}
                        addItem={addSkill}
                        removeItem={removeSkill}
                    />

                    {/* --- PERUBAHAN --- Journey Section */}
                    <EditableJourneySection
                        title="Journey (Timeline)"
                        items={form.journey}
                        updateItem={updateJourney}
                        addItem={addJourney}
                        removeItem={removeJourney}
                    />

                    <div className="flex justify-end gap-2 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Save className="w-4 h-4 inline mr-1" /> Save
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

// (Komponen EditableListSection tetap sama)
function EditableListSection({ title, category, items, updateItem, addItem, removeItem }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
            <div className="space-y-3">
                {(items ?? []).map((item, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-2 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1">
                            <label className="text-xs font-medium text-gray-500">Skill Name</label>
                            <input
                                type="text"
                                placeholder="e.g., PyTorch"
                                className="w-full p-2 bg-white border rounded-lg"
                                value={item.name}
                                onChange={(e) => updateItem(category, i, 'name', e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-32">
                            <label className="text-xs font-medium text-gray-500">Level (0-100)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full p-2 bg-white border rounded-lg"
                                value={item.level}
                                onChange={(e) => updateItem(category, i, 'level', parseInt(e.target.value) || 0)}
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={() => removeItem(category, i)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 h-10 md:self-end"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button 
                    type="button"
                    onClick={() => addItem(category)}
                    className="mt-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                    <Plus className="w-4 h-4 inline mr-1" /> Add {title.split(' ')[0]} Skill
                </button>
            </div>
        </div>
    );
}

// --- PERUBAHAN --- Komponen Journey Section ---
function EditableJourneySection({ title, items, updateItem, addItem, removeItem }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{title}</label>
            <div className="space-y-3">
                {(items ?? []).map((item, i) => (
                    <div key={i} className="flex gap-2 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex-1 space-y-2">
                            {/* --- Field Baru --- */}
                            <input
                                type="text"
                                placeholder="Title (e.g., Bachelor of Computer Science)"
                                className="w-full p-2 bg-white border rounded-lg"
                                value={item.title}
                                onChange={(e) => updateItem(i, 'title', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Company/Organization (e.g., Your University)"
                                className="w-full p-2 bg-white border rounded-lg"
                                value={item.company}
                                onChange={(e) => updateItem(i, 'company', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Employment/Position (e.g., Student)"
                                className="w-full p-2 bg-white border rounded-lg"
                                value={item.position}
                                onChange={(e) => updateItem(i, 'position', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Period (e.g., 2024 - Present)"
                                className="w-full p-2 bg-white border rounded-lg"
                                value={item.period}
                                onChange={(e) => updateItem(i, 'period', e.target.value)}
                            />
                            <textarea
                                placeholder="Description (Markdown)"
                                className="w-full p-2 bg-white border rounded-lg"
                                value={item.description}
                                onChange={(e) => updateItem(i, 'description', e.target.value)}
                            />
                        </div>
                        <button 
                            type="button"
                            onClick={() => removeItem(i)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 h-10 mt-1 md:self-center"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                <button 
                    type="button"
                    onClick={addItem}
                    className="mt-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                >
                    <Plus className="w-4 h-4 inline mr-1" /> Add Step
                </button>
            </div>
        </div>
    );
}
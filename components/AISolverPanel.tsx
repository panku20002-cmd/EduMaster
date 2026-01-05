
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, Sparkles, Bot, User, Trash2, Camera, X } from 'lucide-react';
import { SolverMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

export const AISolverPanel: React.FC = () => {
    const [messages, setMessages] = useState<SolverMessage[]>([
        { 
            id: '1', 
            sender: 'ai', 
            type: 'text', 
            content: "Hello! I'm your AI Study Buddy. 🤖\n\nI can help you solve questions in Math, Science, English, and more. Upload a photo of your homework or type your question below!", 
            timestamp: new Date().toLocaleTimeString() 
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isTyping]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() && !selectedImage) return;

        // 1. User Message
        const userMsg: SolverMessage = {
            id: Date.now().toString(),
            sender: 'user',
            type: selectedImage ? 'mixed' : 'text',
            content: inputText,
            imageUrl: selectedImage || undefined,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setSelectedImage(null);
        setIsTyping(true);

        // 2. Mock AI Processing Delay
        setTimeout(() => {
            // Mock Response Logic
            let aiResponse = "";
            if (userMsg.imageUrl) {
                aiResponse = "I see an image! Let me extract the text... \n\n**OCR Analysis:** Found a quadratic equation: `x^2 - 5x + 6 = 0`. \n\n**Step-by-Step Solution:**\n1. **Identify terms:** a=1, b=-5, c=6\n2. **Factorize:** Find two numbers that multiply to 6 and add to -5. These are -2 and -3.\n3. **Split middle term:** `x^2 - 2x - 3x + 6 = 0`\n4. **Group:** `x(x-2) - 3(x-2) = 0`\n5. **Final Factors:** `(x-2)(x-3) = 0`\n\n**Answer:** x = 2 or x = 3. \n\nDoes this help?";
            } else if (userMsg.content.toLowerCase().includes('essay') || userMsg.content.toLowerCase().includes('write')) {
                aiResponse = "Here is a structure for your essay:\n\n**Title:** [Topic Name]\n**Introduction:** Hook the reader and state your thesis.\n**Body Paragraph 1:** First main point with evidence.\n**Body Paragraph 2:** Second main point.\n**Conclusion:** Summarize and give a closing thought.\n\n*Remember: Use your own words! Copying directly is not good for learning.*";
            } else {
                aiResponse = "That's a great question! Here's how to approach it:\n\n1. First, break the problem down into smaller parts.\n2. Recall the relevant formula or concept.\n3. Apply the values carefully.\n\nCould you clarify which specific part is confusing you?";
            }

            const aiMsg: SolverMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                type: 'text',
                content: aiResponse,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, aiMsg]);
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-indigo-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">AI Doubt Solver</h3>
                        <p className="text-xs text-slate-500">Ask questions via Text or Image</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Online</span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50 custom-scrollbar">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        
                        <div className={`max-w-[80%] space-y-2`}>
                            {msg.imageUrl && (
                                <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-1">
                                    <img src={msg.imageUrl} alt="Uploaded" className="max-w-xs max-h-60 object-contain rounded-lg" />
                                </div>
                            )}
                            {msg.content && (
                                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                                    msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            )}
                            <p className={`text-[10px] text-slate-400 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                                {msg.timestamp}
                            </p>
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-indigo-600" />
                        </div>
                        <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
                {selectedImage && (
                    <div className="mb-4 relative inline-block">
                        <img src={selectedImage} alt="Preview" className="h-20 w-auto rounded-lg border border-slate-200 shadow-sm" />
                        <button 
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                        >
                            <X size={12} />
                        </button>
                    </div>
                )}
                
                <div className="flex gap-2 items-end">
                    <div className="flex-1 bg-slate-100 rounded-2xl p-2 flex items-center gap-2 border border-transparent focus-within:border-indigo-300 transition-colors">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                            title="Upload Image"
                        >
                            <ImageIcon size={20} />
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            hidden 
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <textarea 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Type a question or paste text..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 max-h-32 resize-none py-2"
                            rows={1}
                        />
                    </div>
                    <button 
                        onClick={handleSend}
                        disabled={(!inputText.trim() && !selectedImage) || isTyping}
                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all active:scale-95"
                    >
                        <Send size={20} />
                    </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                    <Sparkles size={10} /> AI can make mistakes. Use for learning support only.
                </p>
            </div>
        </div>
    );
};

import React, { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Info } from 'lucide-react';

// Hook for smooth typing effect
const useSmoothTyping = (text, speed = 10) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed]);

    return displayedText;
};

// Component to render message content with optional smooth typing
const MessageContent = ({ content, isNew, onComplete }) => {
    const [displayedContent, setDisplayedContent] = useState(isNew ? '' : content);

    useEffect(() => {
        if (!isNew) {
            setDisplayedContent(content);
            return;
        }

        // If content grows, we want to animate the new part
        // But for simplicity in this streaming setup, we often get chunks.
        // A simple approach: just display what we have. 
        // The "smoothness" comes from the fact that the server sends chunks.
        // However, if chunks are large, it looks jerky.
        // We can implement a local buffer.

        let currentIndex = displayedContent.length;
        if (currentIndex >= content.length) return;

        const interval = setInterval(() => {
            if (currentIndex < content.length) {
                setDisplayedContent(content.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 15); // 15ms per character

        return () => clearInterval(interval);
    }, [content, isNew]);

    return <div className="whitespace-pre-wrap">{displayedContent}</div>;
};

const ChatInterface = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiMessageId = Date.now();
        setMessages(prev => [...prev, {
            role: 'ai',
            content: '',
            id: aiMessageId,
            analysis: null,
            isStreaming: true
        }]);

        try {
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMessage.content, stream: true }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) {
                    setMessages(prev => prev.map(msg =>
                        msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg
                    ));
                    break;
                }

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);
                        if (dataStr === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(dataStr);

                            if (parsed.type === 'analysis') {
                                setMessages(prev => prev.map(msg =>
                                    msg.id === aiMessageId ? { ...msg, analysis: parsed.data } : msg
                                ));
                            } else if (parsed.type === 'token') {
                                setMessages(prev => prev.map(msg =>
                                    msg.id === aiMessageId ? { ...msg, content: msg.content + parsed.data } : msg
                                ));
                            } else if (parsed.type === 'error') {
                                setMessages(prev => prev.map(msg =>
                                    msg.id === aiMessageId ? { ...msg, content: msg.content + "\n[Error: " + parsed.data + "]" } : msg
                                ));
                            }
                        } catch (e) {
                            console.error("Error parsing SSE:", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, content: "Sorry, I encountered an error connecting to the server.", isStreaming: false } : msg
            ));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-stone-950 text-stone-100">
            {/* Header */}
            <div className="p-4 border-b border-stone-800 flex items-center gap-2 bg-stone-900/50 backdrop-blur">
                <ChefHat className="text-amber-500 w-8 h-8" />
                <div>
                    <h1 className="font-bold text-xl text-amber-50">AI Cooking Assistant</h1>
                    <p className="text-xs text-stone-400">Powered by GraphRAG</p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-stone-500 opacity-50">
                        <ChefHat className="w-24 h-24 mb-4 text-stone-600" />
                        <p className="text-lg">Ask me anything about cooking!</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-md ${msg.role === 'user'
                                ? 'bg-amber-600 text-white rounded-br-none'
                                : 'bg-stone-800 text-stone-200 rounded-bl-none border border-stone-700'
                            }`}>
                            {/* Use MessageContent for AI messages to get smooth typing, direct render for user */}
                            {msg.role === 'ai' ? (
                                <MessageContent content={msg.content} isNew={msg.isStreaming} />
                            ) : (
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            )}

                            {/* Analysis / Reasoning Display */}
                            {msg.analysis && (
                                <div className="mt-4 pt-3 border-t border-stone-700 text-sm">
                                    <div className="flex items-center gap-2 mb-2 text-amber-500 font-medium">
                                        <Info className="w-4 h-4" />
                                        <span>Reasoning Process</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div className="bg-stone-900/50 p-2 rounded border border-stone-800">
                                            <span className="text-stone-500 text-xs block">Strategy</span>
                                            <span className="font-mono text-xs text-stone-300">{msg.analysis.strategy}</span>
                                        </div>
                                        <div className="bg-stone-900/50 p-2 rounded border border-stone-800">
                                            <span className="text-stone-500 text-xs block">Complexity</span>
                                            <span className="font-mono text-xs text-stone-300">{msg.analysis.complexity?.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {msg.analysis.relevant_docs && msg.analysis.relevant_docs.length > 0 && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-stone-500 mb-1">Sources Used:</p>
                                            {msg.analysis.relevant_docs.map((doc, i) => (
                                                <div key={i} className="flex items-center justify-between bg-stone-900/30 px-2 py-1 rounded text-xs border border-stone-800/50">
                                                    <span className="truncate max-w-[150px] text-stone-400">{doc.name}</span>
                                                    <span className="text-stone-600">{doc.type}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-stone-800 bg-stone-900/30">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="How do I make..."
                        className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-stone-500 text-stone-200"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shadow-lg shadow-amber-900/20"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;

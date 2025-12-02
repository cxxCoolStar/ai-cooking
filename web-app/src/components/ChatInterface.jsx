import React, { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Camera, ShoppingCart } from 'lucide-react';

// Component to render message content with optional smooth typing
const MessageContent = ({ content, isNew }) => {
    const [displayedContent, setDisplayedContent] = useState(isNew ? '' : content);

    useEffect(() => {
        if (!isNew) {
            setDisplayedContent(content);
            return;
        }

        let currentIndex = displayedContent.length;
        if (currentIndex >= content.length) return;

        const interval = setInterval(() => {
            if (currentIndex < content.length) {
                setDisplayedContent(content.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 15);

        return () => clearInterval(interval);
    }, [content, isNew]);

    return <div className="whitespace-pre-wrap leading-relaxed text-sm">{displayedContent}</div>;
};

const SuggestionChip = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="bg-white text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 hover:shadow-lg transition-all whitespace-nowrap border border-gray-200 shadow-md"
    >
        {text}
    </button>
);

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: '你好！我是你的AI烹饪助手，有什么想做的菜吗？', id: 'init', time: '10:30' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (text) => {
        if (!text.trim() || isLoading) return;

        const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        const userMessage = { role: 'user', content: text, time: currentTime };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiMessageId = Date.now();
        setMessages(prev => [...prev, {
            role: 'ai',
            content: '',
            id: aiMessageId,
            analysis: null,
            isStreaming: true,
            time: currentTime
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

    const handleSubmit = (e) => {
        e.preventDefault();
        handleSend(input);
    };

    return (
        <div className="flex flex-col h-full bg-transparent">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-white border-b border-gray-200">
                <div>
                    <h1 className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        AI Cooking Assistant
                    </h1>
                    <p className="text-xs text-gray-500">智能烹饪对话助手</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <Camera className="w-5 h-5 text-orange-600" />
                    </button>
                    <div className="relative">
                        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                            <ShoppingCart className="w-5 h-5 text-orange-600" />
                        </button>
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                            3
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai'
                                ? 'bg-gradient-to-br from-orange-400 to-red-500'
                                : 'bg-gradient-to-br from-blue-400 to-purple-500'
                            }`}>
                            {msg.role === 'ai' ? (
                                <ChefHat className="w-5 h-5 text-white" />
                            ) : (
                                <span className="text-white text-sm font-medium">你</span>
                            )}
                        </div>

                        {/* Message Content */}
                        <div className={`flex flex-col gap-1 max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {/* Bubble */}
                            <div className={`rounded-2xl px-6 py-4 shadow-md ${msg.role === 'user'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                    : 'bg-white text-gray-800'
                                }`}>
                                {msg.role === 'ai' ? (
                                    <MessageContent content={msg.content} isNew={msg.isStreaming} />
                                ) : (
                                    <div className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</div>
                                )}
                            </div>

                            {/* Timestamp */}
                            <div className={`text-xs text-gray-400 px-2`}>
                                {msg.time}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions & Input Area */}
            <div className="px-8 pb-6 pt-4">
                {/* Suggestions */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    <SuggestionChip text="今天晚餐吃什么?" onClick={() => handleSend("今天晚餐吃什么?")} />
                    <SuggestionChip text="用鸡蛋和番茄能做什么?" onClick={() => handleSend("用鸡蛋和番茄能做什么?")} />
                    <SuggestionChip text="推荐低卡路里食谱" onClick={() => handleSend("推荐低卡路里食谱")} />
                    <SuggestionChip text="20分钟快手菜" onClick={() => handleSend("20分钟快手菜")} />
                </div>

                {/* Input Bar */}
                <div className="flex gap-3 items-end">
                    <button className="p-3 rounded-xl hover:bg-white/50 transition-all">
                        <Camera className="w-5 h-5 text-gray-600" />
                    </button>

                    <form onSubmit={handleSubmit} className="flex-1 flex gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="询问任何烹饪问题..."
                            className="flex-1 bg-white px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-gray-600 placeholder-gray-400 border border-gray-200 shadow-md"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all shadow-lg hover:shadow-xl"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;

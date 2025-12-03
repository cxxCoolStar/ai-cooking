import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import RecipeBrowser from './components/RecipeBrowser';
import Login from './components/Login';
import { Home, MessageSquare, BookOpen, Heart, ChefHat, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, active, badge, onClick }) => (
    <div className="relative mb-2">
        <button
            onClick={onClick}
            className={`w-full p-3 rounded-xl cursor-pointer transition-all flex items-center justify-center ${active ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                }`}
        >
            <Icon className="w-5 h-5" />
        </button>
        {badge && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-sm">
                {badge}
            </div>
        )}
    </div>
);

function App() {
    const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'chat' | 'recipes'
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    // 全局 Fetch 拦截器配置
    useEffect(() => {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            let [resource, config] = args;
            config = config || {};
            config.headers = config.headers || {};

            // 如果存在 Token，注入到请求头
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                config.headers['Authorization'] = `Bearer ${storedToken}`;
            }

            try {
                const response = await originalFetch(resource, config);
                
                // 处理 401 未授权
                if (response.status === 401) {
                    handleLogout();
                }
                return response;
            } catch (error) {
                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setActiveView('dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setActiveView('dashboard');
    };

    if (!token) {
        return <Login onLogin={handleLogin} />;
    }

    const handleAskAI = (recipeName) => {
        setActiveView('chat');
        // TODO: 可以预填充问题到聊天输入框
        console.log('Ask AI about:', recipeName);
    };

    const handleRecipeSelect = (recipeId) => {
        setSelectedRecipeId(recipeId);
        setActiveView('recipes');
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 overflow-hidden">
            {/* Icon Sidebar */}
            <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-6 px-2">
                <div className="mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ChefHat className="w-6 h-6 text-white" />
                    </div>
                </div>

                <div className="flex-1 w-full flex flex-col items-center space-y-1">
                    <SidebarItem
                        icon={Home}
                        active={activeView === 'dashboard'}
                        onClick={() => setActiveView('dashboard')}
                    />
                    <SidebarItem
                        icon={MessageSquare}
                        active={activeView === 'chat'}
                        onClick={() => setActiveView('chat')}
                    />
                    <SidebarItem
                        icon={BookOpen}
                        active={activeView === 'recipes'}
                        onClick={() => setActiveView('recipes')}
                    />
                    <SidebarItem
                        icon={Heart}
                        active={activeView === 'favorites'}
                        onClick={() => setActiveView('favorites')}
                    />
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={handleLogout}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        title="退出登录"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Content - 根据 activeView 切换视图 */}
            {activeView === 'dashboard' && (
                <Dashboard 
                    onStartChat={() => setActiveView('chat')} 
                    onRecipeClick={handleRecipeSelect}
                />
            )}

            {activeView === 'chat' && (
                <div className="flex-1 flex flex-col">
                    <ChatInterface />
                </div>
            )}

            {activeView === 'recipes' && (
                <RecipeBrowser 
                    onAskAI={handleAskAI} 
                    initialRecipeId={selectedRecipeId}
                />
            )}

            {activeView === 'favorites' && (
                <RecipeBrowser 
                    onAskAI={handleAskAI} 
                    favoritesOnly={true} 
                    initialRecipeId={selectedRecipeId}
                />
            )}
        </div>
    );
}

export default App;

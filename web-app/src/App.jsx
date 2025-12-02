import React from 'react';
import ChatInterface from './components/ChatInterface';
import { Home, MessageSquare, BookOpen, Heart, ChefHat, ShoppingCart } from 'lucide-react';

const SidebarItem = ({ icon: Icon, active, badge }) => (
    <div className="relative mb-2">
        <button className={`w-full p-3 rounded-xl cursor-pointer transition-all flex items-center justify-center ${active ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            }`}>
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
                    <SidebarItem icon={Home} />
                    <SidebarItem icon={MessageSquare} active badge="3" />
                    <SidebarItem icon={BookOpen} />
                    <SidebarItem icon={Heart} />
                </div>

                <div className="mt-auto">
                    <button className="p-2 text-gray-300 hover:text-gray-400">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200"></div>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <ChatInterface />
            </div>
        </div>
    );
}

export default App;

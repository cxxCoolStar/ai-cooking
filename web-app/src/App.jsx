import React from 'react';
import ChatInterface from './components/ChatInterface';
import SystemStats from './components/SystemStats';

function App() {
    return (
        <div className="flex h-screen bg-stone-950 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 bg-stone-900 border-r border-stone-800 flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-stone-100 mb-6">Dashboard</h2>
                    <SystemStats />
                </div>

                <div className="mt-auto p-6 border-t border-stone-800">
                    <p className="text-xs text-stone-500 text-center">
                        AI Cooking Assistant v1.0
                    </p>
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

import React, { useEffect, useState } from 'react';
import { Database, FileText, Layers, Activity } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-stone-800 p-4 rounded-xl border border-stone-700 flex items-center gap-4 shadow-sm">
        <div className={`p-3 rounded-lg bg-opacity-10 ${color.bg} ${color.text}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-stone-400 text-sm">{label}</p>
            <p className="text-2xl font-bold text-stone-100">{value}</p>
        </div>
    </div>
);

const SystemStats = () => {
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/stats');
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error("Failed to fetch stats", e);
        }
    };

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 gap-4 p-4">
            <StatCard
                icon={Database}
                label="Recipes"
                value={stats.total_recipes}
                color={{ bg: 'bg-blue-500', text: 'text-blue-500' }}
            />
            <StatCard
                icon={Layers}
                label="Ingredients"
                value={stats.total_ingredients}
                color={{ bg: 'bg-emerald-500', text: 'text-emerald-500' }}
            />
            <StatCard
                icon={FileText}
                label="Documents"
                value={stats.total_documents}
                color={{ bg: 'bg-purple-500', text: 'text-purple-500' }}
            />
            <StatCard
                icon={Activity}
                label="Total Queries"
                value={stats.total_queries}
                color={{ bg: 'bg-amber-500', text: 'text-amber-500' }}
            />
        </div>
    );
};

export default SystemStats;

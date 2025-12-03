import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Star, Camera, ShoppingCart, Heart, BookOpen, MessageCircle, Flame, Sparkles } from 'lucide-react';

const Dashboard = ({ onStartChat }) => {
    const [stats, setStats] = useState({
        total_recipes: 0,
        total_ingredients: 0,
        total_documents: 0,
        total_queries: 0
    });
    const [loading, setLoading] = useState(true);

    // 获取统计数据
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/stats');
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // 统计卡片配置
    const statsCards = [
        {
            label: '菜谱总数',
            value: stats.total_recipes,
            icon: BookOpen,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            label: '食材库',
            value: stats.total_ingredients,
            icon: Flame,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            label: '完成菜谱',
            value: 0,  // 暂时使用 0，后续通过接口统计
            icon: Star,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            label: '对话次数',
            value: stats.total_queries,
            icon: MessageCircle,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        }
    ];

    // Mock 推荐菜谱数据（后续可从后端随机获取）
    const recipes = [
        {
            id: 1,
            name: '宫爆鸡丁',
            time: '25分钟',
            image: '🍗',
            calories: 380,
            likes: 1234
        },
        {
            id: 2,
            name: '番茄炒蛋',
            time: '15分钟',
            image: '🍅',
            calories: 220,
            likes: 2341
        },
        {
            id: 3,
            name: '麻婆豆腐',
            time: '30分钟',
            image: '🌶️',
            calories: 290,
            likes: 1876
        },
        {
            id: 4,
            name: '糖醋里脊',
            time: '35分钟',
            image: '🥩',
            calories: 450,
            likes: 987
        }
    ];

    return (
        <div className="flex-1 flex flex-col bg-transparent">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            Dashboard
                        </h1>
                        <p className="text-sm text-gray-500">
                            欢迎回来！今天想做什么菜？
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="p-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:bg-gray-50">
                            <Camera className="w-5 h-5 text-orange-600" />
                        </button>
                        <button className="p-3 rounded-xl shadow-md hover:shadow-lg transition-all relative hover:bg-gray-50">
                            <ShoppingCart className="w-5 h-5 text-orange-600" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto p-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    {statsCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                                        <p className={`text-3xl font-bold ${stat.color}`}>
                                            {loading ? '...' : stat.value}
                                        </p>
                                    </div>
                                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                                        <Icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Today's Recommendations */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                            今日推荐
                        </h2>
                        <button className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline">
                            查看全部 →
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group"
                            >
                                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                                    {recipe.image}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg mb-3">{recipe.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                        <Clock className="w-4 h-4" />
                                        <span>{recipe.time}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center gap-1 text-gray-600">
                                            <Flame className="w-4 h-4 text-orange-500" />
                                            {recipe.calories} 卡
                                        </span>
                                        <span className="flex items-center gap-1 text-gray-600">
                                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                            {recipe.likes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Banner */}
                <div className="rounded-2xl p-8 shadow-xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">不知道做什么？</h3>
                            <p className="text-orange-100">让AI助手帮你推荐适合今天的菜谱</p>
                        </div>
                        <button
                            onClick={onStartChat}
                            className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-2 text-lg"
                        >
                            <Sparkles className="w-6 h-6" />
                            开始对话
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

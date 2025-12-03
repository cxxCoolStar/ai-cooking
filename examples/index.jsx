import React, { useState } from 'react';
import { ChefHat, Clock, Star, Camera, ShoppingCart, Heart, BookOpen, MessageCircle, Home, Flame, Sparkles } from 'lucide-react';

const CookingDashboard = () => {
    const [theme, setTheme] = useState('light');

    const stats = [
        { label: '菜谱总数', value: 323, icon: BookOpen, color: 'text-orange-600', bgColor: 'bg-orange-50' },
        { label: '食材库', value: 2906, icon: Flame, color: 'text-green-600', bgColor: 'bg-green-50' },
        { label: '完成菜谱', value: 87, icon: Star, color: 'text-blue-600', bgColor: 'bg-blue-50' },
        { label: '对话次数', value: 2, icon: MessageCircle, color: 'text-purple-600', bgColor: 'bg-purple-50' }
    ];

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

    const bgClass = theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 text-gray-900';

    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-300 flex`}>
            {/* Sidebar */}
            <div className={`w-20 ${cardBg} border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-6 space-y-6`}>
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-2xl shadow-lg">
                    <ChefHat className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1 flex flex-col space-y-4">
                    <button
                        className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900 text-orange-600 transition-all"
                        title="仪表盘"
                    >
                        <Home className="w-6 h-6" />
                    </button>

                    <button
                        className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all relative"
                        title="AI助手"
                    >
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                    </button>

                    <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" title="食材库">
                        <BookOpen className="w-6 h-6" />
                    </button>

                    <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all" title="收藏">
                        <Heart className="w-6 h-6" />
                    </button>
                </div>

                <button
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                    {theme === 'light' ? '🌙' : '☀️'}
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className={`${cardBg} border-b border-gray-200 dark:border-gray-700 px-8 py-4`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                                Dashboard
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                欢迎回来！今天想做什么菜？
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className={`p-3 rounded-xl shadow-md hover:shadow-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700`}>
                                <Camera className="w-5 h-5 text-orange-600" />
                            </button>
                            <button className={`p-3 rounded-xl shadow-md hover:shadow-lg transition-all relative hover:bg-gray-100 dark:hover:bg-gray-700`}>
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
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className={`${cardBg} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                                            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
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
                                    className={`${cardBg} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group`}
                                >
                                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                                        {recipe.image}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg mb-3">{recipe.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <Clock className="w-4 h-4" />
                                            <span>{recipe.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <Flame className="w-4 h-4 text-orange-500" />
                                                {recipe.calories} 卡
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
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
                            <button className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center gap-2 text-lg">
                                <Sparkles className="w-6 h-6" />
                                开始对话
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookingDashboard;
import React, { useState } from 'react';
import { ChefHat, Search, Filter, Clock, Users, Flame, Star, Heart, ArrowLeft, BookOpen, MessageCircle, Home, TrendingUp, Tag } from 'lucide-react';

const RecipeBrowser = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [theme, setTheme] = useState('light');

    // 模拟从HowToCook获取的菜谱数据
    const categories = [
        { id: 'all', name: '全部', icon: '📚', count: 323 },
        { id: 'meat', name: '荤菜', icon: '🍖', count: 89 },
        { id: 'vegetable', name: '素菜', icon: '🥬', count: 67 },
        { id: 'soup', name: '汤羹', icon: '🍜', count: 45 },
        { id: 'staple', name: '主食', icon: '🍚', count: 56 },
        { id: 'breakfast', name: '早餐', icon: '🥐', count: 34 },
        { id: 'dessert', name: '甜品', icon: '🍰', count: 32 }
    ];

    const recipes = [
        {
            id: 1,
            name: '红烧肉',
            category: 'meat',
            difficulty: '中等',
            time: 90,
            servings: 4,
            calories: 450,
            image: '🥩',
            tags: ['川菜', '家常菜', '下饭'],
            likes: 2456,
            description: '色泽红亮，肥而不腻的经典家常菜',
            ingredients: [
                { name: '五花肉', amount: '500g' },
                { name: '冰糖', amount: '30g' },
                { name: '生抽', amount: '2勺' },
                { name: '老抽', amount: '1勺' },
                { name: '料酒', amount: '2勺' },
                { name: '葱姜', amount: '适量' }
            ],
            steps: [
                '五花肉切2cm见方的块，冷水下锅焯水',
                '锅中少油，放入冰糖小火炒至焦糖色',
                '倒入五花肉翻炒上色',
                '加入料酒、生抽、老抽翻炒',
                '加开水没过肉，放入葱姜',
                '大火烧开转小火炖1小时',
                '大火收汁即可'
            ]
        },
        {
            id: 2,
            name: '宫保鸡丁',
            category: 'meat',
            difficulty: '中等',
            time: 25,
            servings: 3,
            calories: 380,
            image: '🍗',
            tags: ['川菜', '下饭', '快手'],
            likes: 1876,
            description: '酸甜微辣，鸡肉鲜嫩，花生香脆',
            ingredients: [
                { name: '鸡胸肉', amount: '300g' },
                { name: '花生米', amount: '50g' },
                { name: '干辣椒', amount: '10个' },
                { name: '花椒', amount: '1勺' },
                { name: '葱姜蒜', amount: '适量' }
            ],
            steps: [
                '鸡胸肉切丁，加料酒、盐、淀粉腌制',
                '调制宫保汁：生抽、醋、糖、水、淀粉',
                '热油炸花生米至金黄捞出',
                '少油煸炒干辣椒和花椒',
                '倒入鸡丁快速翻炒至变色',
                '倒入宫保汁翻炒均匀',
                '最后加入花生米翻炒即可'
            ]
        },
        {
            id: 3,
            name: '番茄炒蛋',
            category: 'vegetable',
            difficulty: '简单',
            time: 15,
            servings: 2,
            calories: 220,
            image: '🍅',
            tags: ['家常菜', '快手', '简单'],
            likes: 3421,
            description: '经典家常菜，酸甜开胃',
            ingredients: [
                { name: '番茄', amount: '3个' },
                { name: '鸡蛋', amount: '4个' },
                { name: '糖', amount: '1勺' },
                { name: '盐', amount: '适量' }
            ],
            steps: [
                '番茄切块，鸡蛋打散',
                '热油炒鸡蛋至凝固盛出',
                '另起锅炒番茄至出汁',
                '加入糖和盐调味',
                '倒入炒好的鸡蛋',
                '翻炒均匀即可出锅'
            ]
        },
        {
            id: 4,
            name: '麻婆豆腐',
            category: 'vegetable',
            difficulty: '中等',
            time: 30,
            servings: 3,
            calories: 290,
            image: '🌶️',
            tags: ['川菜', '下饭', '麻辣'],
            likes: 1987,
            description: '麻辣鲜香，豆腐嫩滑',
            ingredients: [
                { name: '嫩豆腐', amount: '1块' },
                { name: '肉末', amount: '100g' },
                { name: '豆瓣酱', amount: '2勺' },
                { name: '花椒粉', amount: '1勺' },
                { name: '葱姜蒜', amount: '适量' }
            ],
            steps: [
                '豆腐切块焯水',
                '炒香肉末盛出',
                '煸炒豆瓣酱出红油',
                '加入葱姜蒜爆香',
                '倒入豆腐和适量水',
                '加入肉末煮3分钟',
                '勾芡，撒花椒粉和葱花'
            ]
        },
        {
            id: 5,
            name: '可乐鸡翅',
            category: 'meat',
            difficulty: '简单',
            time: 40,
            servings: 3,
            calories: 350,
            image: '🍗',
            tags: ['家常菜', '甜味', '下饭'],
            likes: 2234,
            description: '色泽红亮，甜而不腻',
            ingredients: [
                { name: '鸡翅', amount: '10个' },
                { name: '可乐', amount: '1罐' },
                { name: '生抽', amount: '2勺' },
                { name: '料酒', amount: '1勺' },
                { name: '葱姜', amount: '适量' }
            ],
            steps: [
                '鸡翅划两刀，冷水下锅焯水',
                '热油煎至两面金黄',
                '加入葱姜爆香',
                '倒入可乐没过鸡翅',
                '加生抽和料酒',
                '大火烧开转中火炖20分钟',
                '大火收汁即可'
            ]
        },
        {
            id: 6,
            name: '酸辣土豆丝',
            category: 'vegetable',
            difficulty: '简单',
            time: 15,
            servings: 2,
            calories: 180,
            image: '🥔',
            tags: ['家常菜', '快手', '开胃'],
            likes: 1654,
            description: '酸辣爽脆，开胃下饭',
            ingredients: [
                { name: '土豆', amount: '2个' },
                { name: '干辣椒', amount: '5个' },
                { name: '醋', amount: '2勺' },
                { name: '盐', amount: '适量' }
            ],
            steps: [
                '土豆切丝，清水浸泡去淀粉',
                '热油煸炒干辣椒',
                '倒入土豆丝快速翻炒',
                '加盐调味',
                '烹入醋翻炒均匀',
                '出锅前加少许糖提鲜'
            ]
        },
        {
            id: 7,
            name: '糖醋里脊',
            category: 'meat',
            difficulty: '困难',
            time: 35,
            servings: 3,
            calories: 450,
            image: '🥩',
            tags: ['粤菜', '甜味', '油炸'],
            likes: 1432,
            description: '外酥里嫩，酸甜可口',
            ingredients: [
                { name: '里脊肉', amount: '300g' },
                { name: '番茄酱', amount: '3勺' },
                { name: '白醋', amount: '2勺' },
                { name: '糖', amount: '2勺' },
                { name: '淀粉', amount: '适量' }
            ],
            steps: [
                '里脊肉切条，加盐、料酒腌制',
                '裹上淀粉和蛋液',
                '油温6成热炸至金黄',
                '调糖醋汁：番茄酱、醋、糖、水',
                '锅中倒入糖醋汁煮至浓稠',
                '倒入炸好的里脊',
                '快速翻炒裹匀即可'
            ]
        },
        {
            id: 8,
            name: '蒜蓉西兰花',
            category: 'vegetable',
            difficulty: '简单',
            time: 10,
            servings: 2,
            calories: 120,
            image: '🥦',
            tags: ['健康', '快手', '清淡'],
            likes: 987,
            description: '清淡健康，蒜香浓郁',
            ingredients: [
                { name: '西兰花', amount: '1个' },
                { name: '大蒜', amount: '5瓣' },
                { name: '蚝油', amount: '1勺' },
                { name: '盐', amount: '适量' }
            ],
            steps: [
                '西兰花切小朵，焯水1分钟',
                '大蒜切末',
                '热油爆香蒜末',
                '倒入西兰花翻炒',
                '加蚝油和盐调味',
                '翻炒均匀即可出锅'
            ]
        }
    ];

    const filteredRecipes = recipes.filter(recipe => {
        const matchCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        const matchSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.tags.some(tag => tag.includes(searchQuery));
        return matchCategory && matchSearch;
    });

    const bgClass = theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'
        : 'bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-50 text-gray-900';

    const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case '简单': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case '中等': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            case '困难': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (selectedRecipe) {
        // 详情页
        return (
            <div className={`min-h-screen ${bgClass} transition-colors duration-300 flex`}>
                {/* Sidebar */}
                <div className={`w-20 ${cardBg} border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-6 space-y-6`}>
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-2xl shadow-lg">
                        <ChefHat className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1 flex flex-col space-y-4">
                        <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                            <Home className="w-6 h-6" />
                        </button>

                        <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                            <MessageCircle className="w-6 h-6" />
                        </button>

                        <button className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900 text-orange-600 transition-all">
                            <BookOpen className="w-6 h-6" />
                        </button>

                        <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
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

                {/* Recipe Detail */}
                <div className="flex-1 overflow-y-auto">
                    <div className={`${cardBg} border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-10`}>
                        <button
                            onClick={() => setSelectedRecipe(null)}
                            className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            返回菜谱列表
                        </button>
                    </div>

                    <div className="p-8 max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-7xl">{selectedRecipe.image}</span>
                                        <div>
                                            <h1 className="text-4xl font-bold mb-2">{selectedRecipe.name}</h1>
                                            <p className="text-gray-600 dark:text-gray-400">{selectedRecipe.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        {selectedRecipe.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button className="p-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-2xl hover:bg-red-100 dark:hover:bg-red-800 transition-all">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className={`${cardBg} rounded-2xl p-6 shadow-lg`}>
                                <div className="grid grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                                        <p className="text-2xl font-bold mb-1">{selectedRecipe.time}分钟</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">烹饪时间</p>
                                    </div>
                                    <div className="text-center">
                                        <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                        <p className="text-2xl font-bold mb-1">{selectedRecipe.servings}人份</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">份量</p>
                                    </div>
                                    <div className="text-center">
                                        <Flame className="w-6 h-6 mx-auto mb-2 text-red-600" />
                                        <p className="text-2xl font-bold mb-1">{selectedRecipe.calories}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">卡路里</p>
                                    </div>
                                    <div className="text-center">
                                        <span className={`inline-block px-4 py-2 rounded-xl text-sm font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                                            {selectedRecipe.difficulty}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">难度</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className={`${cardBg} rounded-2xl p-6 shadow-lg mb-6`}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span>🥘</span>
                                食材清单
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <span className="font-medium">{ingredient.name}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{ingredient.amount}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="mt-4 w-full py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                                <span>📝</span>
                                添加到购物清单
                            </button>
                        </div>

                        {/* Steps */}
                        <div className={`${cardBg} rounded-2xl p-6 shadow-lg`}>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span>👨‍🍳</span>
                                制作步骤
                            </h2>
                            <div className="space-y-4">
                                {selectedRecipe.steps.map((step, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 text-white rounded-full flex items-center justify-center font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                            <p>{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-4">
                            <button className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                向AI助手提问
                            </button>
                            <button className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                ✅ 标记为已完成
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 列表页
    return (
        <div className={`min-h-screen ${bgClass} transition-colors duration-300 flex`}>
            {/* Sidebar */}
            <div className={`w-20 ${cardBg} border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-6 space-y-6`}>
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-2xl shadow-lg">
                    <ChefHat className="w-8 h-8 text-white" />
                </div>

                <div className="flex-1 flex flex-col space-y-4">
                    <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <Home className="w-6 h-6" />
                    </button>

                    <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all relative">
                        <MessageCircle className="w-6 h-6" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                    </button>

                    <button className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900 text-orange-600 transition-all">
                        <BookOpen className="w-6 h-6" />
                    </button>

                    <button className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
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
            <div className="flex-1 flex">
                {/* Category Sidebar */}
                <div className={`w-64 ${cardBg} border-r border-gray-200 dark:border-gray-700 p-6 overflow-y-auto`}>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-orange-600" />
                        菜谱分类
                    </h3>
                    <div className="space-y-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center justify-between ${selectedCategory === category.id
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <span className="font-medium">{category.name}</span>
                                </span>
                                <span className={`text-sm ${selectedCategory === category.id ? 'text-white' : 'text-gray-500'}`}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Recipe List */}
                <div className="flex-1 overflow-y-auto">
                    {/* Header */}
                    <div className={`${cardBg} border-b border-gray-200 dark:border-gray-700 px-8 py-4 sticky top-0 z-10`}>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="搜索菜谱或标签..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 ${cardBg}`}
                                />
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                找到 <span className="font-bold text-orange-600">{filteredRecipes.length}</span> 个菜谱
                            </div>
                        </div>
                    </div>

                    {/* Recipe Grid */}
                    <div className="p-8">
                        <div className="grid grid-cols-3 gap-6">
                            {filteredRecipes.map(recipe => (
                                <div
                                    key={recipe.id}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    className={`${cardBg} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group`}
                                >
                                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                                        {recipe.image}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-xl mb-2">{recipe.name}</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {recipe.description}
                                        </p>

                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            {recipe.tags.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> {recipe.time}分钟
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                                                {recipe.difficulty}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                                <Flame className="w-4 h-4 text-orange-500" /> {recipe.calories} 卡
                                            </span>
                                            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {recipe.likes}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeBrowser;
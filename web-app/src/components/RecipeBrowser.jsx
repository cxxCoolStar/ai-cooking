import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Users, Flame, Star, Heart, ArrowLeft, Tag, MessageCircle } from 'lucide-react';

const RecipeBrowser = ({ onAskAI, favoritesOnly = false }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { id: 'all', name: '全部', icon: '📚' },
        { id: '荤菜', name: '荤菜', icon: '🍖' },
        { id: '素菜', name: '素菜', icon: '🥬' },
        { id: '汤羹', name: '汤羹', icon: '🍜' },
        { id: '主食', name: '主食', icon: '🍚' },
        { id: '早餐', name: '早餐', icon: '🥐' },
        { id: '甜品', name: '甜品', icon: '🍰' }
    ];

    // Fetch recipes when category or search changes
    useEffect(() => {
        fetchRecipes();
    }, [selectedCategory, searchQuery, favoritesOnly]);

    const fetchRecipes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedCategory !== 'all') params.append('category', selectedCategory);
            if (searchQuery) params.append('search', searchQuery);
            if (favoritesOnly) params.append('favorite', 'true');

            const res = await fetch(`http://localhost:8000/api/recipes?${params}`);
            const data = await res.json();
            setRecipes(data);
        } catch (error) {
            console.error('Failed to fetch recipes:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipeDetail = async (recipeId) => {
        try {
            const res = await fetch(`http://localhost:8000/api/recipes/${recipeId}`);
            const data = await res.json();
            setSelectedRecipe(data);
        } catch (error) {
            console.error('Failed to fetch recipe detail:', error);
        }
    };

    const toggleFavorite = async (recipe, e) => {
        if (e) e.stopPropagation(); // Prevent opening detail view

        const newFavoriteStatus = !recipe.favorite;

        // Optimistic update for list view
        setRecipes(recipes.map(r =>
            r.id === recipe.id ? { ...r, favorite: newFavoriteStatus } : r
        ));

        // Optimistic update for detail view
        if (selectedRecipe && selectedRecipe.id === recipe.id) {
            setSelectedRecipe({ ...selectedRecipe, favorite: newFavoriteStatus });
        }

        try {
            await fetch(`http://localhost:8000/api/recipes/${recipe.id}/favorite`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ favorite: newFavoriteStatus })
            });
        } catch (error) {
            console.error('Failed to toggle favorite:', error);
            // Revert on error
            setRecipes(recipes.map(r =>
                r.id === recipe.id ? { ...r, favorite: !newFavoriteStatus } : r
            ));
            if (selectedRecipe && selectedRecipe.id === recipe.id) {
                setSelectedRecipe({ ...selectedRecipe, favorite: !newFavoriteStatus });
            }
        }
    };

    const getDifficultyColor = (difficulty) => {
        if (difficulty === '简单' || difficulty <= 2)
            return 'bg-green-100 text-green-700';
        if (difficulty === '中等' || difficulty === 3)
            return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    // Recipe Detail View
    if (selectedRecipe) {
        return (
            <div className="flex-1 flex flex-col bg-transparent">
                <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <button
                        onClick={() => setSelectedRecipe(null)}
                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        返回菜谱列表
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                        <span className="text-7xl">{selectedRecipe.image}</span>
                                        <div>
                                            <h1 className="text-4xl font-bold mb-2">{selectedRecipe.name}</h1>
                                            <p className="text-gray-600">{selectedRecipe.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mb-4">
                                        {selectedRecipe.tags.map((tag, index) => (
                                            <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => toggleFavorite(selectedRecipe, e)}
                                    className={`p-4 rounded-2xl transition-all ${selectedRecipe.favorite
                                        ? 'bg-red-100 text-red-600'
                                        : 'bg-red-50 text-gray-400 hover:bg-red-100 hover:text-red-600'
                                        }`}
                                >
                                    <Heart className={`w-6 h-6 ${selectedRecipe.favorite ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="grid grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                                        <p className="text-2xl font-bold mb-1">{selectedRecipe.time}分钟</p>
                                        <p className="text-sm text-gray-500">烹饪时间</p>
                                    </div>
                                    <div className="text-center">
                                        <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                        <p className="text-2xl font-bold mb-1">{selectedRecipe.servings}人份</p>
                                        <p className="text-sm text-gray-500">份量</p>
                                    </div>
                                    <div className="text-center">
                                        <Flame className="w-6 h-6 mx-auto mb-2 text-red-600" />
                                        <p className="text-2xl font-bold mb-1">{selectedRecipe.calories || '未知'}</p>
                                        <p className="text-sm text-gray-500">卡路里</p>
                                    </div>
                                    <div className="text-center">
                                        <span className={`inline-block px-4 py-2 rounded-xl text-sm font-medium ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                                            {selectedRecipe.difficulty}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-2">难度</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span>🥘</span>
                                食材清单
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <span className="font-medium">{ingredient.name}</span>
                                        <span className="text-gray-600">{ingredient.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
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
                                        <div className="flex-1 p-4 bg-gray-50 rounded-xl">
                                            <p>{step}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => onAskAI && onAskAI(selectedRecipe.name)}
                                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                            >
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

    // Recipe List View
    return (
        <div className="flex-1 flex bg-transparent">
            {/* Category Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
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
                                : 'hover:bg-gray-100'
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-2xl">{category.icon}</span>
                                <span className="font-medium">{category.name}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipe List */}
            <div className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="搜索菜谱或标签..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                            />
                        </div>
                        <div className="text-sm text-gray-500">
                            找到 <span className="font-bold text-orange-600">{recipes.length}</span> 个菜谱
                        </div>
                    </div>
                </div>

                {/* Recipe Grid */}
                <div className="p-8">
                    {loading ? (
                        <div className="text-center text-gray-500 py-12">加载中...</div>
                    ) : recipes.length === 0 ? (
                        <div className="text-center text-gray-500 py-12">未找到菜谱</div>
                    ) : (
                        <div className="grid grid-cols-3 gap-6">
                            {recipes.map(recipe => (
                                <div
                                    key={recipe.id}
                                    onClick={() => fetchRecipeDetail(recipe.id)}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group"
                                >
                                    <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                                        {recipe.image}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-xl mb-2">{recipe.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {recipe.description}
                                        </p>

                                        <div className="flex gap-2 mb-3 flex-wrap">
                                            {recipe.tags.slice(0, 2).map((tag, index) => (
                                                <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" /> {recipe.time}分钟
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                                                {recipe.difficulty <= 2 ? '简单' : recipe.difficulty === 3 ? '中等' : '困难'}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                            <span className="text-sm text-gray-600 flex items-center gap-1">
                                                <Flame className="w-4 h-4 text-orange-500" /> {recipe.calories || '未知'} 卡
                                            </span>
                                            <button
                                                onClick={(e) => toggleFavorite(recipe, e)}
                                                className={`flex items-center gap-1 text-sm transition-colors ${recipe.favorite
                                                    ? 'text-red-500'
                                                    : 'text-gray-600 hover:text-red-500'
                                                    }`}
                                            >
                                                <Heart className={`w-4 h-4 ${recipe.favorite ? 'fill-current' : ''}`} />
                                                {recipe.likes}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecipeBrowser;

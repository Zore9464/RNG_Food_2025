const teamMembers = [
    {
        id: 1, name: "林品承", studentId: "112111113",
        role: "前端開發、UI設計師", avatar: "person",
        email: "11211113@mail.aeust.edu.tw", github: "PINCHENG612",
        description: "負責UI/UX設計與前端互動功能等"
    },
    {
        id: 2, name: "林劭瑋", studentId: "112111125",
        role: "前端開發、UI設計師", avatar: "person",
        email: "aka0903912930@gmail.com", github: "Zore9464",
        description: "負責UI/UX設計與前端互動功能等"
    },
    {
        id: 3, name: "呂佩衫", studentId: "11211121",
        role: "後端開發、UI設計師", avatar: "person",
        email: "peishenlu@gmail.com", github: "peishenlu",
        description: "負責視覺設計與使用者體驗，負責資料庫設計與API開發"
    }
];

const foods = [
    { name: "燒餅油條配豆漿", rating: "傳統滋味，酥脆口感", description: "燒餅、油條、冰豆漿", location: "豆漿大王", price: "NT$ 45", stars: 4, category: "light", time: ["breakfast"], tags: ["budget", "traditional"] },
    { name: "起司蛋餅", rating: "餅皮酥脆，起司牽絲", description: "手工蛋餅皮、切達起司、雞蛋", location: "巷口早餐店", price: "NT$ 40", stars: 5, category: "light", time: ["breakfast", "lunch"], tags: ["budget", "quick", "popular"] },
    { name: "牛肉麵", rating: "湯頭濃郁，牛肉軟嫩", description: "半筋半肉牛肉、手工麵條", location: "台北市大安區", price: "NT$ 150", stars: 4, category: "noodle", time: ["lunch", "dinner"], tags: ["spicy", "popular"] },
    { name: "滷肉飯", rating: "滷汁香濃，米飯飽滿", description: "滷肉、米飯、滷蛋", location: "台北市中正區", price: "NT$ 50", stars: 5, category: "rice", time: ["lunch", "dinner"], tags: ["budget", "quick", "popular"] },
    { name: "日式拉麵", rating: "湯頭醇厚", description: "豚骨湯底、叉燒", location: "台北市信義區", price: "NT$ 220", stars: 4, category: "noodle", time: ["lunch", "dinner"], tags: ["popular"] },
    { name: "義大利麵", rating: "醬汁濃郁", description: "義大利麵、番茄肉醬", location: "台北市中山區", price: "NT$ 180", stars: 4, category: "western", time: ["lunch", "dinner"], tags: ["popular"] },
    { name: "健康沙拉", rating: "新鮮蔬菜", description: "生菜、番茄、雞胸肉", location: "台北市大安區", price: "NT$ 120", stars: 3, category: "light", time: ["breakfast", "lunch"], tags: ["healthy", "vegetarian"] },
    { name: "港式燒臘", rating: "肉質鮮美", description: "燒鴨、叉燒、油雞", location: "台北市萬華區", price: "NT$ 110", stars: 4, category: "rice", time: ["lunch", "dinner"], tags: ["popular", "budget"] },
    { name: "韓式拌飯", rating: "辣醬夠味", description: "米飯、牛肉、蔬菜", location: "台北市松山區", price: "NT$ 160", stars: 4, category: "rice", time: ["lunch", "dinner"], tags: ["spicy", "popular"] },
    { name: "素食餐盒", rating: "清爽不油膩", description: "五穀飯、時蔬", location: "台北市文山區", price: "NT$ 90", stars: 3, category: "light", time: ["lunch", "dinner"], tags: ["vegetarian", "healthy", "budget"] }
];

module.exports = { teamMembers, foods };
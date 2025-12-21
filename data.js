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
    {
        name: "燒餅油條配豆漿", rating: "傳統滋味，酥脆口感，豆香濃郁",
        description: "燒餅、油條、冰豆漿", location: "豆漿大王",
        price: "NT$ 45", stars: 4, category: "light", time: ["breakfast"],
        tags: ["budget", "traditional"]
    },
    {
        name: "起司蛋餅", rating: "餅皮酥脆，起司牽絲，喚醒早晨",
        description: "手工蛋餅皮、切達起司、雞蛋", location: "巷口早餐店",
        price: "NT$ 40", stars: 5, category: "light", time: ["breakfast", "lunch"],
        tags: ["budget", "quick", "popular"]
    },
    {
        name: "牛肉麵", rating: "湯頭濃郁，牛肉軟嫩，麵條Q彈",
        description: "半筋半肉牛肉、手工麵條、青菜、蔥花", location: "台北市大安區忠孝東路四段",
        price: "NT$ 150", stars: 4, category: "noodle", time: ["lunch", "dinner"],
        tags: ["spicy", "popular"]
    },
    {
        name: "滷肉飯", rating: "滷汁香濃，米飯飽滿，肥瘦適中",
        description: "滷肉、米飯、滷蛋、黃瓜片", location: "台北市中正區羅斯福路一段",
        price: "NT$ 50", stars: 5, category: "rice", time: ["lunch", "dinner"],
        tags: ["budget", "quick", "popular"]
    },
    {
        name: "日式拉麵", rating: "湯頭醇厚，叉燒入口即化",
        description: "豚骨湯底、叉燒、溏心蛋、海苔、筍乾", location: "台北市信義區松壽路",
        price: "NT$ 220", stars: 4, category: "noodle", time: ["lunch", "dinner"],
        tags: ["popular"]
    },
    {
        name: "義大利麵", rating: "醬汁濃郁，麵條彈牙，配料豐富",
        description: "義大利麵、番茄肉醬、起司、羅勒", location: "台北市中山區南京東路",
        price: "NT$ 180", stars: 4, category: "western", time: ["lunch", "dinner"],
        tags: ["popular"]
    },
    {
        name: "健康沙拉", rating: "新鮮蔬菜，營養均衡，輕食首選",
        description: "生菜、番茄、雞胸肉、堅果、油醋醬", location: "台北市大安區仁愛路四段",
        price: "NT$ 120", stars: 3, category: "light", time: ["breakfast", "lunch"],
        tags: ["healthy", "vegetarian"]
    },
    {
        name: "港式燒臘", rating: "肉質鮮美，皮脆肉嫩，醬汁獨特",
        description: "燒鴨、叉燒、油雞、青菜、白飯", location: "台北市萬華區西門町",
        price: "NT$ 110", stars: 4, category: "rice", time: ["lunch", "dinner"],
        tags: ["popular", "budget"]
    },
    {
        name: "韓式拌飯", rating: "辣醬夠味，配料豐富，口感層次多",
        description: "米飯、牛肉、蔬菜、雞蛋、韓式辣醬", location: "台北市松山區市民大道",
        price: "NT$ 160", stars: 4, category: "rice", time: ["lunch", "dinner"],
        tags: ["spicy", "popular"]
    },
    {
        name: "素食餐盒", rating: "清爽不油膩，營養均衡，素食者首選",
        description: "五穀飯、時蔬、豆腐、菇類、堅果", location: "台北市文山區興隆路",
        price: "NT$ 90", stars: 3, category: "light", time: ["lunch", "dinner"],
        tags: ["vegetarian", "healthy", "budget"]
    }
];

module.exports = { teamMembers, foods };
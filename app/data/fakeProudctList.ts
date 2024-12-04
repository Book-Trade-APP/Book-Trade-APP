import { Product } from "../interface/Product";
export const fake_products: Product[] = generateFakeProductData(); //假資料修改的地方在這！！！！！！

function generateFakeProductData() {
  // 函數用來生成隨機的日期
  const generateRandomDate = () => {
    const start = new Date(2000, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
  };

  // 函數用來生成隨機的ISBN碼（13位數字）
  const generateRandomISBN = () => {
    return Math.floor(1000000000000 + Math.random() * 9000000000000);
  };

  // 函數用來生成隨機價格（介於100到1000之間）
  const generateRandomPrice = () => {
    return Math.floor(Math.random() * 900) + 100;
  };

  // 隨機選擇語言、狀態
  const getRandomLanguage = () => {
    return Math.random() < 0.5 ? '中文' : '英文';
  };

  const getRandomCondition = () => {
    return Math.random() < 0.5 ? '全新' : '二手';
  };

  // 隨機生成出版社（隨機三個英文字母）
  const generateRandomPublisher = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let publisher = '';
    for (let i = 0; i < 3; i++) {
      publisher += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return publisher;
  };
  const imageMap = [
    require('../../assets/fake/Hachiware.jpg'),
    require('../../assets/fake/KuriManju.jpg'),
    require('../../assets/fake/Momonga.jpg'),
    require('../../assets/fake/Rakko.jpg'),
    require('../../assets/fake/Shisa.jpg'),
    require('../../assets/fake/SleepParty.jpg'),
    require('../../assets/fake/Star.jpg'),
    require('../../assets/fake/Usagi.jpg'),
    require('../../assets/fake/Yoroi San1.jpg'),
    require('../../assets/fake/Yoroi San2.jpg'),
    require('../../assets/fake/Yoroi San3.jpg'),
  ]
  const categories: ("文學" | "藝術" | "哲學宗教" | "人文史地" | "自然科普" | "社會科學" | "商業理財" | "語言學習" | "醫療保健" | "旅遊休閒" | "電腦資訊" | "考試用書" | "動畫/遊戲")[] = [
    '文學', '藝術', '哲學宗教', '人文史地', '自然科普', '社會科學', '商業理財', '語言學習', '醫療保健', '旅遊休閒', '電腦資訊', '考試用書', '動畫/遊戲'
  ];

  const names = ['Hachiware', 'KuriManju', 'Momonga', 'Rakko', 'Shisa', 'SleepParty', 'Star', 'Usagi', 'Yoroi San1', 'Yoroi San2', 'Yoroi San3'];

  // 生成numProducts個隨機的Product物件
  const products = [];
  for (let i = 0; i < 11; i++) {
    const name = names[i]; // 從書名陣列中循環取值
    const product: Product = {
      id: i + 1, // 自動增加id
      name: name,
      language: getRandomLanguage(),
      category: categories[Math.floor(Math.random() * categories.length)], // 隨機書籍類別
      condiction: getRandomCondition(),
      author: name, // 作者為書名
      publisher: generateRandomPublisher(), // 隨機三個字母的出版社
      publishDate: generateRandomDate(),
      ISBN: generateRandomISBN(),
      price: generateRandomPrice(),
      description: '我是一隻兔子\n\n\n',
      photouri: imageMap[i] // 圖片路徑
    };
    products.push(product);
  }
  return products;
}

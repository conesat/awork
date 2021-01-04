// 加载模块
const nedb = require('nedb');
 
// 实例化连接对象（不带参数默认为内存数据库）
const db = new nedb({
  filename: '/data/save.db',
  autoload: true
});
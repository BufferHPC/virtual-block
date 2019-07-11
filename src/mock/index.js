// 使用 Mock 构建本地服务器输出数据结果
const Mock = require('mockjs');
const express = require('express');
const app = express();
//生成模拟的数据
function generatorList(num) {
  return Mock.mock({
    [`list|${num}`]: [{
      'id|+1': 1,
      title: "@ctitle(10,30)",
      image: "@image('250x250','@color','@name')",
      content: "@cparagraph(3,5)",
      time:"@natural(0, 1000)",
      stars:'@datetime'
    }]
  });
}
//允许跨域请求返回数据
app.all('/data', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
//截取路由并反馈数据
app.get("/data", function (req, res) {
  const { num } = req.query;
  return res.send(generatorList(num));
})
//设置端口并打印对应调用结果
const server = app.listen(4000, function () {
  console.log("http://%s:%s/data?num=100", server.address().port);
})
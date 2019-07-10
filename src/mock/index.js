// 使用 Mock 构建本地服务器输出数据结果
const Mock = require('mockjs');
const express = require('express');
const app = express();

function generatorList(num) {
  return Mock.mock({
    [`list|${num}`]: [{
      'id|+1': 1,
      title: "@ctitle",
      image: "@image('250x250','@color','@name')",
      content: "@cparagraph"
    }]
  });
}

app.all('/data', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get("/data", function (req, res) {
  const {num} = req.query
  return res.send(generatorList(num));
})

const server = app.listen(4000, function () {
  const host = "localhost"
  const port = server.address().port
  console.log("http://%s:%s/data?num=100", host, port)
})

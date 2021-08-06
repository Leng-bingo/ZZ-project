var express = require('express'); //express框架模块
var path = require('path'); //系统路径模块
var fs = require('fs'); //文件模块
var bodyParser = require('body-parser'); //对post请求的请求体进行解析模块
var app = express();
var sd = require('silly-datetime'); // 获取系统时间包
var mysql = require('mysql');  //导入mysql包
var cors = require("cors"); // 这个比较重要，解决跨域问题.npm install cors 装一下
// var nodeExcel = require('excel-export'); // 导出excel
// 异步运行
var exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false })); //bodyParser.urlencoded 用来解析request中body的 urlencoded字符，只支持utf-8的编码的字符，也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。

// 定时刷新
var schedule = require('node-schedule');
// function scheduleCronstyle(){
//   schedule.scheduleJob('30 * * * * *', function(){
//       console.log('scheduleCronstyle:' + new Date());
//   }); 
// }

// scheduleCronstyle();
//跨域
app.use(cors({}))

//连接本地mysql数据库

// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'lgn970722',
//     port: '3306',
//     database: 'mySpider',
//     useConnectionPooling: true,
//     timezone: '08:00'
//   });
// connection.connect();

//连接微博爬虫mysql数据库

var connection = mysql.createConnection({
  // host: '10.8.21.166',
  host: 'localhost',
  user: 'root',
  password: 'lgn970722',
  port: '3306',
  database: 'weibo',
  useConnectionPooling: true,
  timezone: '08:00',
  multipleStatements: true // 支持执行多条 sql 语句
});
connection.connect();

// 分页本地测试complex_table_data mysql数据
app.get('/complex-table_data', function (req, res) {
  var response = {
    "page": req.query.page,
    "limit": req.query.limit,
  };
  console.log(req.query.page)
  //  var selectSQL = "SELECT * from alarmData";
  //
  a = (response.page - 1) * req.query.limit;
  console.log('a:' + a);
  console.log(typeof(req.query.type));
  
  if(typeof(req.query.type) != "undefined" && req.query.type != ""){
    a = (response.page - 1) * req.query.limit;
    var selectSQL = "select count(*) as count from complex_table_data where type='" + req.query.type + "';select * from complex_table_data where type='" + req.query.type + "' order by id desc limit " + req.query.limit + " offset " + a;
    console.log(selectSQL)
    connection.query(selectSQL, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        // console.log(selectSQL);
        // console.log(result);
        // res.json({success_code: 200, message: '获取分页数据成功', data: results })
        // for (var i = 0; i < result.length; i++) {
        //   result[i].alarmGrade = +result[i].alarmGrade
  
        // };
        var sum = result[0].id + req.query.limit * (req.query.page - 1)
        console.log(result[0][0].count)
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: {
            total: result[0][0].count,
            items: result[1]
          }
        }));
        // res.json(data:result)

      }
    });
  }else{
    var selectSQL = "select * from complex_table_data order by id desc limit " + req.query.limit + " offset " + a;
    connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[data ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("数据没了");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      // console.log(selectSQL);
      // console.log(result);
      // res.json({success_code: 200, message: '获取分页数据成功', data: results })
      // for (var i = 0; i < result.length; i++) {
      //   result[i].alarmGrade = +result[i].alarmGrade

      // };
      var sum = result[0].id + req.query.limit * (req.query.page - 1)
      //解决中文乱码，加入头文件
      // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
      res.end(JSON.stringify({
        code: 20000,
        data: {
          total: sum,
          items: result
        }
      }));
      // res.json(data:result)

    }
  });

  // res.end(JSON.stringify(response));
  }

  
})

// 实际本地测试微博mysql数据
app.get('/weibo-table_data', function (req, res) {
  var response = {
    "page": req.query.page,
    "limit": req.query.limit,
  };
  // console.log(req.query.page)
  //  var selectSQL = "SELECT * from alarmData";
  //
  a = (response.page - 1) * req.query.limit;
  // console.log('a:' + a);
  console.log('标签1的类型',typeof(req.query.item1))
  console.log('标签1的内容',req.query.item1)
  console.log('搜索的类型',typeof(req.query.text))
  console.log('搜索的内容',req.query.text)
  if(typeof(req.query.text) == "string" && req.query.text != "" && typeof(req.query.item1) == "string" && req.query.item1 != ""){
    a = (response.page - 1) * req.query.limit;
    var selectSQL_both = "select count(*) as count from weibo where item1='" + req.query.item1 + "' and text like '%"+ req.query.text +"%';select * from weibo where item1='" + req.query.item1 + "' and text like '%" + req.query.text + "%' order by myid desc limit " + req.query.limit + " offset " + a;
    console.log('两个全有',selectSQL_both)
    connection.query(selectSQL_both, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        var sum = result[0].myid + req.query.limit * (req.query.page - 1)
        console.log(result[0][0].count)
        // console.log(result[0])
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: {
            total: result[0][0].count,
            items: result[1]
          }
        }));
        // res.json(data:result)
      }
    });
  }else if(req.query.table_name != "" && typeof(req.query.text) != "undefined"){
    // console.log(req.query)
    a = (response.page - 1) * req.query.limit;
    var selectSQL_both = "select count(*) as count from "+ req.query.table_name +" where text like '%" + req.query.text + "%';select * from "+ req.query.table_name +" where text like '%" +req.query.text +"%' order by myid desc limit " + req.query.limit + " offset " + a;
    console.log('数据库表名和内容',selectSQL_both)
    connection.query(selectSQL_both, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        // console.log(selectSQL);
        // console.log(result);
        // res.json({success_code: 200, message: '获取分页数据成功', data: results })
        // for (var i = 0; i < result.length; i++) {
        //   result[i].alarmGrade = +result[i].alarmGrade
  
        // };
        var sum = result[0].myid + req.query.limit * (req.query.page - 1)
        console.log(result[0][0].count)
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: {
            total: result[0][0].count,
            items: result[1]
          }
        }));
        // res.json(data:result)

      }
    });
  }else if(req.query.table_name != "" && typeof(req.query.table_name) != "undefined"){
    a = (response.page - 1) * req.query.limit;
    var selectSQL = "select count(*) as count from "+ req.query.table_name +";select * from "+ req.query.table_name +" order by myid desc limit " + req.query.limit + " offset " + a;
    console.log('只有数据库表名',selectSQL)
    connection.query(selectSQL, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        // console.log(selectSQL);
        // console.log(result);
        // res.json({success_code: 200, message: '获取分页数据成功', data: results })
        // for (var i = 0; i < result.length; i++) {
        //   result[i].alarmGrade = +result[i].alarmGrade
  
        // };
        var sum = result[0].myid + req.query.limit * (req.query.page - 1)
        console.log(result[0][0].count)
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: {
            total: result[0][0].count,
            items: result[1]
          }
        }));
        // res.json(data:result)

      }
    });
  }else if(typeof(req.query.item1) != "undefined" && req.query.item1 != ""){
    a = (response.page - 1) * req.query.limit;
    var selectSQL = "select count(*) as count from weibo where item1='" + req.query.item1 + "';select * from weibo where item1='" + req.query.item1 + "' order by myid desc limit " + req.query.limit + " offset " + a;
    console.log('只有标签',selectSQL)
    connection.query(selectSQL, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        // console.log(selectSQL);
        // console.log(result);
        // res.json({success_code: 200, message: '获取分页数据成功', data: results })
        // for (var i = 0; i < result.length; i++) {
        //   result[i].alarmGrade = +result[i].alarmGrade
  
        // };
        var sum = result[0].myid + req.query.limit * (req.query.page - 1)
        console.log(result[0][0].count)
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: {
            total: result[0][0].count,
            items: result[1]
          }
        }));
        // res.json(data:result)

      }
    });  
  }else if(typeof(req.query.text) != "undefined" && req.query.text != ""){
    a = (response.page - 1) * req.query.limit;
    var selectSQL_both = "select count(*) as count from weibo where text like '%"+ req.query.text +"%';select * from weibo where text like '%" + req.query.text + "%' order by myid desc limit " + req.query.limit + " offset " + a;
    console.log('只有搜索内容',selectSQL_both)
    connection.query(selectSQL_both, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        // console.log(selectSQL);
        // console.log(result);
        // res.json({success_code: 200, message: '获取分页数据成功', data: results })
        // for (var i = 0; i < result.length; i++) {
        //   result[i].alarmGrade = +result[i].alarmGrade
  
        // };
        var sum = result[0].myid + req.query.limit * (req.query.page - 1)
        console.log(result[0][0].count)
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: {
            total: result[0][0].count,
            items: result[1]
          }
        }));
        // res.json(data:result)

      }
    });  
  }else{
    var selectSQL = "select * from weibo order by myid desc limit " + req.query.limit + " offset " + a;
    connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[data ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("数据没了");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      // console.log(selectSQL);
      // console.log(result);
      // res.json({success_code: 200, message: '获取分页数据成功', data: results })
      // for (var i = 0; i < result.length; i++) {
      //   result[i].alarmGrade = +result[i].alarmGrade

      // };
      var sum = result[0].myid + req.query.limit * (req.query.page - 1)
      //解决中文乱码，加入头文件
      // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
      res.end(JSON.stringify({
        code: 20000,
        data: {
          total: sum,
          items: result
        }
      }));
      // res.json(data:result)

    }
  });

  // res.end(JSON.stringify(response));
  }

  
})

app.get('/delete_weibotable_data', function(req,res) {
  // var selectSQL_both = "delete from "+ req.query.table_name +" where text like '%" + req.query.text + "%' limit 2";
  if(typeof(req.query.item1) != "undefined" && req.query.item1 != ''){
    var selectSQL_three = "delete from "+ req.query.table_name +" where text like '%" + req.query.text + "%' and item1 = '"+ req.query.item1+"'";
    console.log(selectSQL_three)
    connection.query(selectSQL_three, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        // console.log(selectSQL);
        // console.log(result);
        // res.json({success_code: 200, message: '获取分页数据成功', data: results })
        // for (var i = 0; i < result.length; i++) {
        //   result[i].alarmGrade = +result[i].alarmGrade
  
        // };
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: "1"
        }));
        // res.json(data:result)
  
      }
    });
  }else{
    var selectSQL_both = "delete from "+ req.query.table_name +" where text like '%" + req.query.text + "%'";
    console.log(selectSQL_both)
    connection.query(selectSQL_both, function (err, result) {
      if (err) {
        console.log('[data ERROR] - ', err.message);
        return;
      }
      //console.log(result);
      if (result == '') {
        console.log("数据没了");
        res.end("0");//如果登录失败就给客户端返回0，
      }
      else {
        // console.log(selectSQL);
        // console.log(result);
        // res.json({success_code: 200, message: '获取分页数据成功', data: results })
        // for (var i = 0; i < result.length; i++) {
        //   result[i].alarmGrade = +result[i].alarmGrade
  
        // };
        //解决中文乱码，加入头文件
        // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
        res.end(JSON.stringify({
          code: 20000,
          data: "1"
        }));
        // res.json(data:result)
  
      }
    });
  }
})

//测试post接口
app.post('/test_post_method', function (req, res) {
  // JSON.stringify(params)
  // res.send(req.query)
  console.log('获取到的值:', req.query)
  res.send(JSON.stringify({
    code: 20000,
    data: req.query
  }));

  // var file = path.join(__dirname, 'data/test.json'); //文件路径，__dirname为当前运行js文件的目录
  // //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

  // //读取json文件
  // fs.readFile(file, 'utf-8', function(err, data) {
  //     if (err) {
  //         res.send('文件读取失败');
  //     } else {
  //         res.send(data);
  //         console.log('数据读取成功');
  //     }
  // });

})

// 下载视频文件接口
app.get('/video', function (req, res) {
  fs.writeFile("spider_data.txt", req.query.content, error => {
    console.log("写入关键字成功");
    res.send(JSON.stringify({
      code: 20000,
      data: '1'
    }));
    exec('python haokan_spyder.py',function(error,stdout,stderr){
      console.log('exec: ' + stdout);
      })
  });
})


// 查询视频下载数量
app.get('/video_num',function(req,res) {
  const dir = './video'
  function shuliang(path) {
    let arr = fs.readdirSync(path)
    return arr.length
  }
  function file_name(path) {
    let arr = fs.readdirSync(path)
    return arr
  }
  function daxiao(path) {
    let arr = fs.statSync(path)
    return arr.size
  }
  let arr = fs.readdirSync(dir)
  console.log(arr)
  var sum = 0
  var size = 0
  for (let i = 0; i < arr.length; i++) {
    var mydir = dir + '/' + arr[i]
    var a = shuliang(mydir)
    sum = sum + a
  }
  for(let i = 0; i< arr.length; i++){
    var mydir = dir + '/' + arr[i]
    detail_name = file_name(mydir)
    for(let i = 0; i < detail_name.length; i++) {
        detail_dir = mydir + '/' + detail_name[i]
        size = size + daxiao(detail_dir)
    }
  }
  console.log(sum)
  size = size/1024/1024
  size = size.toFixed(2)
  size = size + 'MB'
  console.log(size)
  res.send(JSON.stringify({
    code: 20000,
    data: arr,
    sum: sum,
    size: size
  }));
})

// 查询图片数量以及大小
app.get('/photo_num',function(req,res) {
  const dir = 'D://project//视频抽取图片//vedio//北京'
  function shuliang(path) {
    let arr = fs.readdirSync(path)
    return arr.length
  }
  function file_name(path) {
    let arr = fs.readdirSync(path)
    return arr
  }
  function daxiao(path) {
    let arr = fs.statSync(path)
    return arr.size
  }
  let arr = fs.readdirSync(dir)
  console.log(arr)
  var sum = 0
  var size = 0
  for (let i = 0; i < arr.length; i++) {
    var mydir = dir + '/' + arr[i]
    var a = shuliang(mydir)
    sum = sum + a
  }
  for(let i = 0; i< arr.length; i++){
    var mydir = dir + '/' + arr[i]
    detail_name = file_name(mydir)
    for(let i = 0; i < detail_name.length; i++) {
        detail_dir = mydir + '/' + detail_name[i]
        size = size + daxiao(detail_dir)
    }
  }
  console.log(sum)
  size = size/1024/1024
  size = size.toFixed(2)
  size = size + 'MB'
  console.log(size)
  res.send(JSON.stringify({
    code: 20000,
    data: arr,
    sum: sum,
    size: size
  }));
})

// 查询视频具体名字
app.get('/video_table',function(req,res) {
  var arr = fs.readdirSync('./video')
  console.log(arr)

  function file_name(path) {
      let arr = fs.readdirSync(path)
      return arr
  }

  function wenjian(path) {
      let arr = fs.readdirSync(path)
      return arr
  }
  var all_name = []
  for(let i = 0; i< arr.length; i++){
      var mydir = './video' + '/' + arr[i]
      var name = wenjian(mydir)
      all_name.push(name)
  }
  var final_name = {}
  res.send(JSON.stringify({
    code: 20000,
    data: arr,
    all_name: all_name,
    total: all_name.length
  }))
})

//测试get接口
app.get('/test_get_method', function (req, res) {
  // JSON.stringify(params)
  // res.send(req.query)
  console.log('获取到的值:', req.query)
  res.send(JSON.stringify({
    code: 20000,
    data: req.query
  }));

  // var file = path.join(__dirname, 'data/test.json'); //文件路径，__dirname为当前运行js文件的目录
  // //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

  // //读取json文件
  // fs.readFile(file, 'utf-8', function(err, data) {
  //     if (err) {
  //         res.send('文件读取失败');
  //     } else {
  //         res.send(data);
  //         console.log('数据读取成功');
  //     }
  // });

})

// 登录接口
app.get('/user/login', function (req, res) {
  res.end(JSON.stringify({
    code: 20000,
    data: {
      "token": "admin-token"
    }
  }));
})

// post登录接口
app.post('/mylogin/token', function (req, res) {
  var response = {
    "grant_type": req.query.grant_type,
    "client_id": req.query.client_id,
    "client_secret": req.query.client_secret,
    "username": req.query.username,
    "password": req.query.password,
  };
  if (response.grant_type == 'password' && response.client_id == 'client' && response.client_secret == '123456' && response.username == 'admin' && response.password == '123456') {
    res.end(res.result)
    console.log('ok')
  }
})

// post获取用户信息
app.post('/mylogin/token', function (req, res) {
  var response = {
    "grant_type": req.query.grant_type,
    "client_id": req.query.client_id,
    "client_secret": req.query.client_secret,
    "username": req.query.username,
    "password": req.query.password,
  };
  if (response.grant_type == 'password' && response.client_id == 'client' && response.client_secret == '123456' && response.username == 'admin' && response.password == '123456') {
    res.end(res.result)
    console.log('ok')
  }
})

// 根据token获取用户信息
app.get('/user/info', function (req, res) {
  console.log(req.query.token)
  // if(req.query.token=='admin-token'){
  //   console.log('获取成功')
  // }
  if (req.query.token == 'admin-token') {
    res.end(JSON.stringify({
      "code": 20000,
      "data": {
        "roles": ["admin"],
        "introduction": "I am a super administrator",
        "avatar": "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
        "name": "Super Admin"
      }
    }));
  } else {
    console.log('获取用户信息失败')
    res.end(console.log('获取用户信息失败'))
  }

})

// 分页微博数据mysql数据
app.get('/weibo_data', function (req, res) {
  var response = {
    "page": req.query.page,
    "limit": req.query.limit,
  };
  console.log(req.query.page)
  //  var selectSQL = "SELECT * from alarmData";
  //
  a = (response.page - 1) * req.query.limit;
  console.log('a:' + a);
  var selectSQL = "select * from 北京 limit " + req.query.limit + " offset " + a;
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[data ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("数据没了");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      // console.log(selectSQL);
      console.log(result);
      // res.json({success_code: 200, message: '获取分页数据成功', data: results })
      // for (var i = 0; i < result.length; i++) {
      //   result[i].alarmGrade = +result[i].alarmGrade

      // };
      //解决中文乱码，加入头文件
      // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
      res.end(JSON.stringify({
        code: 20000,
        data: {
          total: 100,
          items: result
        }
      }));
      // res.json(data:result)

    }
  });
  //  console.log(result);
  //res.end(JSON.stringify(response));
})


// 判断是否重复
app.get('/just_duplicate',function(req,res) {
  var selectSQ2 = "select * from label where locate('" + req.query.item1 + "',label1)"
  console.log(selectSQ2)
  connection.query(selectSQ2, function (err, result) {
    console.log(result[0]);
    var exp = undefined
    if(typeof(result[0]) === typeof(exp)){
      console.log('可以插入标签')
      res.end(JSON.stringify({
        code: 20000,
        data: "1"
      }));
    }else{
      console.log('已有这个标签')
      res.end(JSON.stringify({
        code: 20000,
        data: "0"
      }));
    }
  });  
})

// 判断是否重复2
app.get('/just_duplicate2',function(req,res) {
  var selectSQ2 = "select * from label where locate('" + req.query.label1 + "',label1)"
  console.log(selectSQ2)
  connection.query(selectSQ2, function (err, result) {
    console.log(result[0]);
    var exp = undefined
    if(typeof(result[0]) === typeof(exp)){
      console.log('可以插入标签')
      res.end(JSON.stringify({
        code: 20000,
        data: "1"
      }));
    }else{
      console.log('已有这个标签')
      res.end(JSON.stringify({
        code: 20000,
        data: "0"
      }));
    }
  });  
})

// 存入标签1
app.get('/save_label1', function (req, res) {
  var selectSQL = "insert into label (label1) values " + "('" + req.query.label1 + "')"
  connection.query(selectSQL, function (err, result) {
    console.log(selectSQL)
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博标签插入成功");
      res.end(JSON.stringify({
        code: 20000,
        data: "label success"
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 存入标签1
app.get('/save_item1', function (req, res) {
  var selectSQL = "insert into label (label1) values " + "('" + req.query.item1 + "')"
  connection.query(selectSQL, function (err, result) {
    console.log(selectSQL)
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博标签插入成功");
      res.end(JSON.stringify({
        code: 20000,
        data: "label success"
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 查询标签
app.get('/find_label1', function (req, res) {
  var selectSQL = "select * from label"
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博标签查询成功");
      res.end(JSON.stringify({
        code: 20000,
        data: result
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 查询每个标签下有多少数据，为了作图
app.get('/total_label1', function (req, res) {
  // var selectSQL = "select * from label"
  // console.log(selectSQL)
  console.log(req.method);//get
  console.log(req.method,req.query.data)
  // console.log(req.query.data[0])
  var s = ""
  for(i=0;i<req.query.data.length;i++){
    var s1 = "select count(*) as " 
    var s2 = req.query.data[i] 
    var s3 = " from weibo where item1='"
    var s4 = req.query.data[i]
    var s5 = "';"
    var s = s+s1+s2+s3+s4+s5;
  }
  // console.log(s)
  connection.query(s, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      // all_label = [];
      // for(let i=0;i<result.length;i++){
      //   all_label.push({
      //     value: result.
      //   })
      // }
      var all_label = []
      console.log(result.length)
      for(let i=0;i<result.length;i++){
        for (key in result[i][0]){
          console.log(key);
          //add your statement to get key value
        }
        all_label.push({
          value: result[i][0][key],
          name: key
          // [temp]: result[i][0][key]
        })
      }
      console.log(all_label)
      // for (key in result[0][0]){
      //   console.log(key);
      //   //add your statement to get key value
      // }
      // console.log(result[0][0]['黑龙江'])
      // console.log(result[0].keys());
      console.log("微博标签总数查询成功");
      res.end(JSON.stringify({
        code: 20000,
        data: all_label
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 修改测试微博数据
app.post('/modify_weibo_data', function (req, res) {


  console.log('获取到的值:', req.query)
  // res.send(JSON.stringify({
  //     code :20000,
  //     data: req.query
  // }));
  var selectSQL = "UPDATE complex_table_data set title= '" + req.query.title + "' where id = '" + req.query.id + "' ";
  console.log(selectSQL)
  //var selectSQL = "select password from user where account='"+req.query.account+"'";
  // var addSqlParams = [req.query.account, req.query.password];
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据修改成功");
      res.end(JSON.stringify({
        code: 20000,
        data: {
          total: 100,
          items: "modify success"
        }
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
  // res.end(JSON.stringify(response));
})

// 存入创建项目id以及标签
app.get('/save_jobid',function(req,res) {
  var selectSQL = "insert into jobid (label,status,jobid) values ('"+ req.query.label+"','"+req.query.status+"','"+req.query.jobid+"');"
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end(JSON.stringify({
        code: 20000,
        data: "0"
      }));
    }
    else {
      console.log("创建任务存入成功");
      res.end(JSON.stringify({
        code: 20000,
        data: "1"
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });

})

// 修改创建的项目的标签
app.get('/modify_jobid',function(req,res) {
  var selectSQL = "select * from jobid where jobid='"+req.query.jobid+"';update jobid set status='finished' where jobid = '"+req.query.jobid+"'"
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end(JSON.stringify({
        code: 20000,
        data: "0"
      }));
    }
    else {
      console.log("创建任务修改成功");
      res.end(JSON.stringify({
        code: 20000,
        data: "1"
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });

})

// 查询修改好的创建的项目
app.get('/find_jobid',function(req,res) {
  var selectSQL = "select * from jobid Order by id desc"
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end(JSON.stringify({
        code: 20000,
        data: "0"
      }));
    }
    else {
      console.log("任务查找成功");
      res.end(JSON.stringify({
        code: 20000,
        data: result
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });

})

// 每分钟查询微博总数，算差值，放到折线图上
app.get('/minute_weibo_data', function (req, res) {
  console.log(req.query)
  var selectSQL = "insert into weibo_minute (count,nowtime) values ('"+ req.query.count +"','"+req.query.nowtime +"');select * from weibo_minute ORDER BY id desc limit 2";
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博分钟数据查找成功");
      res.end(JSON.stringify({
        code: 20000,
        data: result
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 修改真实微博数据
app.post('/modify_reallyweibo_data', function (req, res) {


  console.log('获取到的值:', req.query)
  // res.send(JSON.stringify({
  //     code :20000,
  //     data: req.query
  // }));
  var selectSQL = "UPDATE weibo set text='" + req.query.text + "',created_at= '" + req.query.created_at + "',item1='" + req.query.item1 + "' ,item2='" + req.query.item2 + "' ,item3='" + req.query.item3 + "' where myid='" + req.query.myid + "' "
  console.log(selectSQL)
  //var selectSQL = "select password from user where account='"+req.query.account+"'";
  // var addSqlParams = [req.query.account, req.query.password];
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据修改成功");
      res.end(JSON.stringify({
        code: 20000,
        data: {
          total: 100,
          items: "modify success"
        }
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
  // res.end(JSON.stringify(response));
})

// 删除测试微博数据，并重新对主键排序
app.get('/delete_weibo_data', function (req, res) {
  var selectSQL = "delete from " + req.query.table + " where id=" + req.query.id + ";alter table " + req.query.table + " drop id;alter table " + req.query.table + " add id int not null primary key auto_increment first;";
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据删除成功");
      res.end(JSON.stringify({
        code: 20000,
        data: "delete success"
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 删除真实微博数据，并重新对主键排序
app.get('/deletereally_weibo_data', function (req, res) {
  var selectSQL = "delete from " + req.query.table + " where myid=" + req.query.myid + ";alter table " + req.query.table + " drop myid;alter table " + req.query.table + " add myid int not null primary key auto_increment first;";
  // var selectSQL = "delete from " + req.query.table + " where myid=" + req.query.myid + ";";
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据删除成功");
      res.end(JSON.stringify({
        code: 20000,
        data: "delete success"
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 微博增加数据时，先查询条数，已用于增加id
app.get('/search_create_weibo_data', function (req, res) {
  var selectSQL = "select myid from " + req.query.table + " order by myid desc limit 1"
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据增加查询成功");
      res.end(JSON.stringify({
        code: 20000,
        data: result
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})
// 增加微博数据
app.get('/create_weibo_data', function (req, res) {
  var selectSQL = "insert into " + req.query.table + " (created_at, text, item1, item2, item3,id,bid) values " + "('" + req.query.created_at + "','"+ req.query.text + "','"+ req.query.item1 + "','"+ req.query.item2 + "','" + req.query.item3 + "','66666','666')"
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[delete ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("帐号手机号错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据插入成功");
      res.end(JSON.stringify({
        code: 20000,
        data: "create success"
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 查询爬虫数据的条数
app.get('/search_weibo_data', function (req, res) {
  res.writeHead(200, {
    'content-type': 'text/html;charset=utf8'
  });
  var time = sd.format(new Date(), 'YYYYMMDDHHmmss');
  console.log(sd.format(new Date(), 'YYYYMMDDHHmmss'));
  // select table_name,table_rows from information_schema.tables where TABLE_SCHEMA = 'weibo' order by table_rows desc;
  // select myid from `西安` order by myid desc;
  var selectSQL = "select myid from `云南` order by myid desc";
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据搜索成功");
      console.log(result);
      // var obj=[];
      // for(var i=0;i<result.length;i++){
      //   var ttt={};
      //   ttt.TABLE_NAME = result[i].TABLE_NAME;
      //   ttt.TABLE_ROWS = result[i].TABLE_ROWS;
      //   obj.push(ttt);
      // };
      // console.log(obj);
      res.end(JSON.stringify({
        code: 20000,
        data: result[0],
        time: time

      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  })

});

// 查询weibo数据库下表的名字
app.get('/weibo_table',function(req,res){
  var selectSQL = "SET GLOBAL information_schema_stats_expiry=0;SET @@GLOBAL.information_schema_stats_expiry=0;SET SESSION information_schema_stats_expiry=0;SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'weibo'"
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博表名搜索成功");
      console.log(result);
      // var obj=[];
      // for(var i=0;i<result.length;i++){
      //   var ttt={};
      //   ttt.TABLE_NAME = result[i].TABLE_NAME;
      //   ttt.TABLE_ROWS = result[i].TABLE_ROWS;
      //   obj.push(ttt);
      // };
      // console.log(obj);
      res.end(JSON.stringify({
        code: 20000,
        data: result,

      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  })  
})

// 查询weibo数据库数据总量,查询标签1个数
app.get('/weibo_sum',function(req,res){
  var selectSQL = "SET GLOBAL information_schema_stats_expiry=0;SET @@GLOBAL.information_schema_stats_expiry=0;SET SESSION information_schema_stats_expiry=0;SELECT TABLE_NAME,TABLE_ROWS FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'weibo' ORDER BY TABLE_ROWS DESC;select DATE_FORMAT(now(),'%Y-%m-%d') as '日期' from dual;select DATE_FORMAT(now(),'%a') as '星期' from dual;select count(*) as count_weibo from weibo;select count(*) as count_label from label;select concat(round(sum(data_length/1024/1024),2),'MB') as data_size from information_schema.tables;select * from weibo_minute order by id desc limit 10";
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据搜索成功");
      console.log(result);
      // var obj=[];
      // for(var i=0;i<result.length;i++){
      //   var ttt={};
      //   ttt.TABLE_NAME = result[i].TABLE_NAME;
      //   ttt.TABLE_ROWS = result[i].TABLE_ROWS;
      //   obj.push(ttt);
      // };
      // console.log(obj);
      res.end(JSON.stringify({
        code: 20000,
        data: result,

      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  })  
})

// 插入查询到的日期星期和数量，并再查出来
app.get('/find_day_sum',function(req,res) {
  console.log(req.query.data,req.query.week,req.query.sum)
  selectSQL = "update weibo_day set count='"+req.query.sum+"',time='"+req.query.data+"',xingqi='"+req.query.week+"' where xingqi='"+req.query.week+"';select * from weibo_day Order by time"
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("数据储存成功");
      console.log(result);

      let obj = JSON.stringify({
        code: 20000,
        data: result,
      })


      console.log(obj)
      res.end(obj);
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  })
})


// 将查到的数据存到数据库
app.get('/save_data', function (req, res) {
  console.log(req.query.nowTime)
  console.log(req.query.city)
  console.log(req.query.myid)
  console.log(sd.format(new Date(), 'YYYYMMDDHHmmss'));
  var selectSQL = "create table if not exists " + req.query.city + " (id int(20) auto_increment not null,time timestamp,address varchar(20),count int(20),primary key(id));insert into " + req.query.city + " (time,address,count) values (" + req.query.nowTime + "," + '"' + req.query.city + '"' + "," + req.query.myid + ");";
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("数据储存成功");
      console.log(result);

      let obj = JSON.stringify({
        code: 20000,
        data: '数据储存成功',
      })


      console.log(obj)
      res.end(obj);
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  })
})

// 读取存入后的数据库，并展示
app.get('/preview', function (req, res) {
  var selectSQL = "select time,address,count from " + '`' + req.query.city + '`' + " ORDER BY count desc ";
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据读取成功");
      res.end(JSON.stringify({
        code: 20000,
        data: result
      }));
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  });
})

// 查询到的数据存入数据库
app.get('/save_search_data', function (req, res) {
  req.query.time
  req.query.id

})


// 查询爬虫数据的条数用于echarts
app.get('/weibo_data_echarts', function (req, res) {
  res.writeHead(200, {
    'content-type': 'text/html;charset=utf8'
  });
  console.log(sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'));
  var nowTime = sd.format(new Date(), 'HH:mm:ss')
  // select table_name,table_rows from information_schema.tables where TABLE_SCHEMA = 'weibo' order by table_rows desc;
  // select myid from `西安` order by myid desc;
  var selectSQL = "select myid from `西安` order by myid desc";
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[login ERROR] - ', err.message);
      return;
    }
    if (result == '') {
      console.log("错误");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      console.log("微博数据搜索成功");
      console.log(result);
      // var obj=[];
      // for(var i=0;i<result.length;i++){
      //   var ttt={};
      //   ttt.TABLE_NAME = result[i].TABLE_NAME;
      //   ttt.TABLE_ROWS = result[i].TABLE_ROWS;
      //   obj.push(ttt);
      // };
      // console.log(obj);
      let obj = JSON.stringify({
        code: 20000,
        data: result[0],
        time: nowTime
      })


      console.log(obj)
      res.end();
      // res.end("modify success");//如果登录成就给客户端返回1
    }
  })

});

// 分页本地测试读取到的数据
app.get('/page_data', function (req, res) {

  console.log(req.query.page)
  console.log(req.query.limit)
  console.log(req.query.city)
  //  var selectSQL = "SELECT * from alarmData";
  //
  a = (req.query.page - 1) * req.query.limit;
  console.log('a:' + a);
  // var selectSQL = "select * from complex_table_data limit "+  req.query.limit +" offset " + a;
  var selectSQL = "select * from " + '`' + req.query.city + '`' + " ORDER BY count desc " + " limit " + req.query.limit + " offset " + a;
  console.log(selectSQL)
  connection.query(selectSQL, function (err, result) {
    if (err) {
      console.log('[data ERROR] - ', err.message);
      return;
    }
    //console.log(result);
    if (result == '') {
      console.log("数据没了");
      res.end("0");//如果登录失败就给客户端返回0，
    }
    else {
      // console.log(selectSQL);

      // res.json({success_code: 200, message: '获取分页数据成功', data: results })
      // for (var i = 0; i < result.length; i++) {
      //   result[i].alarmGrade = +result[i].alarmGrade

      // };
      var sum = result[0].id + req.query.limit * (req.query.page - 1)
      console.log(result);
      console.log(sum)
      //解决中文乱码，加入头文件
      // res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' })
      res.end(JSON.stringify({
        code: 20000,
        data: {
          total: sum,
          items: result
        }
      }));
      // res.json(data:result)

    }
  });
  //  console.log(result);
  //res.end(JSON.stringify(response));
})

// 接收提交表单数据，进行爬虫


//创建get接口
app.get('/api', function (req, res) {

  //console.log(req.body); //获取请求参数

  var file = path.join(__dirname, 'data/test.json'); //文件路径，__dirname为当前运行js文件的目录
  //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

  //读取json文件
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败');
    } else {
      res.send(data);
      console.log('数据读取成功');
    }
  });
});

//创建complex-table_data接口
app.get('/complex-table_data1', function (req, res) {

  //console.log(req.body); //获取请求参数

  var file = path.join(__dirname, 'data/complex-table_data.json'); //文件路径，__dirname为当前运行js文件的目录
  //var file = 'f:\\nodejs\\data\\test.json'; //也可以用这种方式指定路径

  //读取json文件
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败');
    } else {
      res.send(data);
      console.log('数据读取成功');
    }
  });
});


var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})

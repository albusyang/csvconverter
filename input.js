var express = require('express');
var stream = require('./stream');

var app = express();

var q = '';

app.get('/', function (req, res) {
    q = req.query.q;
    console.log('正在转换: ' + q);
    if (q != null) {
        stream.inint(q);
    }
    res.send('新的' + q + '将存放于./newcsv目录下');
});

app.listen(3000, function (req, res) {
    console.log('app is runing at port 3000');
});
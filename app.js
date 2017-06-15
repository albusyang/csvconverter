var readLine = require('lei-stream').readLine;
var stream = require('./stream');

var fileHub = [];
var fileNo = 0;
var configHub = [];
var configNo = 0;
var config = './input.txt';
var fileList = '';

var code = '';
var oldcsv = '';
var newcsv = '';
var divisor = null;

// 读配置文件
var readConfig = function (config) {
    readLine(config).go(function (data, next) {
        var oneLine = null;
        for (var i in data) {
            if (data[i] != '\r') {
                if (data[i] == '=') {
                    oneLine = null;
                    continue;
                }
                if (data[i] == ' ') {
                    continue;
                }
                if (data[i] == '\t') {
                    continue;
                }
                if (oneLine == null) {
                    oneLine = data[i]
                } else {
                    oneLine += data[i];
                }
            }
        }
        if (oneLine != null) {
            configHub[configNo] = oneLine;
            configNo++;
        }
        next();
    }, function () {
        code = configHub[0];
        oldcsv = configHub[1];
        newcsv = configHub[2];
        divisor = configHub[3];
        fileList = oldcsv + 'list.txt';
        readFileList(fileList);
    });
}

// 读文件列表
var readFileList = function (fileList) {
    readLine(fileList).go(function (data, next) {
        var oneLine = null;
        for (var i in data) {
            if (data[i] != '\r') {
                if (oneLine == null) {
                    oneLine = data[i]
                } else {
                    oneLine += data[i];
                }
            }
        }
        if (oneLine != null) {
            fileHub[fileNo] = oneLine;
            fileNo++;
        }
        next();
    }, function () {
        runConverter(0);
    });
}

function runConverter (number) {
    var fileName = fileHub[number];
    if (fileName != null) {
        console.log('正在转换： ' + fileName);
        stream.inint(code, fileName, oldcsv, newcsv, divisor);
    } else {
        console.log('转换完成！');
        // process.exit();
    }
}

readConfig(config);

exports.runConverter = runConverter;
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
        // console.log(configHub);
        code = configHub[0];
        oldcsv = configHub[1];
        newcsv = configHub[2];
        divisor = configHub[3];
        // console.log('code = ' + code);
        // console.log('oldcsv = ' + oldcsv);
        // console.log('newcsv = ' + newcsv);
        // console.log('divisor = ' + divisor);
        fileList = oldcsv + 'list.txt';
        // console.log('fileList : ' + fileList);
        readFileList(fileList);
    });
}

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

function runConverter(number) {
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
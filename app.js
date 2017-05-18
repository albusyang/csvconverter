var readLine = require('lei-stream').readLine;
var stream = require('./stream');

var fileHub = [];
var fileNo = 0;
var fileList = 'C:/oldcsv/list.txt';

readLine(fileList).go(function (data, next) {
    // console.log(data);

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

function runConverter (number) {
    var fileName = fileHub[number];
    if (fileName != null) {
        console.log('正在转换： ' + fileName);
        stream.inint(fileName);
    } else {
        console.log('转换完成！');
        // process.exit();
    }
}

exports.runConverter = runConverter;
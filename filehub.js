var fs = require('fs');
var unzip = require('./UnGzip');
var path = 'oldcsv';
var fileList = [];
var fileName = [];
var file = [];
var i = 0;

function explorer(path) {
    fs.readdir(path, function (err, files) {
        //err 为错误 , files 文件名列表包含文件夹与文件
        if (err) {
            console.log('error:\n' + err);
            return;
        }
        files.forEach(function (file) {
            fs.stat(path + '/' + file, function (err, stat) {
                if (err) { console.log(err); return; }
                if (stat.isDirectory()) {
                    // 如果是文件夹遍历
                    explorer(path + '/' + file);
                } else {
                    var temp = '';
                    temp = path + '/' + file;
                    unzip.ungzFile(temp);
                    fileList[i] = temp;
                    i++;
                }
                file = getFileList(fileList);
                fs.writeFile('input.txt', fileList, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('write success');
                });
            });
            console.log('here fileList :   ' + fileList);
        });
        
    });
}
// explorer(path);
var main = function () {
    explorer(path);
}
var getFileList = function (fileList) {
    fileName = fileList;
    console.log('filename-->' + fileName);
    console.log('fileList.length: ' + fileList.length);
    return fileName;
}

main();
exports.main = main;

// main();
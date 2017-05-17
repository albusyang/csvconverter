/**
 * converter,转换器核心
 * old.csv-->new.csv
 */
var moment = require('moment');

var writeRow = ''; // 用来写入的数据
var rowData = []; // 存放一行数据
var part = ''; // 存放用逗号隔开的数据

// 获取到的原始数据,过渡代码
var ric = null; //#1
var oDate = null; //#3
var oTime = null; //#4
var gmt = null; //#5
var type = null; //#6
var price = null; //#8
var volume = null; //#9
var mvwap = null; //#10
var bidPrice = null; //#12
var bidSize = null; //#13
var askPrice = null; //#16
var askSize = null; //#17
var openPrice = null; //#53
var highPrice = null; //#54
var lowPrice = null; //#55
var accVolume = null; //#56

// 拼装好的数据
var code = null;
var fieldGroup = null;
var fieldValues = null;
var timeInLocal = null;
var timeInGmt = null;
var sourceFrom = 'qit';
var createdBy = 'qit';
var createdTime = null;
// var updatedBy = '';
// var updatedTime = '';


// 读取每行的数据，并把数据放入writeRow中
var getRowData = function (strData) {
    
    if (strData != null) {
        // console.log(strData);
        var j = 0;
        for (var i = 0; i < strData.length; i++) {
            // console.log(strData[i]);
            if (strData[i] != ',') {
                part += strData[i];
            } else if (strData[i] == ',') {
                rowData[j] = part;
                j++;
                part = '';
            }
            // if (strData[i] == '\n') {
            //     rowData[j] = part;
            //     j = 0;
            //     pickUp(rowData);
            //     part = '';
            // }
        }
        pickUp(rowData);
    }
}

// 从获取的rowData中取出需要的数据，并根据TRADE或DEPTH
var pickUp = function (hereData) {
    // console.log(hereData);
    if (hereData[0] == '#RIC') {
        writeRow = '\"' + 'CODE' + '\"' + ',' +
            '\"' + 'FIELD_GROUP' + '\"' + ',' +
            '\"' + 'FIELD_VALUES' + '\"' + ',' +
            '\"' + 'TIME_IN_LOCAL' + '\"' + ',' +
            '\"' + 'TIME_IN_GMT' + '\"' + ',' +
            '\"' + 'SOURCE_FROM' + '\"' + ',' +
            '\"' + 'CREATED_BY' + '\"' + ',' +
            '\"' + 'CREATED_TIME' + '\"' + ',' +
            '\"' + 'UPDATED_BY' + '\"' + ',' +
            '\"' + 'UPDATED_TIME' + '\"' + '\n';
        return writeRow;
    } else {
        // 获取交易品种代码，仅获取一次
        if (ric == null) {
            var rawCode = hereData[0];
            var i = 0;
            for (var p in rawCode) {
                if (rawCode[p] == 'X') {
                    continue;
                }
                if (rawCode[p] == '=') {
                    ric += '@';
                    i++;
                    continue;
                }
                if (ric == null) {
                    ric = rawCode[p];
                } else {
                    ric += rawCode[p];
                }
            }
            code = ric;
        }

        oDate = hereData[2]; // 获取时间
        oTime = hereData[3];
        gmt = hereData[4]; // 获取格林威治标准时间——GMT
        type = hereData[5]; // 获取行情类型，Trade或Quote

        // 获取到的时间需要重新造型
        var aDate = '';
        for (var i = 0; i < oDate.length; i++) {
            switch (i) {
                case 0:
                    aDate = oDate[i];
                    break;
                case 3:
                    aDate += oDate[i];
                    aDate += '-';
                    break;
                case 5:
                    aDate += oDate[i];
                    aDate += '-';
                    break;
                default:
                    aDate += oDate[i];
                    break;
            }
        }
        var tempTime = aDate + ' ' + oTime;
        var timeRaw = new Date(tempTime);
        var timeInLocalRaw = timeRaw.getTime() + (gmt * 3600000);
        timeInGmt = moment(timeRaw).format('YYYY-MM-DD HH:mm:ss.SSSSSS');
        timeInLocal = moment(timeInLocalRaw).format('YYYY-MM-DD HH:mm:ss.SSSSSS');

        createdTime = timeInLocal;

        // 不同行情分别组装数据
        if (type == 'Trade') {
            fieldGroup = 'TRADE';
            if (hereData[7] != '') {
                price = hereData[7];
            }
            if (hereData[8] != '') {
                volume = hereData[8] / 10;
            }
            if (hereData[52] != '') {
                openPrice = hereData[52];
            }
            if (hereData[53] != '') {
                highPrice = hereData[53];
            }
            if (hereData[54] != '') {
                lowPrice = hereData[54];
            }
            if (hereData[55] != '') {
                accVolume = hereData[55] / 10;
            }

            if (price != null && volume != null) {
                fieldValues = '{' + '\"' + '\"' + 'lastQuantity' + '\"' + '\"' + ':' + '\"' + '\"' + volume + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'lowPrice' + '\"' + '\"' + ':' + '\"' + '\"' + lowPrice + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'highPrice' + '\"' + '\"' + ':' + '\"' + '\"' + highPrice + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'openPrice' + '\"' + '\"' + ':' + '\"' + '\"' + openPrice + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'volume' + '\"' + '\"' + ':' + '\"' + '\"' + accVolume + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'lastPrice' + '\"' + '\"' + ':' + '\"' + '\"' + price + '\"' + '\"' + '}';
                writeRow = '\"' + code + '\"' + ',' + '\"' + fieldGroup + '\"' + ',' + '\"' + fieldValues + '\"' + ',' + '\"' + timeInLocal + '\"' + ',' +
                    '\"' + timeInGmt + '\"' + ',' + '\"' + sourceFrom + '\"' + ',' + '\"' + createdBy + '\"' + ',' + '\"' + createdTime + '\"' + ',' + ',' + '\n';
            }
            return writeRow;
            // console.log(writeRow);
        } else if (type == 'Quote') {
            fieldGroup = 'DEPTH';
            if (hereData[11] != '') {
                bidPrice = hereData[11];
            }
            if (hereData[12] != '') {
                bidSize = hereData[12];
            }
            if (hereData[15] != '') {
                askPrice = hereData[15];
            }
            if (hereData[16] != '') {
                askSize = hereData[16];
            }

            if (bidPrice !== null && bidSize !== null && askPrice !== null && askSize !== null) {
                fieldValues = '{' + '\"' + '\"' + 'bestBidPrice1' + '\"' + '\"' + ':' + '\"' + '\"' + bidPrice + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'bestBidSize1' + '\"' + '\"' + ':' + '\"' + '\"' + bidSize + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'bestAskPrice1' + '\"' + '\"' + ':' + '\"' + '\"' + askPrice + '\"' + '\"' + ',' + '\"' +
                    '\"' + 'bestAskSize1' + '\"' + '\"' + ':' + '\"' + '\"' + askSize + '\"' + '\"' + '}';

                writeRow = '\"' + code + '\"' + ',' + '\"' + fieldGroup + '\"' + ',' + '\"' + fieldValues + '\"' + ',' + '\"' + timeInLocal + '\"' + ',' +
                    '\"' + timeInGmt + '\"' + ',' + '\"' + sourceFrom + '\"' + ',' + '\"' + createdBy + '\"' + ',' + '\"' + createdTime + '\"' + ',' + ',' + '\n';
            }
            return writeRow;
        }
    }
}

exports.getRowData = getRowData;
var testFolder = './data';
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
    console.log(filelist); //안에 있는 파일을 배열처럼 뽑아낸다.
});
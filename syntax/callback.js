/*
function a(){
    console.log('A');
}
*/
var a = function(){
    console.log('A');
}

function slowfunc(callback){
callback();
}
slowfunc(a);
// 다른 함수의 매개변수로 함수를 전달하고, 어떤 이벤트가 발생한 후에 매개변수로 전달한
// 함수가 다시 호출되는 것
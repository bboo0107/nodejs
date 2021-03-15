// array, object

var f = function(){
    console.log(1+1);
    console.log(1+2);
}
//console.log(f);
//f();

var a = [f];
a[0]();

var o = {
    func:f
}
o.func();

//함수도 배열과 객체에 담을 수 있다.






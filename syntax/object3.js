var o = {
    v1:'v1',
    v2:'v2',
    f1:function(){
        console.log(this.v1);
    },
    f2:function(){
        console.log(this.v2);
    } 
}

o.f1();
o.f2();

//연관된 객체와 함수를 그룹핑 할 수 있다.

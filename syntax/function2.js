console.log(Math.round(1.6));  //반올림
console.log(Math.round(1.4));

function sum(first, second){ //parameter
    console.log('a');
    return first+second;  //return은 여기서 함수가 종료된다.
    console.log('b');
}

console.log(sum(2,4)); // argument

//Math.round(1.6); //얘만 찍는다고 출력은 안된다.
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body){
  return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      <a href="/create">create</a>
      ${body}
    </body>
    </html>
    `;
}
function templateList(filelist){
  var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
          list = list + `<li><a
          href ="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
          i = i + 1 ;
      } //filelist 배열을 반복문으로 뽑아온다. 

      list = list+'</ul>';
      return list;
}
  var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    

    if(pathname === '/'){
      if(queryData.id === undefined){
        
        fs.readdir('./data', function(error, filelist){
          console.log(filelist);
          var title = 'Welcome';
          var description = 'Hello, Node.js'
          var list = templateList(filelist);
          var template = templateHTML(title, list, 
            `<h2>${title}</h2>${description}`);
          response.writeHead(200);
          response.end(template);
          });//data안에 있는 파일 목록이 추출       
      
      }else{
        fs.readdir('./data', function(error, filelist){        
          fs.readFile(`data/${queryData.id}`,'utf-8', function(err, description){
            var title = queryData.id;
            var list = templateList(filelist);  
            var template = templateHTML(title, list, 
              `<h2>${title}</h2>${description}`);
        response.writeHead(200);
        response.end(template);
        });
      }); 
      }
      //쿼리스트링에 따라 파일생성
    }else if(pathname === '/create'){
      fs.readdir('./data', function(error, filelist){
        console.log(filelist);
        var title = 'WEB - create';
        var list = templateList(filelist);
        var template = templateHTML(title, list, 
          `
          <form action="http://localhost:3000/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
          </form>
          `);
        response.writeHead(200);
        response.end(template);
        });
    }else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      }); //post방식으로 들어오는 데이터의 양이 많을 경우 나눠서 데이터를 받게 함
      request.on('end', function(){
        var post = qs.parse(body);  //parse querystring 데이터를 쪼개서 String 타입으로 보여줌
        var title = post.title;
        var description = post.description;
      }); //정보 수신이 끝났을때 실행되는 콜백 함수
      response.writeHead(200);
      response.end('success');
    }else{
      response.writeHead(404);
      response.end('Not found');
    }




});
app.listen(3000); 

//데이터를 바꿀때는 (description) 수정하고 새로고침만해도 된다. 들어갈때마다 데이터를 로드하기 때문에
//하지만 main.js를 변경하면 node를 껐다 켜줘야 한다.
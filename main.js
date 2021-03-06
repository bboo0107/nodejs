var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

  var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    

    if(pathname === '/'){ //home
      if(queryData.id === undefined){
        
        fs.readdir('./data', function(error, filelist){
          console.log(filelist);
          var title = 'Welcome';
          var description = 'Hello, Node.js'
          var list = template.List(filelist);
          var html = template.HTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            );
          response.writeHead(200);
          response.end(html);
          /*
          var list = templateList(filelist);
          var template = templateHTML(title, list, 
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
            );
          response.writeHead(200);
          response.end(template);
          */
          });//data안에 있는 파일 목록이 추출       
      
      }else{
        fs.readdir('./data', function(error, filelist){  
          var filteredId = path.parse(queryData.id).base;      
          fs.readFile(`data/${filteredId}`,'utf-8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.List(filelist);  
            var html = template.HTML(sanitizedTitle, list, 
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a> 
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
              );
        response.writeHead(200);
        response.end(html);
        });
      }); 
      }
      //쿼리스트링에 따라 파일생성
    }else if(pathname === '/create'){ //create페이지
      fs.readdir('./data', function(error, filelist){
        console.log(filelist);
        var title = 'WEB - create';
        var list = template.List(filelist);
        var html = template.HTML(title, list, 
          `
          <form action="/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
          </form>
          `, '');
        response.writeHead(200);
        response.end(html);
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
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`}); // redirection 코드 302 입력후 submit했을때 파일 생성과 동시에 그 페이지로 넘어감
          response.end('success');
        })
      }); //정보 수신이 끝났을때 실행되는 콜백 함수
      
    }else if(pathname === '/update'){
      fs.readdir('./data', function(error, filelist){ 
        var filteredId = path.parse(queryData.id).base;       
        fs.readFile(`data/${filteredId}`,'utf-8', function(err, description){
          var title = queryData.id;
          var list = template.List(filelist);  
          var html = template.HTML(title, list, 
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
            </form> 
            `,
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
      response.writeHead(200);
      response.end(html);
      });
    }); 
    }else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      }); //post방식으로 들어오는 데이터의 양이 많을 경우 나눠서 데이터를 받게 함
      request.on('end', function(){
        var post = qs.parse(body);  //parse querystring 데이터를 쪼개서 String 타입으로 보여줌
        var id = post.id;
        var title = post.title;
        var description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          fs.writeFile(`data/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location: `/?id=${title}`}); // redirection 코드 302 입력후 submit했을때 파일 생성과 동시에 그 페이지로 넘어감
            response.end();
          })
        });

        console.log(post);
      });
    }else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
        body = body + data;
      }); //post방식으로 들어오는 데이터의 양이 많을 경우 나눠서 데이터를 받게 함
      request.on('end', function(){
        var post = qs.parse(body);  //parse querystring 데이터를 쪼개서 String 타입으로 보여줌
        var id = post.id;
        var filteredId = path.parse(id).base; 
        
        fs.unlink(`data/${filteredId}`, function(error){
          response.writeHead(302, {Location: `/`}); // redirection 코드 302 입력후 submit했을때 파일 생성과 동시에 그 페이지로 넘어감
            response.end();
        })
      });
    }else{
      response.writeHead(404);
      response.end('Not found');
    }




});
app.listen(3000); 

//데이터를 바꿀때는 (description) 수정하고 새로고침만해도 된다. 들어갈때마다 데이터를 로드하기 때문에
//하지만 main.js를 변경하면 node를 껐다 켜줘야 한다.
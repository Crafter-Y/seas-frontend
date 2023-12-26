const http = require("http");

http.createServer(onRequest).listen(3000);

function onRequest(client_req, client_res) {
  let options = {
    hostname: "localhost",
    port: 80,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers,
  };

  let proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers);
    res.pipe(client_res, {
      end: true,
    });
  });

  client_req.pipe(proxy, {
    end: true,
  });
}

const http = require("http");

const handler = require("serve-handler");

const server = http.createServer((request, response) => {
  if (request.url === "/config.json" && process.env.REWRITE_CONFIG) {
    response.writeHead(200, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify({
        serverId: request.headers.serverid,
      })
    );
    return;
  } else if (process.env.SERVER_ID && request.url === "/config.json") {
    response.writeHead(200, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify({
        serverId: process.env.SERVER_ID,
      })
    );
    return;
  }

  return handler(request, response, {
    public: "./dist",
  });
});

const PORT = process.env.PORT || 3333;

if (process.env.SERVE_LOCAL_NETWORK) {
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Running at ::${PORT} and local network`);
    if (process.env.REWRITE_CONFIG) {
      console.log("Rewriting serverId to header");
    } else if (process.env.SERVER_ID) {
      console.log("Rewriting serverId to env: '" + process.env.SERVER_ID + "'");
    }
  });
} else {
  server.listen(PORT, () => {
    console.log(`Running at ::${PORT}`);
    if (process.env.REWRITE_CONFIG) {
      console.log("Rewriting serverId to header");
    } else if (process.env.SERVER_ID) {
      console.log("Rewriting serverId to env: '" + process.env.SERVER_ID + "'");
    }
  });
}

const handler = require("serve-handler");
const http = require("http");

const server = http.createServer((request, response) => {
  if (request.url == "/assets/config.json" && process.env.REWRITE_CONFIG) {
    response.writeHead(200, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify({
        serverId: request.headers.serverid,
      })
    );
    return;
  } else if (process.env.SERVER_ID && request.url == "/assets/config.json") {
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

  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: "./dist",
    rewrites: [
        { source: "/**/*", destination: "/index.html" },
      ]
  });
});

const PORT = process.env.PORT || 3333;

if (process.env.SERVE_LOCAL_NETWORK) {
  server.listen(PORT, "192.168.178.95", () => {
    console.log(`Running at ::${PORT} and local network`);
    if (process.env.REWRITE_CONFIG) {
      console.log("Rewriting serverId to header")
    } else if (process.env.SERVER_ID) {
      console.log("Rewriting serverId to env: '" + process.env.SERVER_ID + "'")
    }
  });
} else {
  server.listen(PORT, () => {
    console.log(`Running at ::${PORT}`);
    if (process.env.REWRITE_CONFIG) {
      console.log("Rewriting serverId to header")
    } else if (process.env.SERVER_ID) {
      console.log("Rewriting serverId to env: '" + process.env.SERVER_ID + "'")
    }
  });
}



const handler = require("serve-handler");
const http = require("http");

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: "./dist",
    rewrites: [
        //{ source: "/assets/config.json", destination: "/assets/config.json" },
        { source: "/**/*", destination: "/index.html" },
      ]
  });
});

const PORT = process.env.PORT || 3333;

server.listen(PORT, () => {
  console.log(`Running at ::${PORT}`);
});

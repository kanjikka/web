const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const EventEmitter = require("node:events");
const myEmitter = new EventEmitter();
const cors = require("cors");

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // TODO: only accept from waniknai
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
        "Access-Control-Max-Age": 2592000, // 30 days
      };

      if (req.method === "OPTIONS") {
        res.writeHead(204, headers);
        res.end();
        return;
      }

      if (pathname == "/change-route") {
        console.log("emitting event");
        console.log("query param is", query);
        myEmitter.emit("event", query.kanji);
        res.writeHead(200);
        res.end();
      } else if (pathname == "/stream") {
        console.log("established connection");
        res.writeHead(200, {
          Connection: "keep-alive",
          "Cache-Control": "no-cache",
          "Content-Type": "text/event-stream",
        });

        // Tell to change route
        myEmitter.on("event", function firstListener(...args) {
          console.log("args", args);
          res.write(`data: ${args}\n\n`);
        });
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

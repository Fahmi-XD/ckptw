import http from "node:http";
import fs from "node:fs";
import EventEmitter from "node:events";
import path from "node:path";
import ejs from "ejs";
import { Consolefy } from "@mengkodingan/consolefy";

import global from "../Common/Global";

/**
 * Hot reload system ( Development )
 */
import ws from "ws";
import { IServer } from "../Common/Types";

const server = http.createServer();
const ev = new EventEmitter();
const wss = new ws.WebSocketServer({ server });
const log = new Consolefy();
const mimetype: { [key: string]: string } = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg"
}

function startServer(): IServer {
  server.on("request", async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = req.url?.split("?")[0];
    const ress = res.end;
    res.end = (chunk?: any, cb?: BufferEncoding | (() => void)) => {
      ev.emit("debug", req as http.IncomingMessage, res as http.ServerResponse);
      res.end = ress;
      return res.end(chunk, cb as () => void);
    };

    if (url == "/") {
      ejs.renderFile("./src/Interface/views/index.ejs", (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          console.error(err);
          return;
        }

        res.writeHead(200, {
          "content-type": "text/html"
        });
        res.end(data)
      })
    } else if (url?.startsWith("/static")) {
      const pathh = "./src/Interface";
      try {
        const fData = await fs.readFileSync(path.join(pathh, url));
        res.writeHead(200, {
          "content-type": mimetype[path.extname(url)] ?? "application/octet-stream"
        });
        res.end(fData)
      } catch {
        res.writeHead(301, {
          "location": "/404"
        });
        res.end();
      }
      /**
       * Hot reload ( Development )
       */
    } else if (url == "/reload") {
      if (!global.isDevelopment) {
        res.writeHead(204);
        return res.end();
      }
      res.writeHead(200, {
        "content-type": "application/javascript"
      });
      res.end(`
        const ws = new WebSocket("ws://" + location.host);
        ws.onmessage = () => {
          console.log("Perubahan diterima dari server");
          location.reload()
        };
      `)
    } else if (url == "/404") {
      res.writeHead(404);
      res.end(JSON.stringify({
        error: "Page not found"
      }))
    } else {
      res.writeHead(301, {
        "location": "/404"
      })
      res.end()
    }
  })

  /**
   * Watch file ( Development )
   */
  if (global.isDevelopment) {
    let ch = 0;
    const listFile: string[] = [];
    const openFolder = (folder: string): void => {
      const files = fs.readdirSync(folder);

      files.forEach((file: string) => {
        if (fs.statSync(path.join(folder, file)).isDirectory()) {
          openFolder(path.join(folder, file));
        } else {
          listFile.push(path.join(folder, file));
        }
      })
    }
    openFolder("./src/Interface")
    listFile.forEach(file => {
      fs.watch(file, () => {
        ch++;
        log.info("File Change " + ch);
        wss.clients.forEach(client => client.send("reload"));
      });
    });
  }

  return {
    server,
    ev
  }
}

export default startServer;
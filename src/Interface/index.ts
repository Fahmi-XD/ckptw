#!/usr/bin/env node

import "dotenv/config"
import { Consolefy } from "@mengkodingan/consolefy";
import startServer  from "./server";
import type { ServerResponse, IncomingMessage } from "http";

import global from "../Common/Global";

const log = new Consolefy();
const args = process.argv.slice(2)
const PORT = process.env.PORT || "8080";
const port = args.includes("--port") ? args[args.indexOf("--port") + 1] : PORT;
const isDebug = args.includes("--debug");
const isDev = args.includes("--dev");

global.isDevelopment = isDev;

const { server, ev } = startServer();

ev.on("debug", (req: IncomingMessage, res: ServerResponse) => {
  if (isDebug) log.info((new Date()).toISOString(), "|", req.url, "|", res.statusCode)
})

/**
 * Listening server on specific port
 */
server.listen(port, () => {
  log.info("Server listen on port " + port)
})

/**
 * Signal to safely close the server
 */
process.on("SIGINT", () => {
  server.close(() => {
    log.info('Server stopped.');
    process.exit();
  })
});
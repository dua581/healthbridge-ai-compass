import { createRequestHandler } from "@tanstack/react-start/server";

export default createRequestHandler({
  build: () => import("../dist/server/server.js"),
});

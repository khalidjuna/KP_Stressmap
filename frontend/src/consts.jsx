import { isDEV, ServerPort, HostName } from "./env.js";

export const hostname = isDEV
  ? `http://${["localhost", ServerPort].join(":")}`
  : HostName;

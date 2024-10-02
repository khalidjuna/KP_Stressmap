import { isDEV, ServerPort } from "./env.js";

export const hostname = isDEV
  ? `http://${["localhost", ServerPort].join(":")}`
  : "";

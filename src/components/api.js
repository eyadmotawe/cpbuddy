import axios from "axios";
// Relative import — works on any machine, not just yours.
import { LANGUAGE_VERSIONS } from "../constants.js";

// baseURL uses the Vite dev proxy (/api → http://localhost:2000).
// Self-hosted Piston serves at /api/v2/execute — there is no /piston/ segment.
// That segment was part of emkc.org's public URL structure only.
const API = axios.create({
  baseURL: "/api/v2",
});

export const executeCode = async (language, sourceCode) => {
  const response = await API.post("/execute", {
    language: language,
    version: LANGUAGE_VERSIONS[language],
    // Piston accepts an array of files; we always send a single file.
    files: [{ content: sourceCode }],
  });
  return response.data;
};
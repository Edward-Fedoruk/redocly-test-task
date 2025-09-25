import { Response } from "express";

// TODO: think on revalidating the cache to avoid memory overflow
export class Session {
  static htmlCache: Map<string, string> = new Map();
  static sseClients: Set<Response> = new Set();
}

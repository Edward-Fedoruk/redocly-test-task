#!/usr/bin/env node

import { Command } from "commander";
import { resolve } from "path";
import { watch } from "fs";
import { initServer } from "./express";
import { Session } from "./session";
import { FileProcessor } from "./file-processor";

const program = new Command();

program
  .command("preview")
  .description("View markdown files in directory")
  .argument("<directory>", "path to directory with markdown files")
  .option("-p, --port <port>", "port to run server on", "3000")
  .action((dir, options) => {
    try {
      const targetDir = resolve(process.cwd(), dir);
      const port = parseInt(options.port);

      const fileProcessor = new FileProcessor(targetDir);

      fileProcessor.process();

      if (fileProcessor.mdDocs.length === 0) {
        console.error("No markdown files found!");
        process.exit(1);
      }

      Session.init();

      initServer(fileProcessor.mdDocs, port);

      fileProcessor.mdDocs.forEach((file) => {
        // TODO: need to check for limits of watch. Can crash because of too many files
        // TODO: make sure we pick up new files and watch whole directory for change
        watch(resolve(targetDir, file), (eventType, filename) => {
          console.log(`File ${eventType}: ${filename}`);

          Session.htmlCache.set(file, fileProcessor.generatePageFromMd(file));

          Session.sseClients.forEach((client) => {
            client.write("data: reload\n\n");
          });
        });
      });
    } catch (error) {
      console.error("❌ Error:", error);
      process.exit(1);
    }
  });

program.parse();

import { resolve } from "node:path";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import Markdoc from "@markdoc/markdoc";
import { Session } from "./session";

export class FileProcessor {
  constructor(private targetDir: string) {}

  public htmlDocs: string[] = [];
  public mdDocs: string[] = [];

  private validatePath() {
    if (!existsSync(this.targetDir)) {
      console.error(`Error: Directory not found: ${this.targetDir}`);
      process.exit(1);
    }

    if (!statSync(this.targetDir).isDirectory()) {
      console.error(`Error: Path is not a directory: ${this.targetDir}`);
      process.exit(1);
    }
  }

  private isMdFile(file: string) {
    const ext = file.toLowerCase();

    return ext.endsWith(".md") || ext.endsWith(".markdown") || ext.endsWith(".mkd") || ext.endsWith(".mdx");
  }

  private readFiles() {
    const files = readdirSync(this.targetDir);
    const markdownFiles = files.filter(this.isMdFile);

    if (markdownFiles.length === 0) {
      console.error("No markdown files found!");
      process.exit(1);
    }

    this.mdDocs = markdownFiles;
    return markdownFiles;
  }

  process() {
    this.validatePath();
    this.readFiles();
    const htmlDocs = this.mdDocs.map((f) => this.generatePageFromMd(f));

    this.htmlDocs = htmlDocs;

    htmlDocs.forEach((htmlDoc, index) => {
      const file = this.mdDocs[index];
      if (file) {
        Session.htmlCache.set(file, htmlDoc);
      }
    });
  }

  generatePageFromMd(file: string) {
    // TODO: read async files read to speed up performance
    const content = readFileSync(resolve(this.targetDir, file), "utf8");

    // TODO: later add separate service for md to abstract away library and decrease dependency on third party
    const ast = Markdoc.parse(content);
    const contentMd = Markdoc.transform(ast);
    return Markdoc.renderers.html(contentMd);
  }
}

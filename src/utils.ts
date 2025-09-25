import Markdoc from "@markdoc/markdoc";
import { existsSync, statSync } from "node:fs";

export const dirExist = (targetDir: string) => {
  if (!existsSync(targetDir)) {
    console.error(`❌ Directory not found: ${targetDir}`);
    process.exit(1);
  }
};

export const isMdFile = (file: string) => {
  const ext = file.toLowerCase();

  return ext.endsWith(".md") || ext.endsWith(".markdown") || ext.endsWith(".mkd") || ext.endsWith(".mdx");
};

export const generateMarkdown = (content: string) => {
  const ast = Markdoc.parse(content);
  const contentMd = Markdoc.transform(ast);
  return Markdoc.renderers.html(contentMd);
};

export const validateDirectory = (targetDir: string) => {
  if (!existsSync(targetDir)) {
    console.error(`Error: Directory not found: ${targetDir}`);
    process.exit(1);
  }

  if (!statSync(targetDir).isDirectory()) {
    console.error(`Error: Path is not a directory: ${targetDir}`);
    process.exit(1);
  }
};

import express from "express";
import { engine } from "express-handlebars";
import { resolve } from "path";
import { Session } from "./session";

const app = express();

const viewsPath = resolve(process.cwd(), "src/views");
const layoutsPath = resolve(viewsPath, "layouts");

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: layoutsPath,
  }),
);

app.set("view engine", "hbs");
app.set("views", viewsPath);

export const initServer = (markdownFiles: string[], port: number = 3000) => {
  app.get("/", (req, res) => {
    const files = markdownFiles.map((file) => {
      const fileName = file.split(".")[0];
      return {
        slug: fileName,
        title: fileName,
        description: `View ${fileName} documentation`,
      };
    });

    res.render("home", {
      title: "Home",
      files: files,
      showNavigation: false,
    });
  });

  app.get("/events", (req, res) => {
    console.log("New SSE connection");

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    res.write("data: connected");

    Session.sseClients.add(res);

    req.on("close", () => {
      console.log("SSE connection closed");
      Session.sseClients.delete(res);
    });
  });

  app.get("/:page", (req, res) => {
    const pageName = req.params.page;
    const matchingFile = markdownFiles.find((file) => {
      const fileName = file.split(".")[0];
      return fileName === pageName;
    });

    if (!matchingFile) {
      res.status(404).render("404", {
        title: "Page Not Found",
        pageName: pageName,
        showNavigation: true,
      });
      return;
    }

    const content = Session.htmlCache.get(matchingFile) || "";
    const title = pageName;

    res.render("page", {
      title: title,
      content: content,
      showNavigation: true,
    });
  });

  app.listen(port, () => {
    console.log(`Whatching changes for MD files`);
  });
};

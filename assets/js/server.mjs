import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 4810;
const app = express();

const serverStart = new Date();
const serverStartformat = Math.floor(serverStart.getTime() / 1000); 

const serveStatic = (route, directory) => {
  app.use(route, express.static(join(__dirname, directory), { index: false }));
};
serveStatic("/assets/css", "../../assets/css");
serveStatic("/assets/js", "../../assets/js");
serveStatic("/assets/images", "../../assets/images");
serveStatic("/assets/fonts", "../../assets/fonts");
serveStatic("/assets/bootstrap", "../../assets/bootstrap");

const serveHTML = (route, file) => {
  app.get(route, (req, res) => res.sendFile(join(__dirname, file)));
};

const htmlRoutes = [
  { route: "/", file: "../../index.html" },
  { route: "/tos", file: "../../tos.html" },
  { route: "/listing", file: "../../legal.html" },,
  { route: "/invite", file: "../../invite.html" },
  { route: "/support", file: "../../support.html" },
];

htmlRoutes.forEach((route) => serveHTML(route.route, route.file));

app.get("/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = join(__dirname, "../../assets/images", imageName);

  console.log(`Requested image: ${imageName}`);
  console.log(`Looking for image at: ${imagePath}`);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`Image not found: ${imagePath}`);
      res.status(404).send("Image not found");
    } else {
      res.sendFile(imagePath);
    }
  });
});

app.get("/api/serverstats", (req, res) => {
  res.json({
    message: "Server start time",
    startTime: serverStart,
    formatedStartTime: serverStartformat,
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

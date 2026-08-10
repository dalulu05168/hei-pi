import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const toolDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(toolDirectory, "..");
const desktopDirectory = path.resolve(projectDirectory, "..");
const sourcePath = path.join(desktopDirectory, "assets", "js", "mock-data.js");
const outputDirectory = path.join(projectDirectory, "src", "data");
const outputPath = path.join(outputDirectory, "desktop-seed.json");

const source = fs.readFileSync(sourcePath, "utf8");
const context = vm.createContext({ window: {} });
vm.runInContext(source, context, { filename: sourcePath });

const seed = context.window.PI_MOCK_DATA;
if (!seed || !Array.isArray(seed.people)) {
  throw new Error("Desktop data source did not expose PI_MOCK_DATA.people.");
}

fs.mkdirSync(outputDirectory, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");

console.log(
  JSON.stringify({
    holdings: seed.holdings.length,
    outputPath,
    people: seed.people.length,
    stocks: seed.stockCatalog.length,
    templates: 4,
  }),
);

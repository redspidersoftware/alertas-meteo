import fs from "fs";
import path from "path";

export function getVersion(): string {
  try {
    const filePath = path.join(process.cwd(), "src/version.txt");
    return fs.readFileSync(filePath, "utf-8").trim();
  } catch {
    return "desconocida";
  }
}

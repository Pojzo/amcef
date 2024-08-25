import { defineConfig } from "cypress";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
	projectId: "xrycf6",
	e2e: {
		setupNodeEvents(on, config) {
			on("task", {
				writeToFile({ filename, content }) {
					const filePath = path.join(__dirname, filename);
					fs.writeFileSync(filePath, content, "utf8");
					return null;
				},
			});
		},
	},
});

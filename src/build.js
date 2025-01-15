import fs from "fs";
import { marked } from "marked";
import frontMatter from "front-matter";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new renderer
const renderer = new marked.Renderer();

// Set marked options
marked.setOptions({
  headerIds: false,
  mangle: false,
  gfm: true,
});

// File paths
const contentPath = path.join(__dirname, "content.md");
const templatePath = path.join(__dirname, "template.html");
const outputPath = path.join(__dirname, "..", "index.html");

try {
  // Read files
  const content = fs.readFileSync(contentPath, "utf8");
  const template = fs.readFileSync(templatePath, "utf8");

  // Parse frontmatter
  const { attributes, body } = frontMatter(content);

  // Convert markdown to HTML
  const htmlContent = marked(body);

  // Replace variables in template
  const output = template
    .replace(/{{title}}/g, attributes.title || "")
    .replace(/{{description}}/g, attributes.description || "")
    .replace(
      /{{keywords}}/g,
      Array.isArray(attributes.keywords) ? attributes.keywords.join(", ") : "",
    )
    .replace(/{{language}}/g, attributes.language || "en")
    .replace(/{{author}}/g, attributes.author || "")
    .replace(/{{contact}}/g, attributes.contact || "")
    .replace(/{{organization}}/g, attributes.organization || "")
    .replace(/{{project_status}}/g, attributes.project_status || "")
    .replace(/{{project_duration}}/g, attributes.project_duration || "")
    .replace(/{{funding}}/g, attributes.funding || "")
    .replace(/{{copyright}}/g, attributes.copyright || "")
    .replace("{{content}}", htmlContent);

  // Write output
  fs.writeFileSync(outputPath, output);
  console.log("index.html generated successfully");
} catch (error) {
  console.error("Error:", error);
}

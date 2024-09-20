import { codeToHtml } from "shiki";

async function highlightCode() {
	const codeBlocks = document.querySelectorAll("code");
	for (const block of codeBlocks) {
		const lang = block.getAttribute("data-lang");
		// Enable highlighting only for code blocks with a language
		if (lang !== null) {
			const lines = block.textContent.split("\n");
            // Find the minimum indentation level
            const minIndent = Math.min(
                ...lines.filter(line => line.trim().length > 0)
                    .map(line => line.match(/^\s*/)[0].length)
            );

            // Remove the common leading whitespace
            const normalizedLines = lines.map(line => line.slice(minIndent));
            const normalizedContent = normalizedLines.join("\n");

			block.innerHTML = await codeToHtml(normalizedContent.trim(), {
				lang: lang,
				theme: "github-light-default",
			});
		}
	}
}

export { highlightCode };

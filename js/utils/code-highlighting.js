import { codeToHtml } from "shiki";

async function highlightCode() {
	const codeBlocks = document.querySelectorAll("code");
	for (const block of codeBlocks) {
		const lang = block.getAttribute("data-lang");
		// Enable highlighting only for code blocks with a language
		if (lang !== null) {
			block.innerHTML = await codeToHtml(block.textContent, {
				lang: lang,
				theme: "github-light-default",
			});
		}
	}
}

export { highlightCode };

import { codeToHtml } from "shiki";

export async function highlightCodeTags() {
	document.addEventListener("DOMContentLoaded", async () => {
		const codeElements = document.body.querySelectorAll("code");

		for (var i = 0; i < codeElements.length; i++) {
			const element = codeElements.item(i);
			element.innerHTML = await codeToHtml(element.textContent, {
				lang: "python",
				theme: "github-light-default",
			});
		}
	});
}

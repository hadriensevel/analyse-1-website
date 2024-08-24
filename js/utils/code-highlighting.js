import {codeToHtml} from 'shiki';

async function highlightCode() {
    const codeBlocks = document.querySelectorAll('code');
    for (const block of codeBlocks) {
        const lang = block.getAttribute('data-lang');
        block.innerHTML = await codeToHtml(block.textContent, {
            lang: lang,
            theme: 'github-light-default',
        });
    }
}

export {highlightCode};
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { StrictMode } from "react";

const root = document.getElementById('root')!;
root.setAttribute('dir', 'rtl');
root.setAttribute('lang', 'fa');
root.setAttribute('translate', 'no');
root.classList.add('notranslate');

const noTranslateAttr = (el: HTMLElement) => {
	el.classList.add('notranslate');
	el.setAttribute('translate', 'no');
	el.setAttribute('lang', 'fa');
};

noTranslateAttr(document.documentElement);
noTranslateAttr(document.body);
noTranslateAttr(root);

const ORIGINAL_TITLE = document.title;
const ORIGINAL_META: Map<Element, string> = new Map();
document.querySelectorAll('meta[content]').forEach((meta) => {
	const content = meta.getAttribute('content');
	if (content && /[؀-ۿ]/.test(content)) {
		ORIGINAL_META.set(meta, content);
	}
});

const titleObserver = new MutationObserver(() => {
	if (document.title !== ORIGINAL_TITLE) {
		document.title = ORIGINAL_TITLE;
	}
});
const titleEl = document.querySelector('title');
if (titleEl) {
	titleObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
}

const headObserver = new MutationObserver(() => {
	ORIGINAL_META.forEach((original, meta) => {
		if (meta.getAttribute('content') !== original) {
			meta.setAttribute('content', original);
		}
	});
});
headObserver.observe(document.head, { subtree: true, characterData: true, attributes: true, attributeFilter: ['content'] });

const bodyObserver = new MutationObserver((mutations) => {
	for (const mutation of mutations) {
		for (const node of mutation.addedNodes) {
			if (node instanceof HTMLElement) {
				node.classList.add('notranslate');
				node.setAttribute('translate', 'no');
			}
		}
	}
});
bodyObserver.observe(document.body, { childList: true });

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>
);

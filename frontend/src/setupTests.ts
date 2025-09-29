import '@testing-library/jest-dom';

// Mock para window.matchMedia no ambiente de testes
if (typeof window !== 'undefined' && !window.matchMedia) {
	window.matchMedia = (query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}

// Mock para IntersectionObserver no ambiente de testes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).IntersectionObserver = class IntersectionObserver {
	root: Element | null = null;
	rootMargin = '';
	thresholds: ReadonlyArray<number> = [];
	
	constructor() {}
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
};

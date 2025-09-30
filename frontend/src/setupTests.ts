import '@testing-library/jest-dom';

// Mock para window.matchMedia no ambiente de testes
if (typeof window !== 'undefined' && !window.matchMedia) {
	window.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	} as unknown as MediaQueryList);
}

// Mock para IntersectionObserver no ambiente de testes (typed)
declare global {
	interface Window {
		IntersectionObserver: typeof IntersectionObserver;
	}
	// For Node test env, ensure globalThis has the type as well
	var IntersectionObserver: typeof IntersectionObserver;
}

class MockIntersectionObserver implements IntersectionObserver {
	readonly root: Element | null = null;
	readonly rootMargin: string = '';
	readonly thresholds: ReadonlyArray<number> = [];
	constructor() {}
	observe(): void {}
	unobserve(): void {}
	disconnect(): void {}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

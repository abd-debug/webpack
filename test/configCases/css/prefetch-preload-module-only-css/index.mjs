// This config need to be set on initial evaluation to be effective

__webpack_nonce__ = "nonce";
__webpack_public_path__ = "https://example.com/public/path/";

it("should prefetch and preload child chunks on chunk load", () => {
	let link;

	expect(document.head._children).toHaveLength(2);

	// Test prefetch
	link = document.head._children[0];
	expect(link._type).toBe("link");
	expect(link.rel).toBe("prefetch");
	expect(link.as).toBe("style");
	expect(link.href).toBe("https://example.com/public/path/chunk2-css.css");

	link = document.head._children[1];
	expect(link._type).toBe("link");
	expect(link.rel).toBe("prefetch");
	expect(link.as).toBe("script");
	expect(link.href).toBe("https://example.com/public/path/chunk2-css.mjs");

	const promise = import(
		/* webpackChunkName: "chunk1" */ "./chunk1.mjs"
	);

	expect(document.head._children).toHaveLength(4);

	link = document.head._children[2];
	expect(link._type).toBe("link");
	expect(link.rel).toBe("preload");
	expect(link.as).toBe("style");
	expect(link.href).toBe("https://example.com/public/path/chunk1-a-css.css");

	link = document.head._children[3];
	expect(link._type).toBe("link");
	expect(link.rel).toBe("modulepreload");
	expect(link.href).toBe("https://example.com/public/path/chunk1-a-css.mjs");

	return promise.then(() => {
		expect(document.head._children).toHaveLength(4);

		const promise2 = import(
			/* webpackChunkName: "chunk1" */ "./chunk1.mjs"
		);

		const promise3 = import(/* webpackChunkNafme: "chunk2" */ "./chunk2.mjs");

		return promise3.then(() => {
			expect(document.head._children).toHaveLength(4);

			const promise4 = import(/* webpackChunkName: "chunk1-css" */ "./chunk1.css");

			expect(document.head._children).toHaveLength(5);

			link = document.head._children[4];
			expect(link._type).toBe("link");
			expect(link.rel).toBe("stylesheet");
			expect(link.href).toBe("https://example.com/public/path/chunk1-css.css");
			expect(link.crossOrigin).toBe("anonymous");

			const promise5 = import(/* webpackChunkName: "chunk2-css", webpackPrefetch: true */ "./chunk2.css");

			expect(document.head._children).toHaveLength(6);

			link = document.head._children[5];
			expect(link._type).toBe("link");
			expect(link.rel).toBe("stylesheet");
			expect(link.href).toBe("https://example.com/public/path/chunk2-css.css");
			expect(link.crossOrigin).toBe("anonymous");
		});
	});
});

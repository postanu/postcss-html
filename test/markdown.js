"use strict";

const expect = require("chai").expect;
const stylefmt = require("stylefmt");
const postcss = require("postcss");
const syntax = require("../");

describe("markdown tests", () => {
	const md = [
		"---",
		"title: Something Special",
		"---",
		"Here is some text.",
		"```css",
		".foo {}",
		"```",
		"And some other text.",
		"```css",
		"    .foo { color: pink; }",
		"      .bar {}",
		"```",
		"<style>",
		"a {",
		"\tdisplay: flex;",
		"}",
		"</style>",
		"```scss",
		"// Parser-breaking comment",
		"$foo: bar;",
		".foo {}",
		"```",
		"And the end.",
	].join("\n");

	it("CSS", function () {
		return postcss([
			root => {
				expect(root.nodes).to.have.lengthOf(4);
			},
		]).process(md, {
			syntax,
			from: "markdown.md",
		}).then(result => {
			expect(result.content).to.equal(md);
		});
	});

	it("Without code blocks", function () {
		return postcss([
			root => {
				expect(root.nodes).to.have.lengthOf(0);
			},
		]).process("# Hi\n", {
			syntax,
			from: "without_code_blocks.md",
		}).then(result => {
			expect(result.content).to.equal("# Hi\n");
		});
	});

	it("stylefmt", function () {
		const source = [
			"title: Something Special",
			"```css",
			"    .foo {",
			"    color: pink;",
			"    }",
			"      .bar {}",
			"```",
			"And the end.",
		].join("\n");
		const code = [
			"title: Something Special",
			"```css",
			".foo {",
			"\tcolor: pink;",
			"}",
			"",
			".bar {",
			"}",
			"```",
			"And the end.",
		].join("\n");
		return postcss([
			stylefmt,
		]).process(source, {
			syntax,
			from: "stylefmt.md",
		}).then(result => {
			expect(result.content).to.equal(code);
		});
	});
});
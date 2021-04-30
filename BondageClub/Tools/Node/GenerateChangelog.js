"use strict";
const fs = require("fs");
const path = require("path");
const util = require("util");
const cheerio = require("cheerio");
const marked = require("marked");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const bcRoot = path.resolve(__dirname, "../..");

generateChangelogHtml();

async function generateChangelogHtml() {
	const htmlPath = path.join(bcRoot, "changelog.html");
	const markdownPath = path.join(bcRoot, "CHANGELOG.md");

	const [sourceHtml, sourceMarkdown] = await Promise.all([
		readFileAsync(htmlPath, "utf-8"),
		readFileAsync(markdownPath, "utf-8"),
	]);

	const startIndex = sourceMarkdown.search(/^## \[R[0-9a-zA-Z]+]/m);
	const trimmedMarkdown = sourceMarkdown.substring(startIndex);
	const renderedMarkdown = marked(trimmedMarkdown);

	const $ = cheerio.load(sourceHtml);
	$("body").empty()
		.append("<h1>Bondage Club - Changelog</h1>")
		.append("<h2>Table of Contents</h2>")
		.append(generateToc(sourceMarkdown))
		.append(renderedMarkdown);

	await writeFileAsync(htmlPath, $.root().html());
}

function generateToc(sourceMarkdown) {
	const $ = cheerio.load("<ul></ul>");
	const matches = sourceMarkdown.match(/^## \[R[0-9A-Z]+]/gim);
	matches.forEach((match, i) => {
		const version = match.match(/\[(R[0-9A-Z]+)]/)[1];
		$("ul").append(`<li><a href="#${version.toLowerCase()}">${version}${i === 0 ? " (Current)" : ""}</a></li>`);
	});
	return $.root().html();
}

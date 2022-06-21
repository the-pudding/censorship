const parseVtt = (str) => {
	const groups = str.split("<v");
	const lines = groups.slice(1).map(s => {
		const r = s
			.replace("Speaker>", "")
			.replace("</v>", "")
			.replace("<c.highlight>", "<mark>")
			.replace("</c>", "</mark>");
		const rSplit = r.split("\n");
		const q = rSplit.slice(0, rSplit.length < 4 ? rSplit.length : -3).join(" ");
		const [speaker, text] = q.split(":");
		return { speaker, text };
	});
	return lines;
};


export default async function cleanQuotes({ data, clips }) {
	const clean = [];

	for (let id of clips) {
		const response = await fetch(`assets/captions/${id}.vtt`);
		const text = await response.text();
		const lines = parseVtt(text);

		const match = data.find((d) => d.id === id);
		clean.push({
			id,
			lines,
			title: `Season ${match.season} Episode ${match.episode}`,
			lineIndex: +match.lineNumber - 1
		});
	}

	return clean;
}
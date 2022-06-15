import rawData from "$data/cuts.csv";

const toSeconds = (str) => {
	const [m, s] = str.split(":").map((d) => +d);
	return s + m * 60;
};

// id	index	season	episode	cut_seconds	cut_start	cut_stop	clip_start	clip_stop	cut_content	type subtype	subtype2	visual	sidenote	guideline_no
const data = rawData.map(d => ({
	index: +d.index,
	id: d.id,
	season: d.season,
	episode: d.episode,
	start: toSeconds(d.clip_start),
	stop: toSeconds(d.clip_stop),
	timeStart: toSeconds(d.cut_start),
	timeStop: toSeconds(d.cut_stop),
	lineNumber: d.cut_line,
	type: d.type,
	guideline: +d.guideline_no
}));

export const get = async () => {
	const body = { data };
	return { body };
};
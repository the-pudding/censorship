import { max, range, groups, descending } from "d3";

const episodeCount = 100;

export default function getEpisodes(data) {
	const maxSeconds = max(data, (d) => d.timeStop);

	data.sort((a, b) => descending(a.timeStop - a.timeStart, b.timeStop - b.timeStart));

	let row = 0;
	let tallyLeft = 0;
	const scenes = data.map((d, i) => {
		const w = (d.timeStop - d.timeStart) / maxSeconds * 100;
		const width = `${w}%`;
		const left = `${d.timeStart / maxSeconds * 100}%`;

		if (tallyLeft + w > 100) {
			tallyLeft = 0;
			row += 1;
		}
		const targetX = tallyLeft;
		const targetY = row;
		tallyLeft += w;
		return {
			...d,
			i,
			left,
			width,
			targetX,
			targetY
		}
	});

	const grouped = groups(scenes, (d) => d.index);

	const getScenes = (index) => {
		const match = grouped.find(([i]) => i === index);
		return match ? match[1] : [];
	};

	const episodes = range(episodeCount).map((d, index) => ({
		index,
		scenes: getScenes(index)
	}));

	return episodes;
}
let w = window.innerWidth;
let h = window.innerHeight;
let timeChartRatioW = .95;
let timeChartRatioH = .20;

// conda activate lunarlandervis 
d3.select("#episode-chart")
	.attr("width", w * timeChartRatioW)
	.attr("height", h * timeChartRatioH);
d3.select("#timestep-chart")
	.attr("width", w * timeChartRatioW)
	.attr("height", h * timeChartRatioH);


d3.select("#arrow-svg")
	.attr("width", 300 )
	.attr("height", 350);

let rW = 50;
let rH = 50;
let r = 10;
let midH = rH/2;
let midW = rW/2;

let diffW = (rW + r/2)/2;
let diffH = (rW + r/2)/2;

let selectedEpisode = 2689; // 400, 760, 800, 950, 2830

let opaque = 1;
let thin = .01;
let timeHighlight = 50;

function toRadians(a) { return a * (Math.PI / 180) }
function toDegrees(a) { return a * (180/ Math.PI) }

let leftArrow = `<line x1="10" y1="0" x2="0" y2="0"
	stroke-width="2"
	marker-end="url(#arrowhead)"
/>`;

let rightArrow = `<line x1="0" y1="0" x2="0" y2="0"
	stroke-width="2"
	marker-end="url(#arrowheadselected)"
/>`;

let agentString = `
	<rect width="${rW}" height="${rH}"> </rect>
	<circle cx="${-r}" cy="${midH}" r="${r}" id="action1"></circle>
	<circle cx="${r + rW}" cy="${midH}" r="${r}" id="action3"></circle>
	<circle cx="${midW}" cy="${rH + r}" r="${r}" id="action2"></circle>
	<line x1="${midW}" y1="${midH}" x2="${midW}" y2="${-0}"
		stroke-width="1.5" marker-end="url(#arrowhead)" />
`;

function setupHistory(actions) {

	let icons = ["",`
		<g transform="translate(10,30)">
			<line x1="10" y1="0" x2="0" y2="0" stroke-width="2"
				marker-end="url(#arrowhead)" />
		</g>`,`
		<circle cx="${30}" cy="${30}" r="${r}" id="action2"></circle>
		`,`
		<g transform="translate(30,30) scale(1)">
			<line x1="-10" y1="0" x2="0" y2="0" stroke-width="2"
				marker-end="url(#arrowhead)" />
		</g>`
	]
	d3.select("#action-history").selectAll("div")
		.data(actions)
		.join("div")
		.html(d => `
			<div style="display:flex">
				<div>
					<div> Timestep: ${d.Timestep}</div>
					<div> Action: ${d.Action}</div>
				</div>
				<svg width="50" height="50"> ${icons[d.Action]} </svg>
			</div>
		`)
		.classed("item-box", true);
}



function agentAnimation(actions, rotate=true) {
	function getPosition(rx, ry, diffW=0, diffH=0) {
		return `${x(rx) + diffW}, ${y(ry) + diffH }`
	}

	let x = d3.scaleLinear()
	.range([0, 500])
	.domain([-1, 1]) //d3.min(data, d => d.x), d3.max(data, d => d.x)]

	let y = d3.scaleLinear()
		.range([350, 0])
		.domain([-1, 1]) //[d3.min(data, d => d.y), d3.max(data, d => d.y)]

	let agentSVG = d3.select("#main-area")
		.selectAll("g")
		.data(actions)
		.join("g")
			.style("fill", "#FFFFFF08")
			.style("stroke", "#00000058") // 00000018
			.style("opacity", (d,i) => (i % (timeHighlight) == 0)  || (i == actions.length - 1) ? opaque : thin)
			.attr("transform", d => (`translate(${getPosition(d.x, d.y, 0, 80)}) 
									${ rotate ? "rotate(" + toDegrees(d.angle) + " "
									+ (diffW) + "," + (diffH) + ")" : ""}`  ))
		.html(agentString)
	
	
	// d3.select("#main-area").append("g")
	// 	.selectAll("circle")
	// 	.data(actions)
	// 	.join("circle")
	// 		.attr("cx", d=> x(d.x))
	// 		.attr("cy", d=> y(d.y))
	// 		.attr("r", d => 10)
	// 		.style("fill", "green")
	// 		.style("opacity", (d,i) => i % timeHighlight == 0 ? 1 : 0)

	// d3.select("#main-area").append("g")
	// 	.selectAll("circle")
	// 	.data(actions)
	// 	.join("circle")
	// 		.attr("cx", d=> x(d.x) + diffW)
	// 		.attr("cy", d=> y(d.y) + diffH)
	// 		.attr("r", d => 10)
	// 		.style("fill", "blue")
	// 		.style("opacity", (d,i) => i % timeHighlight == 0 ? 1 : 0)
	
	agentSVG.select("#action1").style("fill", d=> d.Action == 1 ? "crimson": "#FFFFFF00")
	agentSVG.select("#action2").style("fill", d=> d.Action == 2 ? "crimson": "#FFFFFF00")
	agentSVG.select("#action3").style("fill", d=> d.Action == 3 ? "crimson": "#FFFFFF00")
}

function arrowAnimation(actions, rotate=true) {
	function getPosition(rx, ry, diffW=0, diffH=0) {
		return `${x(rx) + diffW}, ${y(ry) + diffH }`
	}
	let x = d3.scaleLinear()
		.range([0, 300])
		.domain([-1, 1])

	let y = d3.scaleLinear()
		.range([350, 0])
		.domain([-1, 1])

	let size = d3.scaleLinear()
		.range([-10, 10])
		.domain([d3.min(data, d => d.av), d3.max(data, d => d.av)])

	let color = d3.scaleSequential(d3.interpolatePiYG)
		// .range(["blue", "red"])
		// .domain([d3.min(data, d => d.av), d3.max(data, d => d.av)]);

	d3.select("#arrow-area")
		.selectAll("g")
		.data(actions)
		.join("g")
			// .style("opacity", .1)	
			.style("opacity", (d,i) => (i % Math.floor(timeHighlight/3) == 0)  || (i == actions.length - 1)? 1 : .01)
			.attr("transform", d => (`translate(${getPosition(d.x, d.y, 0, 80)}) 
									${ rotate ? "rotate(" + toDegrees(d.angle) + ")" : ""}`  ))
			.html(d => `
				<line x1="-5" y1="-15" x2="-5" y2="${size(d.av)}" stroke="${color(d.av)}"/>
				<polygon points="0 0, -10 0, -5 10" fill="${color(d.av)}" stroke="${color(d.av)}"/>
			`)
	// d3.select("#arrow-area").append("g")
	// 	.selectAll("circle")
	// 	.data(actions)
	// 	.join("circle")
	// 		.attr("cx", d=> x(d.x))
	// 		.attr("cy", d=> y(d.y))
	// 		.attr("r", d => 5)
	// 		.style("fill", "green")
	// 		.style("opacity", (d,i) => i % timeHighlight == 0 ? 1 : 0)

	// d3.select("#arrow-area").append("g")
	// 	.selectAll("circle")
	// 	.data(actions)
	// 	.join("circle")
	// 		.attr("cx", d => -5)
	// 		.attr("cy", d=> size(d.av))
	// 		.attr("r", d => 5)
	// 		.style("fill", "blue")
	// 		.style("opacity", (d,i) => i % timeHighlight == 0 ? 1 : 0)
}

function rewardLineChart(datar) {
	// let dat = d3.rollup(datar, group => d3.max(group, d=> d["Reward"]), d => d["Episode"]);
	// let dat = d3.rollup(datar, group => group[group.length-1]["Reward"], d => d["Episode"]);
	
	// let dat = d3.rollup(datar,
	// 	group => d3.mean(group.slice(group.length - 10, group.length - 1), g => g["Reward"]),
	// 	d => d["Episode"]);

	let dat = d3.rollup(datar, group => d3.sum(group, g => g["Reward"]), d => d["Episode"]);
	
	dat = Array.from(dat).map(d => ({"Reward": d[1]}));
	dat = dat.map((d,i) => ({"Reward": d["Reward"] < -50 ? -50 : d["Reward"], "i": i}));
	console.log(dat.filter(d=> d["Reward"] > 200))
	setupLineChart(dat, "#episode-chart", "Reward")
}

function timestepLineChart(datat) {
	setupLineChart(datat,"#timestep-chart", "Reward")
}

function setupLineChart(datal,id, k) {
	let dat = datal.map((d,i) => ({y:d[k], x:i, z:"a"}))
	let node = d3.select(`${id}`).node()
	node.data = dat;
	node.yDomain = d3.extent(dat, d => d["y"]);
}

function updateUI() {
	console.log(data.columns)
	let dataFiltered = data.filter(d => d.Episode == selectedEpisode); 
	setupHistory(dataFiltered);
	agentAnimation(dataFiltered);
	arrowAnimation(dataFiltered);
	rewardLineChart(data);
	timestepLineChart(dataFiltered);

	// setTimeout(() =>{
	// 	arrowAnimation(dataFiltered, false);
	// }, 2000)
}

let data = {};
function loadData() {
	d3.csv("dataTest/data2.csv", d3.autoType).then(dataRaw => {
		data = dataRaw;
		updateUI();
	});
}

loadData()

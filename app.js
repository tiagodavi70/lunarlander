let w = window.innerWidth;
let h = window.innerHeight;
let timeChartRatioW = .95;
let timeChartRatioH = .20;

d3.select("#episode-chart")
	.attr("width", w * timeChartRatioW)
	.attr("height", h * timeChartRatioH);
d3.select("#timestep-chart")
	.attr("width", w * timeChartRatioW)
	.attr("height", h * timeChartRatioH);

// d3.select("#arrow-svg")
// 	.attr("width", 300)
// 	.attr("height", 350);

let rW = 50;
let rH = 50;
let r = 10;
let midH = rH/2;
let midW = rW/2;

let diffW = (rW + r/2)/2;
let diffH = (rW + r/2)/2;

let selectedEpisode = 2413;

let opaque = 1;
let thin = .01;
let timeHighlight = 50;

function toRadians(a) { return a * (Math.PI / 180) }
function toDegrees(a) { return a * (180/ Math.PI) }

let leftArrow = `<line x1="10" y1="0" x2="0" y2="0"
	stroke-width="2"
/>`;

let rightArrow = `<line x1="0" y1="0" x2="0" y2="0"
	stroke-width="2"
/>`;

let agentString = `
	<rect width="${rW}" height="${rH}" class="agent-part"> </rect>
	<circle cx="${-r}" cy="${midH}" r="${r}" id="action1" class="action agent-part"></circle>
	<circle cx="${r + rW}" cy="${midH}" r="${r}" id="action3" class="action agent-part"></circle>
	<circle cx="${midW}" cy="${rH + r}" r="${r}" id="action2" class="action agent-part"></circle>
	<line x1="${midW}" y1="${midH}" x2="${midW}" y2="${-0}"
		stroke-width="1.5" class="agent-part"/>
`;

function historicPlot(actions) {
	
	let icons = [
		`<polygon points="0 0, 15 0" />`,
		`<polygon points="0 0, 15 -10, 15 10" />`,
		`<circle cx="${7}" cy="${0}" r="${r}" ></circle>`,
		`<polygon points="15 0, 0 -10, 0 10" />`
	]

	let cols = 5;
	let hist_w = 230;
	
	let x = d3.scaleLinear()
		.domain([0, cols - 1])
		.range([5, hist_w - 5])
	let y = d3.scaleLinear()
		.domain([0, actions.length / cols])
		.range([20, (actions.length / cols) * 30])

	return d3.select("#action-history").select("svg")
			.attr("width", hist_w)
			.attr("height", y.range()[1])
		.selectAll("g")
		.data(actions)
		.join("g")
		.attr("id", (d,i) => `action-history-${i}`)
		.html(d => `${icons[d.Action]}`)
			.attr("transform", (d,i) => `scale(1) translate(${10 + x(i%cols)}, ${y(Math.floor(i/cols))})`)
			.style("stroke", "black")
			.style("fill", "DarkCyan");
}

function agentPlot(actions, rotate=true) {
	
	let agentW = h * .48;
	let agentH = h * .48;
	
	let x = d3.scaleLinear()
		.range([50, agentW - 50])
		.domain([-1, 1]);
	let y = d3.scaleLinear()
		.range([agentH - 30, 60])
		.domain([-1, 1]);

	d3.select("#location-area").select("#base-land")
		.style("fill", "DarkCyan")
		.attr("width", (agentW - 50)*2)
		.attr("height", 10)
		.attr("x", x(-2))
		.attr("y", y(actions[actions.length-1].y) + 50)

		// .attr("transform", d => (`translate(${x(-1)}, ${y(actions[actions.length-1].y) + 50})`  ))
	let highlight_condition = (d,i) => (i % (timeHighlight) == 0)  || (i == actions.length - 1);
	let agentSVG = d3.select("#location-area")
			.attr("width", agentW - 10)
			.attr("height", agentH - 80)
		.select("#main-area")
		.selectAll("g")
		.data(actions)
		.join("g")
			.style("fill", "#FFFFFF08")
			.style("stroke", "#00000058") // 00000018
			.style("opacity", (d,i) => highlight_condition(d, i) ? opaque : thin)
			.attr("transform", d => (`translate(${x(d.x)}, ${y(d.y)}) 
									${ rotate ? "rotate(" + toDegrees(d.angle) + " "
									+ (diffW) + "," + (diffH) + ")" : ""}`  ))
		.html(agentString)
	
	agentSVG.select("#action1").style("fill", d => d.Action == 1 ? "crimson": "#FFFFFF00")
	agentSVG.select("#action2").style("fill", d => d.Action == 2 ? "crimson": "#FFFFFF00")
	agentSVG.select("#action3").style("fill", d => d.Action == 3 ? "crimson": "#FFFFFF00")

	return agentSVG;
}

function velocityPlot(actions, rotate=true) {
	let velW = h * .48;
	let velH = h * .48;
	
	let x = d3.scaleLinear()
		.range([50, velW - 50])
		.domain([-1, 1]);
	let y = d3.scaleLinear()
		.range([velH - 30, 60])
		.domain([-1, 1]);

	d3.select("#arrow-svg")
		.attr("width", velW - 10)
		.attr("height", velH - 80)
	.select("#base-land")
		.style("fill", "DarkCyan")
		.attr("width", (velW - 50)*2)
		.attr("height", 10)
		.attr("x", x(-2))
		.attr("y", y(actions[actions.length-1].y) + 50)

	// let x = d3.scaleLinear()
	// 	.range([0, 350])
	// 	.domain([-1, 1]);
	// let y = d3.scaleLinear()
	// 	.range([350, 0])
	// 	.domain([-1, 1]);

	let size = d3.scaleLinear()
		.range([0, 50])
		.domain([d3.min(actions, d => d.av), d3.max(actions, d => d.av)]);
	let color = d3.scaleLinear()
		.range(["indigo", "purple","orange"])
		.domain([0, d3.max(actions, d => d.av)/2, d3.max(actions, d => d.av*1.).toFixed(2)]);

	let legend = document.querySelector("#velocity-legend")
	legend.data = color.domain();
	legend.colors = color.range();

	let highlight_condition = (d,i) => ( i % (timeHighlight) == 0)  || (i == actions.length - 1);
	return d3.select("#arrow-area")
		.selectAll("g")
		.data(actions)
		.join("g")
			// .style("opacity", .1)	
			// .style("opacity", (d,i) => highlight_condition(d,i)? 1 : .01)
			.attr("transform", d => (`translate(${x(d.x) + diffW}, ${y(d.y) + diffH}) 
									${ rotate ? "rotate(" + toDegrees(d.angle) + ")" : ""}`  ))
			// .html(d => `
			// 		<line x1="-5" y1="-15" x2="-5" y2="${size(d.av)}" stroke-width="15" stroke="${color(d.av)}"/>
			// 		<line x1="0" y1="0" x2="${size(d.av)}" y2="${size(d.av)}" stroke-width="25" stroke="${color(d.av)}" style="opacity:.01"/>
			// `)
			// .attr("transform", d => (`translate(${x(d.x) + diffW}, ${y(d.y) + diffH}) 
			// 						${ rotate ? "rotate(" + toDegrees(d.angle) + ")" : ""} scale(8)`  ))
			.html((d,i) => `
				<rect width="15" height="${size(d.av)}" x="-10" y="-5"
					fill="${color(d.av)}" stroke="${color(d.av)}" style="opacity:.008"></rect>
				<path d="M0 0 0 10 M3 5 0 9.7 M-3 5 0 9.7" transform="scale(2.5)"
					stroke="${color(d.av)}" style="opacity: ${i % 12 == 0 ? ".7" : ".09"}"> </path>
			`)
			// <polygon points="0 0, -10 0, -5 10" fill="${color(d.av)}" stroke="${color(d.av)}"/>
}

function rewardLineChart(rewards, selectedEpisode=-1) {

	let dat = d3.rollup(rewards, group => d3.sum(group, g => +g["Reward"]), d => d["Episode"]);
	
	dat = Array.from(dat).map(d => ({"Reward": d[1]}));
	dat = dat.map((d,i) => ({"Reward": (+d["Reward"]) < -200 ? -200 : +d["Reward"], "i": i}));
	let linechart = setupLineChart(dat, "#episode-chart", "Reward");
	if (selectedEpisode >= 0) {
		linechart.point = {"x": selectedEpisode, "y": +dat[selectedEpisode].Reward};
	}
	return linechart;
}

function timestepLineChart(rewards) {
	return setupLineChart(rewards,"#timestep-chart", "Reward")
}

function setupLineChart(datal,id, k) {
	let dat = datal.map((d,i) => ({y:d[k], x:i, z:"a"}))
	let node = d3.select(`${id}`).node()
	node.data = dat;
	node.yDomain = d3.extent(dat, d => d["y"]);
	return node;
}

function updateUI(data) {
	console.log(data.columns);
	let history = historicPlot(data);
	let velocity = velocityPlot(data);
	let agent = agentPlot(data);
	let timestep = timestepLineChart(data);

	return {"historic": history, "agent": agent, "velocity": velocity, "timestep": timestep}
}

let data = [];
function selectEpisode(selectionData) {

	let episode = selectionData.i;
	d3.selectAll(".episode-display").text(`Episode ${episode}`);
	let dataFiltered = data.filter(d => d.Episode == episode); 
	console.log(dataFiltered, data.map(d => d.Episode), episode);
	dataFiltered.columns = data.columns;

	let ui = updateUI(dataFiltered);
	ui.controls = d3.selectAll("#controls");
	
	let pl = document.querySelector("#player");
	pl.finalValue = dataFiltered.length - 1; // max
	// pl.timeStep = 41.6; // framerate 24fps
	// pl.timeStep = 17; // framerate 60fps
	pl.timeStep = 8; // framerate 120fps
	
	selectedEpisode = episode;

	pl.addEventListener("value-changed", function() {
		let ts = this.currentValue;
		let datapoint = dataFiltered[ts];
		d3.selectAll(".timestep-display").text(`Timestep: ${ts}`);
		let cond = (d,i) => i <= ts || ts == 0; 

		ui.agent.style("display", (d,i) => cond(d, i) ? "inherit" : "none");
		ui.velocity.style("display", (d,i) => cond(d, i) ? "inherit" : "none");
		ui.controls.selectAll(".action").style("fill", function(d, i) { 
			return this.id[6] == datapoint.Action ? "crimson" : "DarkCyan"
		});
		ui.timestep.point = {"x": ts, "y": +datapoint.Reward};
		ui.historic
			.style("stroke", (d, i) => i == ts ? "red" : "black")
			.style("fill",   (d, i) => i == ts ? "red" : "DarkCyan")
	});
};

function loadData() {
	// d3.csv("dataTest/RLLunarLanding2023.3.csv", d3.autoType).then(dataR => {
	// d3.csv("dataTest/data.csv", d3.autoType).then(dataR => {
		// data = dataR;
		
	// d3.csv(`data/data_${1}.csv`, d3.autoType).then(jj => {console.log(jj.length)})
	Promise.all(d3.range(1,11).map(index => d3.csv(`data/data_${index}.csv`, d3.autoType))).then((alldata) => {
		for (let i = 0; i < alldata.length; i++ ) {
			data = data.concat(alldata[i]);
		}
		let rewardLine = rewardLineChart(data, selectedEpisode);
		rewardLine.interactive = true;
		rewardLine.cb = selectEpisode;
		selectEpisode({"i": selectedEpisode});
	});
}
loadData();

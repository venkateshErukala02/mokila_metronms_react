// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const PingAreaChart = () => {
//   const chartRef = useRef();

//   useEffect(() => {

// const fetchDataAndRender = async () => {
//     try {
//       const res = await fetch("http://localhost:8980/metronms/rest/measurements/icmp/node%5B634%5D.responseTime%5B192.168.66.44%5D?aggregation=AVERAGE&relaxed=true&duration=1h");
//       const rawData = await res.json();

//       if (
//         !rawData.timestamps || 
//         !rawData.columns?.[0]?.values || 
//         rawData.timestamps.length !== rawData.columns[0].values.length
//       ) {
//         console.error("Invalid data structure", rawData);
//         return;
//       }

//       const data = rawData.timestamps.map((ts, i) => {
//         const val = rawData.columns[0].values[i];
//         return {
//           date: new Date(ts),
//           value: typeof val === "number" ? val : Number(val)
//         };
//       }).filter(d => !isNaN(d.value));

//       console.log('ppp',data)

//       if (!data.length) {
//         console.warn("No valid data to render");
//         return;
//       }

//       renderChart(data); // your chart function
//     } catch (e) {
//       console.error("Fetch failed", e);
//     }
//   };


//    const renderChart = (data) => {
//   const width = 928;
//   const height = 500;
//   const margin = { top: 20, right: 20, bottom: 30, left: 30 };


//   // Fix scale domains
// const x = d3.scaleUtc()
//   .domain(d3.extent(data, d => data[0].date))
//   .range([margin.left, width - margin.right]);

// const y = d3.scaleLinear()
//   .domain([0, d3.max(data, d => data[0].value)])
//   .nice()
//   .range([height - margin.bottom, margin.top]);


//   const area = d3.area()
//     .curve(d3.curveStepAfter)
//     .x(d => x(d.date))
//     .y0(y(0))
//     .y1(d => y(d.value));

//   const svg = d3.create("svg")
//     .attr("viewBox", [0, 0, width, height])
//     .attr("width", width)
//     .attr("height", height)
//     .attr("style", "max-width: 100%; height: auto;");

//   const path = svg.append("path")
//     .attr("fill", "steelblue")
//     .attr("d", area(data));

//   const xAxis = g => g
//     .attr("transform", `translate(0,${height - margin.bottom})`)
//     .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

//   const yAxis = g => g
//     .attr("transform", `translate(${margin.left},0)`)
//     .call(d3.axisLeft(y).ticks(null, "s"))
//     .call(g => g.select(".domain").remove());

//   svg.append("g").call(xAxis);
//   svg.append("g").call(yAxis);

//   const zoom = d3.zoom()
//     .scaleExtent([1, 32])
//     .extent([[margin.left, 0], [width - margin.right, height]])
//     .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
//     .on("zoom", event => {
//       const xz = event.transform.rescaleX(x);
//       path.attr("d", area(data.map(d => ({ ...d, date: d.date }))));
//       svg.select("g").call(d3.axisBottom(xz).ticks(width / 80).tickSizeOuter(0));
//     });

//   svg.call(zoom);

//   d3.select(chartRef.current).selectAll("*").remove();
//   chartRef.current.appendChild(svg.node());
// };


//     fetchDataAndRender();
//   }, []);

 

//   return (
//     <div>
//       <h3>Ping Chart</h3>
//      <div ref={chartRef} style={{ minHeight: 300 }}></div>

//     </div>
//   );
// };

// export default PingAreaChart;


// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const PingAreaChart = () => {
//   const chartRef = useRef();

//   useEffect(() => {
//     const staticData = [
//       { date: new Date("2025-06-25T04:05:00.000Z"), value: 0.4885466666666667 },
//       { date: new Date("2025-06-25T04:10:00.000Z"), value: 0.41988333333333333 },
//       { date: new Date("2025-06-25T04:15:00.000Z"), value: 0.45222333333333337 },
//       { date: new Date("2025-06-25T04:20:00.000Z"), value: 0.4539266666666667 },
//       { date: new Date("2025-06-25T04:25:00.000Z"), value: 0.44799666666666665 },
//       { date: new Date("2025-06-25T04:30:00.000Z"), value: 0.38133999999999996 },
//       { date: new Date("2025-06-25T04:35:00.000Z"), value: 0.34486666666666665 },
//       { date: new Date("2025-06-25T04:40:00.000Z"), value: 0.38477999999999996 },
//       { date: new Date("2025-06-25T04:45:00.000Z"), value: 0.42329666666666665 },
//       { date: new Date("2025-06-25T04:50:00.000Z"), value: 0.44981333333333334 },
//       { date: new Date("2025-06-25T04:55:00.000Z"), value: 0.5349833333333334 },
//       { date: new Date("2025-06-25T05:00:00.000Z"), value: 0.4433333333333333 },
//       { date: new Date("2025-06-25T05:05:00.000Z"), value: 0.33466 }
//     ];

//     renderChart(staticData);
//   }, []);

//   const renderChart = (data) => {
//     const width = 928;
//     const height = 500;
//     const margin = { top: 20, right: 20, bottom: 30, left: 40 };

//     // const x = d3.scaleUtc()
//     //   .domain(d3.extent(data, d => d.date))
//     //   .range([margin.left, width - margin.right]);
//     const extent = d3.extent(data, d => d.date);
// console.log("X Domain Extent:", extent);  // Should be [Date, Date]

// const x = d3.scaleLinear()
//   .domain(extent)
//   .range([margin.left, width - margin.right]);


//     const y = d3.scaleLinear()
//       .domain([0, d3.max(data, d => d.value)]).nice()
//       .range([height - margin.bottom, margin.top]);

//     const area = d3.area()
//       .curve(d3.curveStepAfter)
//       .x(d => x(d.date))
//       .y0(y(0))
//       .y1(d => y(d.value));

//     const svg = d3.create("svg")
//       .attr("viewBox", [0, 0, width, height])
//       .attr("width", width)
//       .attr("height", height)
//       .attr("style", "max-width: 100%; height: auto;");

//     svg.append("path")
//       .datum(data)
//       .attr("fill", "steelblue")
//       .attr("d", area);

//     const xAxis = g => g
//       .attr("transform", `translate(0,${height - margin.bottom})`)
//       .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

//     const yAxis = g => g
//       .attr("transform", `translate(${margin.left},0)`)
//       .call(d3.axisLeft(y).ticks(null, "s"))
//       .call(g => g.select(".domain").remove());

//     svg.append("g").call(xAxis);
//     svg.append("g").call(yAxis);

//     d3.select(chartRef.current).selectAll("*").remove();
//     chartRef.current.appendChild(svg.node());
//   };

//   return (
//     <div>
//       <h3>Ping Chart</h3>
//       <div ref={chartRef} style={{ minHeight: 300 }} />
//     </div>
//   );
// };

// export default PingAreaChart;

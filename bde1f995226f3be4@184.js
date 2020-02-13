// https://observablehq.com/@d3/radial-dendrogram@184
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["flare-2.json",new URL("./files/data.json",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md``
)});
  main.variable(observer("chart")).define("chart", ["tree","d3","data","autoBox"], function*(tree,d3,data,autoBox)
{
  const root = tree(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name)));

  const svg = d3.create("svg")
      .style("max-width", "95%")
      .style("height", "auto")
      .style("font", "13px Mikado")
      .style("margin", "0px")
      .style("transform", "translate(5%, 5%)")
      .attr("fill", "black");

  const link = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#2E2644")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.75)
    .selectAll("path")
    .data(root.links())
    .enter().append("path")
      .attr("d", d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));
  
  const node = svg.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants().reverse())
    .enter().append("g")
      .attr("transform", d => `
        rotate(${d.x * 180 / Math.PI - 90})
        translate(${d.y},0)
      `);
  
  node.append("circle")
      .attr("fill", d => d.children ? "#8C0033" : "#FFAF1C")
      .attr("r", 2);
  
  node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
    .filter(d => d.children)
    .clone(true).lower()
      .attr("stroke", "white");

  yield svg.node();

  svg.attr("viewBox", autoBox);
}
);
  main.variable(observer("autoBox")).define("autoBox", function(){return(
function autoBox() {
  const {x, y, width, height} = this.getBBox();
  return [x, y, width, height];
}
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("flare-2.json").json()
)});
  main.variable(observer("width")).define("width", function(){return(
975
)});
  main.variable(observer("radius")).define("radius", ["width"], function(width){return(
width / 2
)});
  main.variable(observer("tree")).define("tree", ["d3","radius"], function(d3,radius){return(
d3.cluster().size([2 * Math.PI, radius - 100])
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}

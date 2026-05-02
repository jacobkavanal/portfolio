import { fetchJSON, renderProjects } from "../global.js";
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON("../lib/projects.json");
const projectsContainer = document.querySelector(".projects");
const projectsTitle = document.querySelector(".projects-title");
const searchInput = document.querySelector(".searchBar");
let query = "";
let selectedIndex = -1;

renderProjects(projects, projectsContainer, "h2");

projectsTitle.textContent = `Projects (${projects.length})`;

function renderPieChart(projectsGiven) {
    const rolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );
    const data = rolledData.map(([year, count]) => {
        return { value: count, label: year };
    });
    const sliceGenerator = d3.pie().value((d) => d.value);
    const arcData = sliceGenerator(data);
    const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    const arcs = arcData.map((d) => arcGenerator(d));
    const colors = d3.scaleOrdinal(d3.schemeTableau10);
    const svg = d3.select("svg");
    const legend = d3.select(".legend");

    svg.selectAll("path").remove();
    legend.selectAll("li").remove();

    arcs.forEach((arc, i) => {
        svg
            .append("path")
            .attr("d", arc)
            .attr("fill", colors(i))
            .attr("class", selectedIndex === i ? "selected" : "")
            .on("click", () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                svg
                    .selectAll("path")
                    .attr("class", (_, idx) => selectedIndex === idx ? "selected" : "");

                legend
                    .selectAll("li")
                    .attr("class", (_, idx) => selectedIndex === idx ? "legend-item selected" : "legend-item");

                if (selectedIndex === -1) {
                    renderProjects(projects, projectsContainer, "h2");
                } else {
                    const selectedYear = data[selectedIndex].label;
                    const filteredProjects = projects.filter((project) => project.year === selectedYear);
                    renderProjects(filteredProjects, projectsContainer, "h2");
                }
            });
    });

    data.forEach((d, idx) => {
        legend
            .append("li")
            .attr("style", `--color:${colors(idx)}`)
            .attr("class", selectedIndex === idx ? "legend-item selected" : "legend-item")
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}

renderPieChart(projects);

searchInput.addEventListener("change", (event) => {
    query = event.target.value;
    const filteredProjects = projects.filter((project) => {
        const values = Object.values(project).join("\n").toLowerCase();
        return values.includes(query.toLowerCase());
    });

    renderProjects(filteredProjects, projectsContainer, "h2");
    renderPieChart(filteredProjects);
});

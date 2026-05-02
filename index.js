import { fetchJSON, renderProjects, fetchGitHubData } from "./global.js";

const projects = await fetchJSON("./lib/projects.json");
const latestProjects = Array.isArray(projects) ? projects.slice(0, 3) : [];
const projectsContainer = document.querySelector(".projects");

renderProjects(latestProjects, projectsContainer, "h2");

const profileStats = document.querySelector("#profile-stats");

if (profileStats) {
    profileStats.innerHTML = `
        <h2>GitHub Stats</h2>
        <p>Loading GitHub stats...</p>
    `;
}

const githubData = await fetchGitHubData("jacobkavanal");

if (profileStats) {
    profileStats.innerHTML = githubData ? `
        <h2>GitHub Stats</h2>
        <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    ` : `
        <h2>GitHub Stats</h2>
        <p>GitHub stats could not be loaded.</p>
    `;
}

console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching or parsing JSON data:", error);
    }
}

export function renderProjects(projects = [], containerElement, headingLevel = "h2") {
    if (!containerElement) {
        return;
    }

    containerElement.innerHTML = "";

    for (const project of projects) {
        const article = document.createElement("article");

        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <p class="project-year">${project.year}</p>
            <img src="${project.image}" alt="${project.title}">
            <p>${project.description}</p>
        `;

        containerElement.appendChild(article);
    }
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

// Step 3: Dynamic navigation
const isLocalhost = location.hostname === "localhost" || location.hostname === "127.0.0.1";
const firstPathSegment = location.pathname.split("/").filter(Boolean)[0];
const BASE_PATH = !isLocalhost && location.hostname.endsWith("github.io")
    ? `/${firstPathSegment}/`
    : "/";
const pages = [
    { url: "",           title: "Home" },
    { url: "projects/",  title: "Projects" },
    { url: "resume/",    title: "Resume" },
    { url: "contact/",   title: "Contact" },
    { url: "meta/",      title: "Meta" },
    { url: "https://github.com/jacobkavanal", title: "GitHub" },
];

const nav = document.createElement("nav");
document.body.prepend(nav);

for (const p of pages) {
    const a = document.createElement("a");
    const isExternal = p.url.startsWith("http");
    a.href = isExternal ? p.url : BASE_PATH + p.url;
    a.textContent = p.title;

    // Step 2: Highlight current page
    if (!isExternal && a.pathname === location.pathname) {
        a.classList.add("current");
    }

    if (isExternal) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
    }

    nav.append(a);
}

// Step 4: Dark mode switcher
document.body.insertAdjacentHTML(
    "beforeend",
    `<label class="color-scheme">
        Theme:
        <select>
            <option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    </label>`
);

const select = document.querySelector(".color-scheme select");

function applyColorScheme(scheme) {
    document.documentElement.style.setProperty("color-scheme", scheme);
    select.value = scheme;
}

if (localStorage.colorScheme) {
    applyColorScheme(localStorage.colorScheme);
}

select.addEventListener("input", (e) => {
    applyColorScheme(e.target.value);
    localStorage.colorScheme = e.target.value;
});

// Step 5: Enhanced contact form
const form = document.querySelector("form");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const params = [];
        for (const [name, value] of data) {
            params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
        }
        location.href = `mailto:jake.kavanal@gmail.com?${params.join("&")}`;
    });
}

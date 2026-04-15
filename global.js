console.log("IT'S ALIVE!");

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Step 3: Dynamic navigation
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/portfolio/";

const pages = [
    { url: "",           title: "Home" },
    { url: "projects/",  title: "Projects" },
    { url: "resume/",    title: "Resume" },
    { url: "contact/",   title: "Contact" },
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

const root = document.documentElement;
const storedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (storedTheme) {
  root.dataset.theme = storedTheme;
} else if (prefersDark) {
  root.dataset.theme = "dark";
}

const themeToggle = document.querySelector(".theme-toggle");
themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("portfolio-theme", nextTheme);
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("[data-nav]");

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const header = document.querySelector("[data-elevate]");
const elevateHeader = () => {
  header?.classList.toggle("is-elevated", window.scrollY > 12);
};
elevateHeader();
window.addEventListener("scroll", elevateHeader, { passive: true });

const formatValue = (element, value) => {
  const prefix = element.dataset.prefix || "";
  const suffix = element.dataset.suffix || "";
  return `${prefix}${Math.round(value).toLocaleString("en-IN")}${suffix}`;
};

const animateCounter = (element) => {
  if (element.dataset.animated === "true") return;

  const target = Number(element.dataset.count);
  if (!Number.isFinite(target)) return;

  element.dataset.animated = "true";
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = formatValue(element, target * eased);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = formatValue(element, target);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCounter);

      if (entry.target.matches("[data-count]")) {
        animateCounter(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal, [data-count]").forEach((element) => {
  observer.observe(element);
});

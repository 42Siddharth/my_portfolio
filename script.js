const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

document.querySelector("#year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-tooltip]").forEach((target) => {
  const card = target.closest(".chart-card");
  const tooltip = card?.querySelector(".chart-tooltip");
  if (!tooltip) return;

  const placeTooltip = (clientX, clientY) => {
    const cardBounds = card.getBoundingClientRect();
    const edgePadding = 26;
    const x = Math.min(Math.max(clientX - cardBounds.left, edgePadding), cardBounds.width - edgePadding);
    const y = Math.max(clientY - cardBounds.top, 58);
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };
  const showTooltip = (event) => {
    tooltip.textContent = target.dataset.tooltip;
    const targetBounds = target.getBoundingClientRect();
    const x = event.clientX || targetBounds.left + targetBounds.width / 2;
    const y = event.clientY || targetBounds.top;
    placeTooltip(x, y);
    tooltip.classList.add("active");
  };
  const hideTooltip = () => {
    tooltip.classList.remove("active");
  };

  target.addEventListener("mouseenter", showTooltip);
  target.addEventListener("mousemove", (event) => placeTooltip(event.clientX, event.clientY));
  target.addEventListener("mouseleave", hideTooltip);
  target.addEventListener("focus", showTooltip);
  target.addEventListener("blur", hideTooltip);
});

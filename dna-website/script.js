// Smooth Fade-Up Animation on Scroll
const fadeElements = document.querySelectorAll(".fade-up");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = "0s";
        entry.target.classList.add("fade-active");
      }
    });
  },
  { threshold: 0.2 }
);

fadeElements.forEach((el) => observer.observe(el));


// Smooth Scroll for links
document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60,
        behavior: "smooth",
      });
    }
  });
});


// Chat Input Button Animation (Fake)
const chatInput = document.querySelector(".chat-input input");
const chatButton = document.querySelector(".chat-input button");

if (chatButton && chatInput) {
  chatButton.addEventListener("click", () => {
    if (chatInput.value.trim() === "") return;

    alert("⚠️ Live AI Chat Abhi Connected Nahi Hai.\n\nJab tum bolo, main real API connect kar dunga!");
    chatInput.value = "";
  });
}


const sections = document.querySelectorAll("[id]");
const navLinks = document.querySelectorAll(".case-progress-nav a");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute("id");
      const activeLink = document.querySelector(`.case-progress-nav a[href="#${id}"]`);

      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove("active"));
        activeLink.classList.add("active");

        navLinks.forEach(link => {
          const sectionTop = document.querySelector(link.getAttribute("href")).offsetTop;
          if (sectionTop <= window.scrollY + 200) {
            link.classList.add("seen");
          } else {
            link.classList.remove("seen");
          }
        });
      }
    });
  },
  {
    root: null,
    threshold: 0.35
  }
);

sections.forEach(section => observer.observe(section));

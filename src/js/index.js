// src/js/index.js
import StoryblokService from "../services/StoryblokService.js";

document.addEventListener("DOMContentLoaded", async function () {
  const pageNumberElement = document.getElementById("page-number");
  const projectTitleElement = document.getElementById("current-project-title");
  const siteTitleElement = document.querySelector(".site-title");
  const currentYearElement = document.querySelector(".current-year");

  pageNumberElement.classList.add("hidden");
  projectTitleElement.classList.add("hidden");
  siteTitleElement.classList.add("hidden");
  currentYearElement.classList.add("hidden");

  const data = await StoryblokService.getData("home");

  if (!data) return;

  document.title = data.name;
  siteTitleElement.textContent = data.content.body[0].site_title;
  currentYearElement.textContent = new Date().getFullYear();

  let page_number = 0;
  let currentProjectTitle = "";

  const contentContainer = document.querySelector(".content-container");
  const gallerySection = document.createElement("section");
  gallerySection.classList.add("gallery");
  contentContainer.appendChild(gallerySection);

  function createTitlePage(text, pageNumber, isFinalPage = false) {
    const titlePage = document.createElement("div");
    titlePage.classList.add("title-page");
    titlePage.dataset.pageNumber = pageNumber;
    if (isFinalPage) titlePage.dataset.finalPage = "true";

    const titleText = document.createElement("div");
    titleText.classList.add("title-text");
    titlePage.appendChild(titleText);

    const sansSerif = document.createElement("span");
    sansSerif.classList.add("title-sans-serif");
    sansSerif.textContent = text[0];
    titleText.appendChild(sansSerif);

    const serif = document.createElement("span");
    serif.classList.add("title-serif");
    serif.textContent = text[1];
    titleText.appendChild(serif);

    return titlePage;
  }

  // Add the initial title page to the gallery section
  gallerySection.appendChild(
    createTitlePage(["CHLOE MAHONY", "Portfolio"], page_number++)
  );

  data.content.body[1].projects.forEach((project) => {
    const projectTitlePage = document.createElement("h2");
    projectTitlePage.classList.add("project-title");
    projectTitlePage.textContent = project.project_title;
    projectTitlePage.dataset.pageNumber = page_number;
    projectTitlePage.dataset.projectTitle = project.project_title;

    const projectPagesSection = document.createElement("section");
    projectPagesSection.classList.add("project-pages");

    let first_page = true;
    project.project_pages.forEach((page) => {
      if (first_page) {
        const titlePage = document.createElement("h2");
        titlePage.classList.add("project-title-page");
        titlePage.dataset.pageNumber = page_number;
        titlePage.dataset.projectTitle = project.project_title;
        titlePage.textContent = project.project_title;
        projectPagesSection.appendChild(titlePage);

        page_number++;
        first_page = false;
      }

      const projectPage = document.createElement("article");
      projectPage.classList.add("project-page");
      projectPage.dataset.pageNumber = page_number;
      projectPage.dataset.projectTitle = project.project_title;

      page.entry.forEach((entry) => {
        if (!entry.text) {
          const imageContainer = document.createElement("div");
          imageContainer.classList.add("image-container");
          const img = document.createElement("img");
          img.src = entry.image.filename;
          img.alt = entry.image.alt;
          imageContainer.appendChild(img);
          projectPage.appendChild(imageContainer);
        } else {
          const imageTextContainer = document.createElement("div");
          imageTextContainer.classList.add("image-text-container");
          const p = document.createElement("p");
          const imageTextTitle = document.createElement("span");
          imageTextTitle.classList.add("image-text-title");
          imageTextTitle.textContent = `${entry.title}:`;
          p.appendChild(imageTextTitle);
          p.appendChild(document.createElement("br"));
          p.appendChild(document.createTextNode(entry.text));
          const img = document.createElement("img");
          img.src = entry.image.filename;
          img.alt = entry.image.alt;
          imageTextContainer.appendChild(p);
          imageTextContainer.appendChild(img);
          projectPage.appendChild(imageTextContainer);
        }
      });

      projectPagesSection.appendChild(projectPage);
      page_number++;
    });

    // Append the project title and pages to the gallery section
    gallerySection.appendChild(projectTitlePage);
    gallerySection.appendChild(projectPagesSection);
  });

  // Add the final title page to the gallery section
  gallerySection.appendChild(
    createTitlePage(
      ["chloemmahony@gmail.com", "0899769880"],
      page_number++,
      true
    )
  );

  const projectPages = document.querySelectorAll(
    ".project-page, .project-title-page, .title-page"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = parseInt(
            entry.target.getAttribute("data-page-number")
          );
          const projectTitle = entry.target.getAttribute("data-project-title");
          const isFinalPage = entry.target.getAttribute("data-final-page");

          if (pageNumber === 0 || isFinalPage) {
            toggleVisibility(false);
          } else if (pageNumber === 1) {
            toggleVisibility(true);

            if (projectTitle !== currentProjectTitle) {
              projectTitleElement.classList.remove("visible");
              projectTitleElement.classList.add("hidden");

              projectTitleElement.textContent = projectTitle;
              projectTitleElement.classList.remove("hidden");
              projectTitleElement.classList.add("visible");

              currentProjectTitle = projectTitle;
            } else {
              projectTitleElement.textContent = projectTitle;
            }
          } else {
            toggleVisibility(true);

            if (projectTitle !== currentProjectTitle) {
              projectTitleElement.classList.remove("visible");
              projectTitleElement.classList.add("hidden");

              setTimeout(() => {
                projectTitleElement.textContent = projectTitle;
                projectTitleElement.classList.remove("hidden");
                projectTitleElement.classList.add("visible");
              }, 300);

              currentProjectTitle = projectTitle;
            } else {
              projectTitleElement.textContent = projectTitle;
            }
          }

          pageNumberElement.textContent =
            pageNumber < 10 ? `0${pageNumber}` : pageNumber;
        }
      });
    },
    { root: null, threshold: 0.3 }
  );

  projectPages.forEach((page) => observer.observe(page));

  function toggleVisibility(visible) {
    const action = visible ? "add" : "remove";
    const reverseAction = visible ? "remove" : "add";

    siteTitleElement.classList[action]("visible");
    projectTitleElement.classList[action]("visible");
    currentYearElement.classList[action]("visible");
    pageNumberElement.classList[action]("visible");

    siteTitleElement.classList[reverseAction]("hidden");
    projectTitleElement.classList[reverseAction]("hidden");
    currentYearElement.classList[reverseAction]("hidden");
    pageNumberElement.classList[reverseAction]("hidden");
  }
});

const gallery = document.getElementById("gallery-container");
const addButton = document.getElementById("add-photo");
const toggleButton = document.getElementById("toggle-gallery");
const themeButton = document.getElementById("toggle-theme");
const gallerySection = document.querySelector("#gallery");

if (!gallery || !addButton || !toggleButton || !themeButton || !gallerySection) {
  console.error("Элемент не найден: проверьте контейнер галереи и кнопки.");
} else {
  function createPhoto(url, caption) {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    if (url) {
      const image = document.createElement("img");
      image.src = url;
      image.alt = caption;
      image.addEventListener("error", function () {
        const placeholder = document.createElement("div");
        placeholder.className = "gallery-placeholder";
        placeholder.setAttribute("role", "img");
        placeholder.setAttribute("aria-label", caption);
        image.replaceWith(placeholder);
      });
      figure.appendChild(image);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "gallery-placeholder";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute("aria-label", caption);
      figure.appendChild(placeholder);
    }

    const title = document.createElement("figcaption");
    title.textContent = caption;
    figure.appendChild(title);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Удалить";
    deleteButton.addEventListener("click", function () {
      figure.remove();
    });
    figure.appendChild(deleteButton);
    return figure;
  }

  addButton.addEventListener("click", function () {
    const url = prompt("Введите URL фотографии или оставьте поле пустым для заглушки.");
    if (url === null) return;

    const caption = prompt("Введите подпись к фотографии.");
    if (caption === null || caption.trim() === "") return;

    const imageUrl = url.trim();
    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      alert("Введите URL, начинающийся с http:// или https://, либо оставьте поле пустым.");
      return;
    }

    gallery.appendChild(createPhoto(imageUrl, caption.trim()));
  });

  toggleButton.addEventListener("click", function () {
    gallery.classList.toggle("hidden");
    toggleButton.textContent = gallery.classList.contains("hidden") ? "Показать галерею" : "Скрыть галерею";
  });

  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("theme-dark");
    document.body.classList.toggle("theme-light");
    const dark = document.body.classList.contains("theme-dark");
    themeButton.textContent = dark ? "Светлая тема" : "Тёмная тема";
  });
}

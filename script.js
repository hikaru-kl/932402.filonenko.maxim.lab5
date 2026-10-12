const gallery = document.getElementById("gallery-container");
const addButton = document.getElementById("add-photo");
const toggleButton = document.getElementById("toggle-gallery");
const themeButton = document.getElementById("toggle-theme");
const gallerySection = document.querySelector("#gallery");

if (!gallery || !addButton || !toggleButton || !themeButton || !gallerySection) {
  console.error("Элемент не найден: проверьте контейнер галереи и кнопки.");
} else {
  function createPhoto(photo) {
    const figure = document.createElement("figure");
    figure.className = "gallery-item";

    if (photo.url) {
      const image = document.createElement("img");
      image.src = photo.url;
      image.alt = photo.caption;
      image.addEventListener("error", function () {
        image.replaceWith(createPlaceholder());
      });
      figure.appendChild(image);
    } else {
      figure.appendChild(createPlaceholder(photo.kind));
    }

    const caption = document.createElement("figcaption");
    caption.textContent = photo.caption;
    figure.appendChild(caption);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Удалить";
    deleteButton.addEventListener("click", function () {
      figure.remove();
      saveGallery();
    });
    figure.appendChild(deleteButton);

    return figure;
  }

  function createPlaceholder(kind) {
    const placeholder = document.createElement("div");
    placeholder.className = "gallery-placeholder";
    if (kind) {
      placeholder.classList.add(kind);
    }
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", "Заглушка фотографии");
    return placeholder;
  }

  function getGalleryData() {
    return Array.from(gallery.querySelectorAll(".gallery-item")).map(function (item) {
      const image = item.querySelector("img");
      const placeholder = item.querySelector(".gallery-placeholder");
      const caption = item.querySelector("figcaption");
      return {
        url: image ? image.src : "",
        caption: caption ? caption.textContent : "",
        kind: placeholder ? Array.from(placeholder.classList).find(function (name) {
          return name.startsWith("gallery-") && name !== "gallery-placeholder";
        }) || "" : ""
      };
    });
  }

  function saveGallery() {
    localStorage.setItem("photoGallery", JSON.stringify(getGalleryData()));
  }

  function loadGallery() {
    const saved = localStorage.getItem("photoGallery");
    if (saved === null) {
      gallery.querySelectorAll(".gallery-item").forEach(function (item) {
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Удалить";
        deleteButton.addEventListener("click", function () {
          item.remove();
          saveGallery();
        });
        item.appendChild(deleteButton);
      });
      saveGallery();
      return;
    }

    try {
      const photos = JSON.parse(saved);
      if (!Array.isArray(photos)) {
        throw new Error("Некорректные данные галереи");
      }
      gallery.replaceChildren();
      photos.forEach(function (photo) {
        if (photo && typeof photo.caption === "string" && typeof photo.url === "string") {
          gallery.appendChild(createPhoto(photo));
        }
      });
    } catch (error) {
      console.error("Не удалось восстановить галерею:", error);
    }
  }

  addButton.addEventListener("click", function () {
    const url = prompt("Введите URL фотографии или оставьте поле пустым для заглушки.");
    if (url === null) {
      return;
    }

    const caption = prompt("Введите подпись к фотографии.");
    if (caption === null || caption.trim() === "") {
      return;
    }

    let imageUrl = url.trim();
    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      alert("Введите URL, начинающийся с http:// или https://, либо оставьте поле пустым.");
      return;
    }

    gallery.appendChild(createPhoto({ url: imageUrl, caption: caption.trim(), kind: "" }));
    saveGallery();
  });

  toggleButton.addEventListener("click", function () {
    gallery.classList.toggle("hidden");
    toggleButton.textContent = gallery.classList.contains("hidden") ? "Показать галерею" : "Скрыть галерею";
    localStorage.setItem("galleryHidden", gallery.classList.contains("hidden"));
  });

  themeButton.addEventListener("click", function () {
    document.body.classList.toggle("theme-dark");
    document.body.classList.toggle("theme-light");
    const dark = document.body.classList.contains("theme-dark");
    themeButton.textContent = dark ? "Светлая тема" : "Тёмная тема";
    localStorage.setItem("photoTheme", dark ? "dark" : "light");
  });

  loadGallery();

  if (localStorage.getItem("photoTheme") === "dark") {
    document.body.classList.remove("theme-light");
    document.body.classList.add("theme-dark");
    themeButton.textContent = "Светлая тема";
  }

  if (localStorage.getItem("galleryHidden") === "true") {
    gallery.classList.add("hidden");
    toggleButton.textContent = "Показать галерею";
  }
}

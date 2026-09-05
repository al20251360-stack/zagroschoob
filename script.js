document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       HERO SLIDER
    ========================= */

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 1) {

        let currentSlide = 0;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        };

        showSlide(0);

        setInterval(nextSlide, 4500);
    }


    /* =========================
       IMAGE LIGHTBOX
    ========================= */

    const images = document.querySelectorAll(
        ".gallery-grid img, .service-image"
    );

    if (!images.length) return;

    let lightbox = null;


    const closeLightbox = () => {

        if (!lightbox) return;

        lightbox.remove();
        lightbox = null;

        document.body.style.overflow = "";
    };


    const openLightbox = (image) => {

        closeLightbox();

        lightbox = document.createElement("div");
        lightbox.className = "image-lightbox";

        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.setAttribute("aria-label", "نمایش بزرگ تصویر");


        const bigImage = document.createElement("img");

        bigImage.src = image.currentSrc || image.src;
        bigImage.alt = image.alt || "تصویر زاگرس چوب کیانشهر";


        const closeButton = document.createElement("button");

        closeButton.type = "button";
        closeButton.className = "lightbox-close";
        closeButton.textContent = "×";
        closeButton.setAttribute("aria-label", "بستن تصویر");


        lightbox.appendChild(bigImage);
        lightbox.appendChild(closeButton);

        document.body.appendChild(lightbox);

        document.body.style.overflow = "hidden";


        closeButton.focus();


        closeButton.addEventListener(
            "click",
            closeLightbox
        );


        lightbox.addEventListener("click", (event) => {

            if (event.target === lightbox) {
                closeLightbox();
            }

        });

    };


    images.forEach((image) => {

        image.addEventListener("click", () => {
            openLightbox(image);
        });

    });


    /* =========================
       ESC KEY
    ========================= */

    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && lightbox) {
            closeLightbox();
        }

    });

});

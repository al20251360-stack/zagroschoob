document.addEventListener("DOMContentLoaded", function () {

    /* ================= اسلایدر ================= */

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 0) {

        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach(function (slide) {
                slide.classList.remove("active");
            });

            slides[index].classList.add("active");
        }

        function nextSlide() {
            currentSlide++;

            if (currentSlide >= slides.length) {
                currentSlide = 0;
            }

            showSlide(currentSlide);
        }

        showSlide(0);

        setInterval(nextSlide, 4000);
    }


    /* ================= بزرگ کردن عکس‌ها ================= */

    const images = document.querySelectorAll(
        ".gallery img, .service-image"
    );

    images.forEach(function (img) {

        img.style.cursor = "zoom-in";

        img.addEventListener("click", function () {

            const overlay = document.createElement("div");
            overlay.className = "image-lightbox";

            const bigImage = document.createElement("img");
            bigImage.src = img.src;
            bigImage.alt = img.alt || "تصویر زاگرس چوب";

            const closeButton = document.createElement("button");
            closeButton.className = "lightbox-close";
            closeButton.innerHTML = "×";
            closeButton.setAttribute("aria-label", "بستن تصویر");

            overlay.appendChild(bigImage);
            overlay.appendChild(closeButton);

            document.body.appendChild(overlay);

            document.body.style.overflow = "hidden";

            /* بستن با × */
            closeButton.addEventListener("click", function (event) {
                event.stopPropagation();
                overlay.remove();
                document.body.style.overflow = "";
            });

            /* بستن با لمس بیرون عکس */
            overlay.addEventListener("click", function (event) {
                if (event.target === overlay) {
                    overlay.remove();
                    document.body.style.overflow = "";
                }
            });

            /* بستن با کلید ESC */
            document.addEventListener("keydown", function escHandler(event) {
                if (event.key === "Escape") {
                    overlay.remove();
                    document.body.style.overflow = "";
                    document.removeEventListener("keydown", escHandler);
                }
            });

        });

    });

});

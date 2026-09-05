document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       اسلایدر
    ========================= */

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 1) {
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle("active", i === index);
            });
        }

        showSlide(0);

        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 4500);
    }


    /* =========================
       پنجره بزرگنمایی
    ========================= */

    let lightbox = null;
    let lightboxOpen = false;

    function createLightbox(content) {

        if (lightbox) {
            lightbox.remove();
        }

        lightbox = document.createElement("div");
        lightbox.className = "image-lightbox";

        lightbox.innerHTML = content;

        document.body.appendChild(lightbox);

        document.body.style.overflow = "hidden";

        lightboxOpen = true;

        history.pushState(
            { preview: true },
            "",
            "#image-preview"
        );

        const closeButton =
            lightbox.querySelector(".lightbox-close");

        if (closeButton) {
            closeButton.addEventListener("click", () => {
                history.back();
            });
        }

        lightbox.addEventListener("click", (event) => {

            if (event.target === lightbox) {
                history.back();
            }

        });
    }


    /* =========================
       بستن پنجره
    ========================= */

    window.addEventListener("popstate", () => {

        if (!lightboxOpen) {
            return;
        }

        if (lightbox) {
            lightbox.remove();
        }

        lightbox = null;

        lightboxOpen = false;

        document.body.style.overflow = "";
    });


    /* =========================
       Escape
    ========================= */

    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            lightboxOpen
        ) {
            history.back();
        }

    });


    /* =========================
       لوگو
    ========================= */

    const logo =
        document.querySelector(".logo-link img");

    if (logo) {

        logo.style.cursor = "zoom-in";

        logo.addEventListener("click", (event) => {

            event.preventDefault();

            event.stopPropagation();

            const src =
                logo.currentSrc ||
                logo.src;

            createLightbox(`
                <img
                    class="lightbox-main-image"
                    src="${src}"
                    alt="زاگرس چوب کیانشهر"
                >

                <div class="lightbox-info">

                    <h3>
                        زاگرس چوب کیانشهر
                    </h3>

                    <p>
                        ZAGROS WOOD
                    </p>

                </div>

                <button
                    class="lightbox-close"
                    type="button"
                >
                    ×
                </button>
            `);

        });
    }


    /* =========================
       محصولات معمولی
    ========================= */

    document
        .querySelectorAll(".service-card")
        .forEach(card => {

            const image =
                card.querySelector(".service-image");

            if (!image) return;

            image.addEventListener("click", event => {

                event.preventDefault();

                event.stopPropagation();

                const src =
                    image.currentSrc ||
                    image.src;

                const title =
                    card.querySelector("h3")?.textContent.trim()
                    || "محصول زاگرس چوب";

                const description =
                    card.querySelector("p")?.textContent.trim()
                    || "زاگرس چوب کیانشهر";

                createLightbox(`
                    <img
                        class="lightbox-main-image"
                        src="${src}"
                        alt="${title}"
                    >

                    <div class="lightbox-info">

                        <h3>
                            ${title}
                        </h3>

                        <p>
                            ${description}
                        </p>

                    </div>

                    <button
                        class="lightbox-close"
                        type="button"
                    >
                        ×
                    </button>
                `);

            });

        });


    /* =========================
       ⭐ محصولات فروشگاه
       بزرگنمایی کل محصول
    ========================= */

    document
        .querySelectorAll(".shop-card")
        .forEach(card => {

            card.style.cursor = "pointer";


            card.addEventListener("click", event => {

                /*
                 * اگر روی دکمه واتساپ یا تماس زدیم،
                 * پنجره بزرگ باز نشود.
                 */

                if (
                    event.target.closest(".shop-btn") ||
                    event.target.closest("a")
                ) {
                    return;
                }


                const image =
                    card.querySelector(".service-image");

                const title =
                    card.querySelector("h3");

                const description =
                    card.querySelector(".shop-description");

                const meta =
                    card.querySelector(".shop-meta");

                const price =
                    card.querySelector(".shop-price");


                if (!image) return;


                const src =
                    image.currentSrc ||
                    image.src;


                const titleText =
                    title
                        ? title.textContent.trim()
                        : "محصول زاگرس چوب";


                const descriptionText =
                    description
                        ? description.textContent.trim()
                        : "";


                const metaHTML =
                    meta
                        ? meta.innerHTML
                        : "";


                const priceHTML =
                    price
                        ? price.innerHTML
                        : "";


                /*
                 * لینک واتساپ محصول
                 */

                const whatsapp =
                    card.querySelector(
                        ".shop-btn.whatsapp"
                    );


                const whatsappHref =
                    whatsapp
                        ? whatsapp.href
                        : "https://wa.me/989129053421";


                /*
                 * لینک تماس
                 */

                const call =
                    card.querySelector(
                        ".shop-btn.call"
                    );


                const callHref =
                    call
                        ? call.href
                        : "tel:02133615748";


                createLightbox(`

                    <div class="product-lightbox">

                        <div class="product-lightbox-image">

                            <img
                                src="${src}"
                                alt="${titleText}"
                            >

                        </div>


                        <div class="product-lightbox-content">

                            <h2>
                                ${titleText}
                            </h2>


                            <p class="product-lightbox-description">
                                ${descriptionText}
                            </p>


                            <div class="product-lightbox-meta">
                                ${metaHTML}
                            </div>


                            <div class="product-lightbox-price">
                                ${priceHTML}
                            </div>


                            <div class="product-lightbox-buttons">

                                <a
                                    href="${whatsappHref}"
                                    target="_blank"
                                    rel="noopener"
                                    class="product-big-btn whatsapp"
                                >
                                    💬 استعلام واتساپ
                                </a>


                                <a
                                    href="${callHref}"
                                    class="product-big-btn call"
                                >
                                    📞 تماس
                                </a>

                            </div>

                        </div>

                    </div>


                    <button
                        class="lightbox-close"
                        type="button"
                        aria-label="بستن"
                    >
                        ×
                    </button>

                `);

            });

        });


    /* =========================
       گالری
    ========================= */

    const gallery =
        document.querySelector(".gallery-grid");

    if (!gallery) return;


    const githubAPI =
        "https://api.github.com/repos/al20251360-stack/zagroschoob/contents/images";


    const excludedFiles = [
        "logo.png"
    ];


    const extensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];


    fetch(githubAPI)

        .then(response => {

            if (!response.ok) {
                throw new Error("GitHub API error");
            }

            return response.json();

        })

        .then(files => {

            let images =
                files.filter(file => {

                    if (file.type !== "file") {
                        return false;
                    }

                    if (
                        excludedFiles.includes(
                            file.name
                        )
                    ) {
                        return false;
                    }

                    const name =
                        file.name.toLowerCase();

                    return extensions.some(
                        extension =>
                            name.endsWith(extension)
                    );

                });


            /* حذف عکس‌های تکراری JPG/WebP */

            const webpNames =
                new Set(

                    images

                        .filter(file =>
                            file.name
                                .toLowerCase()
                                .endsWith(".webp")
                        )

                        .map(file =>
                            file.name
                                .toLowerCase()
                                .replace(".webp", "")
                        )

                );


            images =
                images.filter(file => {

                    const name =
                        file.name.toLowerCase();


                    if (
                        name.endsWith(".jpg") ||
                        name.endsWith(".jpeg")
                    ) {

                        const baseName =
                            name.replace(
                                /\.(jpg|jpeg)$/,
                                ""
                            );


                        if (
                            webpNames.has(
                                baseName
                            )
                        ) {
                            return false;
                        }

                    }

                    return true;

                });


            images.sort((a, b) =>
                a.name.localeCompare(
                    b.name,
                    "fa",
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                )
            );


            gallery.innerHTML = "";


            images.forEach((file, index) => {

                const picture =
                    document.createElement(
                        "picture"
                    );


                const image =
                    document.createElement(
                        "img"
                    );


                image.src =
                    file.download_url;


                image.alt =
                    "زاگرس چوب کیانشهر - نمونه کار " +
                    (index + 1);


                image.loading =
                    "lazy";


                image.decoding =
                    "async";


                image.className =
                    "gallery-image";


                picture.appendChild(image);

                gallery.appendChild(picture);


                image.addEventListener(
                    "click",
                    () => {

                        createLightbox(`

                            <img
                                class="lightbox-main-image"
                                src="${image.currentSrc || image.src}"
                                alt="${image.alt}"
                            >

                            <div class="lightbox-info">

                                <h3>
                                    زاگرس چوب کیانشهر
                                </h3>

                                <p>
                                    ZAGROS WOOD | نمونه کار و محصولات
                                </p>

                            </div>

                            <button
                                class="lightbox-close"
                                type="button"
                            >
                                ×
                            </button>

                        `);

                    }
                );

            });


            console.log(
                "تعداد تصاویر گالری:",
                images.length
            );


            if (images.length === 0) {

                gallery.innerHTML =
                    "<p class='gallery-error'>تصویری برای نمایش پیدا نشد.</p>";

            }

        })

        .catch(error => {

            console.error(
                "خطا:",
                error
            );

            gallery.innerHTML =
                "<p class='gallery-error'>در بارگذاری تصاویر مشکلی پیش آمد.</p>";

        });

});

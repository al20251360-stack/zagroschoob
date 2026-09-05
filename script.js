document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       اسلایدر
    ========================================= */

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


    /* =========================================
       بزرگنمایی تصاویر
    ========================================= */

    let lightbox = null;
    let lightboxOpen = false;
    let ignoreNextPopState = false;


    function closeLightbox() {

        if (!lightbox) return;

        lightbox.remove();
        lightbox = null;
        lightboxOpen = false;

        document.body.style.overflow = "";

        if (
            window.location.hash === "#image-preview"
        ) {
            ignoreNextPopState = true;
            history.back();
        }
    }


    function openLightbox(image, title, description) {

        if (lightbox) {
            lightbox.remove();
            lightbox = null;
        }

        lightboxOpen = true;

        /* پنجره */

        lightbox = document.createElement("div");

        lightbox.className =
            "image-lightbox";


        /* عکس بزرگ */

        const bigImage =
            document.createElement("img");

        bigImage.src =
            image.currentSrc ||
            image.src;

        bigImage.alt =
            image.alt ||
            title ||
            "زاگرس چوب کیانشهر";

        bigImage.className =
            "lightbox-main-image";


        /* اطلاعات محصول */

        const info =
            document.createElement("div");

        info.className =
            "lightbox-info";


        if (title) {

            const titleElement =
                document.createElement("h3");

            titleElement.textContent =
                title;

            info.appendChild(
                titleElement
            );
        }


        if (description) {

            const descriptionElement =
                document.createElement("p");

            descriptionElement.textContent =
                description;

            info.appendChild(
                descriptionElement
            );
        }


        /* دکمه بستن */

        const closeButton =
            document.createElement("button");

        closeButton.type = "button";

        closeButton.className =
            "lightbox-close";

        closeButton.textContent = "×";

        closeButton.setAttribute(
            "aria-label",
            "بستن تصویر"
        );


        /* اضافه کردن عناصر */

        lightbox.appendChild(
            bigImage
        );

        if (title || description) {
            lightbox.appendChild(info);
        }

        lightbox.appendChild(
            closeButton
        );


        document.body.appendChild(
            lightbox
        );


        document.body.style.overflow =
            "hidden";


        /* برای دکمه برگشت گوشی */

        history.pushState(
            {
                imagePreview: true
            },
            "",
            "#image-preview"
        );


        /* دکمه × */

        closeButton.addEventListener(
            "click",
            () => {
                history.back();
            }
        );


        /* لمس فضای مشکی */

        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === lightbox
                ) {
                    history.back();
                }

            }
        );
    }


    /* =========================================
       دکمه Back گوشی
    ========================================= */

    window.addEventListener(
        "popstate",
        () => {

            if (ignoreNextPopState) {
                ignoreNextPopState = false;
                return;
            }

            if (lightboxOpen) {

                if (lightbox) {
                    lightbox.remove();
                }

                lightbox = null;
                lightboxOpen = false;

                document.body.style.overflow = "";
            }
        }
    );


    /* =========================================
       کلید Escape
    ========================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                lightboxOpen
            ) {
                history.back();
            }

        }
    );


    /* =========================================
       لوگوی سایت
    ========================================= */

    const logo =
        document.querySelector(
            ".logo-link img"
        );


    if (logo) {

        logo.style.cursor =
            "zoom-in";


        logo.addEventListener(
            "click",
            (event) => {

                event.preventDefault();
                event.stopPropagation();

                openLightbox(
                    logo,
                    "زاگرس چوب کیانشهر",
                    "ZAGROS WOOD"
                );

            }
        );
    }


    /* =========================================
       خدمات و محصولات
    ========================================= */

    const serviceCards =
        document.querySelectorAll(
            ".service-card"
        );


    serviceCards.forEach(
        (card) => {

            const image =
                card.querySelector(
                    ".service-image"
                );


            const title =
                card.querySelector(
                    "h3"
                );


            const description =
                card.querySelector(
                    "p"
                );


            if (!image) return;


            image.style.cursor =
                "zoom-in";


            image.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();


                    openLightbox(
                        image,
                        title
                            ? title.textContent.trim()
                            : "زاگرس چوب کیانشهر",
                        description
                            ? description.textContent.trim()
                            : "ZAGROS WOOD"
                    );

                }
            );

        }
    );


    /* =========================================
       گالری
    ========================================= */

    const gallery =
        document.querySelector(
            ".gallery-grid"
        );


    if (!gallery) return;


    const githubAPI =
        "https://api.github.com/repos/al20251360-stack/zagroschoob/contents/images";


    /* لوگو وارد گالری نشود */

    const excludedFiles = [
        "logo.png"
    ];


    /* فرمت‌های تصویری */

    const extensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];


    fetch(githubAPI)

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "GitHub API error"
                );
            }

            return response.json();
        })


        .then(files => {


            /* فقط تصاویر */

            let images =
                files.filter(file => {

                    if (
                        file.type !== "file"
                    ) {
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
                            name.endsWith(
                                extension
                            )
                    );

                });


            /* =================================
               حذف JPG در صورت وجود WebP
            ================================= */

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
                                .replace(
                                    ".webp",
                                    ""
                                )
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


            /* مرتب‌سازی */

            images.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name,
                        "fa",
                        {
                            numeric: true,
                            sensitivity: "base"
                        }
                    )
            );


            /* پاک کردن گالری */

            gallery.innerHTML = "";


            /* =================================
               ساخت تصاویر گالری
            ================================= */

            images.forEach(
                (file, index) => {

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


                    picture.appendChild(
                        image
                    );


                    gallery.appendChild(
                        picture
                    );


                    /* بزرگنمایی گالری */

                    image.addEventListener(
                        "click",
                        () => {

                            openLightbox(
                                image,
                                "زاگرس چوب کیانشهر",
                                "ZAGROS WOOD | نمونه کار و محصولات"
                            );

                        }
                    );

                });


            console.log(
                "تعداد تصاویر گالری:",
                images.length
            );


            if (
                images.length === 0
            ) {

                gallery.innerHTML =
                    "<p class='gallery-error'>تصویری برای نمایش پیدا نشد.</p>";

            }

        })


        .catch(error => {

            console.error(
                "خطا در دریافت تصاویر:",
                error
            );


            gallery.innerHTML =
                "<p class='gallery-error'>در بارگذاری تصاویر مشکلی پیش آمد.</p>";

        });

});

document.addEventListener("DOMContentLoaded", () => {

    /* ==============================
       اسلایدر
    ============================== */

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


    /* ==============================
       بزرگ‌نمایی عکس
    ============================== */

    let lightbox = null;


    function closeLightbox() {

        if (!lightbox) return;

        lightbox.remove();
        lightbox = null;

        document.body.style.overflow = "";

        history.replaceState(
            null,
            "",
            window.location.href
                .replace("#image-preview", "")
        );
    }


    function openLightbox(image, title = "", description = "") {

        closeLightbox();


        lightbox = document.createElement("div");

        lightbox.className = "image-lightbox";


        /* تصویر بزرگ */

        const bigImage =
            document.createElement("img");

        bigImage.src =
            image.currentSrc || image.src;

        bigImage.alt =
            image.alt || "زاگرس چوب کیانشهر";


        /* اطلاعات عکس */

        const info =
            document.createElement("div");

        info.className = "lightbox-info";


        if (title) {

            const titleElement =
                document.createElement("h3");

            titleElement.textContent = title;

            info.appendChild(titleElement);
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


        /* ساخت پنجره */

        lightbox.appendChild(bigImage);

        if (title || description) {
            lightbox.appendChild(info);
        }

        lightbox.appendChild(closeButton);

        document.body.appendChild(lightbox);


        /* جلوگیری از اسکرول صفحه */

        document.body.style.overflow = "hidden";


        /* تغییر آدرس برای دکمه Back گوشی */

        history.pushState(
            { imagePreview: true },
            "",
            "#image-preview"
        );


        /* بستن */

        closeButton.addEventListener(
            "click",
            () => {

                if (
                    window.location.hash ===
                    "#image-preview"
                ) {

                    history.back();

                } else {

                    closeLightbox();

                }
            }
        );


        /* لمس قسمت مشکی */

        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === lightbox
                ) {

                    if (
                        window.location.hash ===
                        "#image-preview"
                    ) {

                        history.back();

                    } else {

                        closeLightbox();

                    }
                }
            }
        );
    }


    /* ==============================
       دکمه Back گوشی
    ============================== */

    window.addEventListener(
        "popstate",
        () => {

            if (lightbox) {
                closeLightbox();
            }

        }
    );


    /* ==============================
       ESC
    ============================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                lightbox
            ) {

                closeLightbox();

            }
        }
    );


    /* ==============================
       بزرگ کردن لوگو
    ============================== */

    const logo =
        document.querySelector(
            ".logo-link img"
        );


    if (logo) {

        logo.style.cursor = "zoom-in";

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


    /* ==============================
       گالری
    ============================== */

    const gallery =
        document.querySelector(
            ".gallery-grid"
        );


    if (!gallery) return;


    const githubAPI =
        "https://api.github.com/repos/al20251360-stack/zagroschoob/contents/images";


    /* لوگو داخل گالری نباشد */

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
                throw new Error(
                    "خطا در دریافت تصاویر"
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
                        ext =>
                            name.endsWith(ext)
                    );
                });


            /* ==============================
               حذف JPG در صورت وجود WebP
            ============================== */

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


            /* ==============================
               ایجاد تصاویر
            ============================== */

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


                    /* کلیک روی عکس */

                    image.addEventListener(
                        "click",
                        () => {

                            openLightbox(
                                image,
                                "زاگرس چوب کیانشهر",
                                "ZAGROS WOOD"
                            );

                        }
                    );

                });


            /* تعداد عکس */

            console.log(
                "تعداد تصاویر گالری:",
                images.length
            );


            /* هیچ عکس */

            if (
                images.length === 0
            ) {

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

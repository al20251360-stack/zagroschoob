document.addEventListener("DOMContentLoaded", () => {

    /* ================================
       اسلایدر صفحه اصلی
    ================================= */

    const slides = document.querySelectorAll(".slide");

    if (slides.length > 1) {

        let currentSlide = 0;

        function showSlide(index) {

            slides.forEach((slide, i) => {
                slide.classList.toggle(
                    "active",
                    i === index
                );
            });
        }

        showSlide(0);

        setInterval(() => {

            currentSlide =
                (currentSlide + 1) % slides.length;

            showSlide(currentSlide);

        }, 4500);
    }


    /* ================================
       سیستم بزرگ‌نمایی تصاویر
    ================================= */

    let lightbox = null;


    function closeLightbox() {

        if (!lightbox) {
            return;
        }

        lightbox.remove();

        lightbox = null;

        document.body.style.overflow = "";
    }


    function openLightbox(image) {

        closeLightbox();


        /* ساخت پنجره */

        lightbox =
            document.createElement("div");

        lightbox.className =
            "image-lightbox";


        lightbox.setAttribute(
            "role",
            "dialog"
        );

        lightbox.setAttribute(
            "aria-modal",
            "true"
        );


        /* تصویر بزرگ */

        const bigImage =
            document.createElement("img");


        bigImage.src =
            image.currentSrc ||
            image.src;


        bigImage.alt =
            image.alt ||
            "زاگرس چوب کیانشهر";


        /* دکمه بستن */

        const closeButton =
            document.createElement("button");


        closeButton.type =
            "button";


        closeButton.className =
            "lightbox-close";


        closeButton.textContent =
            "×";


        closeButton.setAttribute(
            "aria-label",
            "بستن تصویر"
        );


        /* اضافه کردن */

        lightbox.appendChild(
            bigImage
        );

        lightbox.appendChild(
            closeButton
        );


        document.body.appendChild(
            lightbox
        );


        document.body.style.overflow =
            "hidden";


        /* بستن با دکمه */

        closeButton.addEventListener(
            "click",
            closeLightbox
        );


        /* بستن با لمس قسمت مشکی */

        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === lightbox
                ) {

                    closeLightbox();

                }

            }
        );


        /* فوکوس روی دکمه */

        setTimeout(() => {

            closeButton.focus();

        }, 50);
    }


    /* ================================
       بزرگ کردن لوگوی سایت
    ================================= */

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

                /* جلوگیری از رفتن به ابتدای صفحه */

                event.preventDefault();

                event.stopPropagation();


                openLightbox(logo);

            }
        );
    }


    /* ================================
       گالری تصاویر
       دریافت تمام تصاویر از GitHub
    ================================= */

    const gallery =
        document.querySelector(
            ".gallery-grid"
        );


    if (gallery) {


        const githubAPI =
            "https://api.github.com/repos/al20251360-stack/zagroschoob/contents/images";


        /* لوگو نباید وارد گالری شود */

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
                        "GitHub API Error"
                    );

                }

                return response.json();

            })


            .then(files => {


                /* انتخاب تصاویر */

                let images =
                    files.filter(file => {

                        if (
                            file.type !==
                            "file"
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


                /* =========================
                   حذف JPG تکراری
                   اگر WebP آن وجود دارد
                ========================= */

                const webpFiles =
                    new Set(

                        images

                            .filter(file =>
                                file.name
                                    .toLowerCase()
                                    .endsWith(
                                        ".webp"
                                    )
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

                            const base =
                                name.replace(
                                    /\.(jpg|jpeg)$/,
                                    ""
                                );


                            if (
                                webpFiles.has(base)
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
                                sensitivity:
                                    "base"
                            }
                        )
                );


                /* پاک کردن گالری */

                gallery.innerHTML = "";


                /* =========================
                   ساخت کارت تصاویر
                ========================= */

                images.forEach(file => {


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
                        "نمونه کار زاگرس چوب کیانشهر";


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


                    /* بزرگ کردن */

                    image.addEventListener(
                        "click",
                        () => {

                            openLightbox(
                                image
                            );

                        }
                    );

                });


                /* اگر هیچ تصویری نبود */

                if (
                    images.length === 0
                ) {

                    gallery.innerHTML =
                        "<p style='text-align:center;'>تصویری برای نمایش پیدا نشد.</p>";

                }

            })


            .catch(error => {

                console.error(
                    "خطا در دریافت تصاویر:",
                    error
                );


                gallery.innerHTML =
                    "<p style='text-align:center;'>در بارگذاری تصاویر مشکلی پیش آمد.</p>";

            });

    }


    /* ================================
       بستن با کلید Escape
    ================================= */

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

});

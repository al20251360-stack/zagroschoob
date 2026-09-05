document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       اسلایدر صفحه اصلی
    ========================== */

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
       گالری خودکار GitHub
    ========================== */

    const galleryGrid = document.querySelector(".gallery-grid");

    if (!galleryGrid) return;


    /*
      آدرس مخزن GitHub
    */

    const githubApi =
        "https://api.github.com/repos/al20251360-stack/zagroschoob/contents/images";


    /*
      فایل‌هایی که نباید در گالری نمایش داده شوند
    */

    const excludedFiles = [
        "logo.png"
    ];


    /*
      فرمت‌های مجاز عکس
    */

    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];


    /*
      دریافت عکس‌های پوشه images
    */

    fetch(githubApi)

        .then(response => {

            if (!response.ok) {
                throw new Error("GitHub API error");
            }

            return response.json();

        })

        .then(files => {

            /*
              فقط فایل‌های تصویری
            */

            let imageFiles = files.filter(file => {

                if (file.type !== "file") {
                    return false;
                }

                if (excludedFiles.includes(file.name)) {
                    return false;
                }

                const lowerName = file.name.toLowerCase();

                return allowedExtensions.some(extension =>
                    lowerName.endsWith(extension)
                );

            });


            /*
              جلوگیری از نمایش همزمان JPG و WebP
              اگر نسخه WebP وجود داشته باشد،
              JPG مربوط به همان عکس نمایش داده نمی‌شود.
            */

            const webpNames = new Set(
                imageFiles
                    .filter(file =>
                        file.name.toLowerCase().endsWith(".webp")
                    )
                    .map(file =>
                        file.name
                            .toLowerCase()
                            .replace(".webp", "")
                    )
            );


            imageFiles = imageFiles.filter(file => {

                const lowerName = file.name.toLowerCase();

                if (
                    lowerName.endsWith(".jpg") ||
                    lowerName.endsWith(".jpeg")
                ) {

                    const baseName = lowerName
                        .replace(/\.(jpg|jpeg)$/, "");

                    if (webpNames.has(baseName)) {
                        return false;
                    }
                }

                return true;
            });


            /*
              مرتب‌سازی بر اساس نام فایل
            */

            imageFiles.sort((a, b) =>
                a.name.localeCompare(
                    b.name,
                    "fa",
                    {
                        numeric: true,
                        sensitivity: "base"
                    }
                )
            );


            /*
              ساخت گالری
            */

            galleryGrid.innerHTML = "";


            imageFiles.forEach(file => {

                const picture = document.createElement("picture");

                const img = document.createElement("img");

                img.src = file.download_url;

                img.alt =
                    "نمونه کار و محصولات زاگرس چوب کیانشهر";

                img.loading = "lazy";

                img.decoding = "async";

                img.className = "gallery-image";


                picture.appendChild(img);

                galleryGrid.appendChild(picture);


                /*
                  بزرگ‌نمایی عکس
                */

                img.addEventListener("click", () => {
                    openLightbox(img);
                });

            });


            /*
              اگر هیچ تصویری پیدا نشد
            */

            if (imageFiles.length === 0) {

                galleryGrid.innerHTML =
                    "<p style='text-align:center;'>تصویری برای نمایش پیدا نشد.</p>";

            }

        })

        .catch(error => {

            console.error(
                "خطا در دریافت تصاویر:",
                error
            );

        });


    /* =========================
       بزرگ‌نمایی تصاویر
    ========================== */

    let lightbox = null;


    const closeLightbox = () => {

        if (!lightbox) {
            return;
        }

        lightbox.remove();

        lightbox = null;

        document.body.style.overflow = "";

    };


    const openLightbox = (image) => {

        closeLightbox();


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

        lightbox.setAttribute(
            "aria-label",
            "نمایش بزرگ تصویر"
        );


        const bigImage =
            document.createElement("img");


        bigImage.src =
            image.currentSrc ||
            image.src;


        bigImage.alt =
            image.alt ||
            "تصویر زاگرس چوب کیانشهر";


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


        lightbox.appendChild(bigImage);

        lightbox.appendChild(closeButton);

        document.body.appendChild(lightbox);


        document.body.style.overflow =
            "hidden";


        closeButton.focus();


        closeButton.addEventListener(
            "click",
            closeLightbox
        );


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

    };


    /* =========================
       بستن با دکمه Escape
    ========================== */

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

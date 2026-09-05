// ===== اسلایدر صفحه اصلی =====

document.addEventListener("DOMContentLoaded", function () {

    const slides = document.querySelectorAll(".slide");

    if (slides.length === 0) {
        return;
    }

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

});

let animationPagination;

new Swiper('.slider',{
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
    },
    loop: true,

    autoplay: {
        delay: 10000,
        disableOnInteraction: false,
    },

    pagination: {
        el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<div class="loadSlide">' +
                '<div class="background"></div>' +
                '<div class="rotate"></div>' +
                '<div class="left"></div>' +
                '<div class="right"></div>' +
                '<div><span class="'+ className +'"></span></div>' +
                '</div>'
          }
    },

    on: {
        autoplayStart: AnimationLoadPagination,
        slideChange: AnimationLoadPagination
    }
})

function AnimationLoadPagination() {
    let parentPagination = document.querySelector('.swiper-pagination-bullet-active');
    if(parentPagination == null) return;
    let loadSlide = parentPagination.parentNode.parentNode;
    let rotate = loadSlide.querySelector('.rotate');
    let left = loadSlide.querySelector('.left');
    let right = loadSlide.querySelector('.right');
    if(animationPagination != null) animationPagination.stopAnimation();
    animationPagination = new animate({
        duration: 10000,
        draw: function(progress) {
            if(progress == 1) progress = 0;
            let isActiveRight = progress > 0.5;
            rotate.style.transform = 'rotate(' + progress * 360 + 'deg)';
            right.style.opacity = isActiveRight ? 0 : 1;
            left.style.opacity = isActiveRight ? 1 : 0;
        }
    });
}
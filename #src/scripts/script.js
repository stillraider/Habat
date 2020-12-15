@@include('slider.js')
@@include('animate.js')
@@include('dynamicAdapt.js')
@@include('testWebP.js')

let productContents = document.querySelectorAll('.product-info__content');
let indexCurrentProduct = 0;

switchContent();
autoClickOnButtons();
initButtonDisclosure();
resizeProduct();
headerMenuMobile();

function switchContent() {
    let productItems = document.querySelectorAll('.product-info__tabs_item');
    let currentItem = document.querySelector('.isActiveTabs');
    let currentContent = document.querySelector('.isActiveContentProduct');
    
    for (let i = 0; i < productItems.length; i++) {
        productItems[i].addEventListener('click', function () {
            indexCurrentProduct = i;
            currentItem.classList.remove('isActiveTabs');
            currentItem = productItems[i];
            currentItem.classList.add('isActiveTabs');

            currentContent.classList.remove('isActiveContentProduct');
            currentContent = productContents[i];
            currentContent.classList.add('isActiveContentProduct');
        })
    }  
}

function autoClickOnButtons() {
    let sliderContentLrapLink = document.querySelectorAll('.slider__content_wrap-link, .header__request, .swiper-button-prev, .swiper-button-next, .drop-menu__box-link');

    for (let i = 0; i < sliderContentLrapLink.length; i++) {
        sliderContentLrapLink[i].addEventListener('click', function () {
            let visibleClick = this.querySelector('.visible-click');

            visibleClick.style.animation = '';
            void visibleClick.offsetHeight;
            visibleClick.style.animation = 'visible-click .7s ease-in-out';
        }); 
    }
}

function initButtonDisclosure() {
    let buttonProducts = document.querySelectorAll('.product__box');
    let product;

    resetStylesProduct();

    function resetStylesProduct() {
        window.addEventListener("resize", function () {
            if (window.innerWidth >= 710) {
                let products = document.querySelectorAll('.product');
                product = null;

                for (let i = 0; i < products.length; i++) {
                    products[i].removeAttribute('style');   
                    products[i].querySelector('.product__box_arrow').removeAttribute('style');  
                }
            } 
        });
    }

    for (let i = 0; i < buttonProducts.length; i++) {
        buttonProducts[i].addEventListener('click', visibleProduct);
    }

    function visibleProduct() {
        if (window.innerWidth <= 710) {
            if (product != null) {
                product.querySelector('.product__box_arrow').style.transform = 'rotate(0deg)';
                product.style.height = product.querySelector('.product__box').offsetHeight + 'px';
                if (product == this.parentNode) {
                    product = null;
                    return;
                }
            }
            product = this.parentNode;
            this.querySelector('.product__box_arrow').style.transform = 'rotate(180deg)';
            let productBoxHeight = this.offsetHeight;
            let productListHeight = product.querySelector('.product__list').offsetHeight;
    
            product.style.height = productBoxHeight +  productListHeight  + 'px';
        }
    }
}

function resizeProduct() {
    window.addEventListener("resize", showProducts);
    showProducts();

    function showProducts() {
        if (window.innerWidth <= 500) {
            for (let i = 0; i < productContents.length; i++) {
                productContents[i].classList.add('isActiveContentProduct');
            }
        }
        else {
            for (let i = 0; i < productContents.length; i++) {
                productContents[i].classList.remove('isActiveContentProduct');
            }
            productContents[indexCurrentProduct].classList.add('isActiveContentProduct');
        }
    }
}

function headerMenuMobile() {
    let headerBurger = document.querySelector('.header__burger');
    let headerMenu = document.querySelector('.header-menu');

    headerBurger.addEventListener('click', function () {
        headerBurger.classList.toggle('burger-active');
        headerMenu.classList.toggle('openHeaderMenu');
        document.querySelector('body').classList.toggle('bodyEditScroll');
    })
}
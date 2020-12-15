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
function animate({duration, draw}) {
  this.isStopAnim = false;
  let that = this;

  let start = performance.now();

  this.stopAnimation = function() {
      that.isStopAnim = true;
  }

  requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      timeFraction = Math.min(1, timeFraction);

      if(that.isStopAnim)
          timeFraction = 1;

      draw(timeFraction);

      if (timeFraction < 1) {
          requestAnimationFrame(animate);
      }
  });
}
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),position(digi),when(breakpoint)"
// e.x. data-da="item,2,992"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

(function () {
	let originalPositions = [];
	let daElements = document.querySelectorAll('[data-da]');
	let daElementsArray = [];
	let daMatchMedia = [];
	//Заполняем массивы
	if (daElements.length > 0) {
		let number = 0;
		for (let index = 0; index < daElements.length; index++) {
			const daElement = daElements[index];
			const daMove = daElement.getAttribute('data-da');
			if (daMove != '') {
				const daArray = daMove.split(',');
				const daPlace = daArray[1] ? daArray[1].trim() : 'last';
				const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
				const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
				const daDestination = document.querySelector('.' + daArray[0].trim())
				if (daArray.length > 0 && daDestination) {
					daElement.setAttribute('data-da-index', number);
					//Заполняем массив первоначальных позиций
					originalPositions[number] = {
						"parent": daElement.parentNode,
						"index": indexInParent(daElement)
					};
					//Заполняем массив элементов
					daElementsArray[number] = {
						"element": daElement,
						"destination": document.querySelector('.' + daArray[0].trim()),
						"place": daPlace,
						"breakpoint": daBreakpoint,
						"type": daType
					}
					number++;
				}
			}
		}
		dynamicAdaptSort(daElementsArray);

		//Создаем события в точке брейкпоинта
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daBreakpoint = el.breakpoint;
			const daType = el.type;

			daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
			daMatchMedia[index].addListener(dynamicAdapt);
		}
	}
	//Основная функция
	function dynamicAdapt(e) {
		for (let index = 0; index < daElementsArray.length; index++) {
			const el = daElementsArray[index];
			const daElement = el.element;
			const daDestination = el.destination;
			const daPlace = el.place;
			const daBreakpoint = el.breakpoint;
			const daClassname = "_dynamic_adapt_" + daBreakpoint;

			if (daMatchMedia[index].matches) {
				//Перебрасываем элементы
				if (!daElement.classList.contains(daClassname)) {
					let actualIndex = indexOfElements(daDestination)[daPlace];
					if (daPlace === 'first') {
						actualIndex = indexOfElements(daDestination)[0];
					} else if (daPlace === 'last') {
						actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
					}
					daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
					daElement.classList.add(daClassname);
				}
			} else {
				//Возвращаем на место
				if (daElement.classList.contains(daClassname)) {
					dynamicAdaptBack(daElement);
					daElement.classList.remove(daClassname);
				}
			}
		}
		customAdapt();
	}

	//Вызов основной функции
	dynamicAdapt();

	//Функция возврата на место
	function dynamicAdaptBack(el) {
		const daIndex = el.getAttribute('data-da-index');
		const originalPlace = originalPositions[daIndex];
		const parentPlace = originalPlace['parent'];
		const indexPlace = originalPlace['index'];
		const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
		parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
	}
	//Функция получения индекса внутри родителя
	function indexInParent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	//Функция получения массива индексов элементов внутри родителя
	function indexOfElements(parent, back) {
		const children = parent.children;
		const childrenArray = [];
		for (let i = 0; i < children.length; i++) {
			const childrenElement = children[i];
			if (back) {
				childrenArray.push(i);
			} else {
				//Исключая перенесенный элемент
				if (childrenElement.getAttribute('data-da') == null) {
					childrenArray.push(i);
				}
			}
		}
		return childrenArray;
	}
	//Сортировка объекта
	function dynamicAdaptSort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	//Дополнительные сценарии адаптации
	function customAdapt() {
		//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
}());
function testWebP(callback) {
    var webP = new Image();
    webP.onload = webP.onerror = function () {
        callback(webP.height == 2);
    };
    webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {
    if (support == true) {
        document.querySelector('body').classList.add('webp');
    }
});

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
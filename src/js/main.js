// Application Scripts:

//add js class to html tag
//show / hide mobile menu
//show / hide header
//tabs

(function () {
    //
    //add js class to html tag
    //---------------------------------------------------
    var html = document.getElementsByTagName('html')[0];
    removeClass(html, 'no-js');
    addClass(html, 'js');

    //
    //show / hide mobile menu
    //---------------------------------------------------
    (function () {
        var menu_btn = document.getElementsByClassName('js-menu-toggle')[0],
            icon = menu_btn.children[0],
            menu = document.getElementsByClassName('js-menu')[0],
            activeClass = 'active',
            iconMenuClass = 'icon-menu',
            iconCloseClass = 'icon-close',
            overlayClass = 'page__overlay',
            overlayId = 'overlay',
            method = {};

        method.activeClass = 'active';
        method.iconMenuClass = 'icon-menu';
        method.iconCloseClass = 'icon-close';
        method.overlayClass = 'page__overlay';
        method.overlayID = 'overlay';

        method.checkMenuState = function () {
            if (hasClass(menu_btn, activeClass)) {
                method.hideMenu();
            } else {
                method.showMenu();
            }
        };

        method.showMenu = function () {
            addClass(menu_btn, activeClass);
            addClass(menu, activeClass);
            removeClass(icon, iconMenuClass);
            addClass(icon, iconCloseClass);
            method.addOverlay();
        };

        method.hideMenu = function () {
            removeClass(menu_btn, activeClass);
            removeClass(menu, activeClass);
            removeClass(icon, iconCloseClass);
            addClass(icon, iconMenuClass);
            method.removeOverlay();
        };

        method.addOverlay = function () {
            var overlay = document.createElement('div');
            overlay.className = method.overlayClass;
            overlay.setAttribute('id', overlayId);
            document.body.appendChild(overlay);
            overlay.addEventListener('click', method.hideMenu);
        };

        method.removeOverlay = function () {
            var overlay = document.getElementById(overlayId);
            overlay.removeEventListener('click', method.hideMenu);
            overlay.parentElement.removeChild(overlay);
        };

        menu_btn.addEventListener('click', method.checkMenuState);
    })();

    //
    //show / hide header
    //---------------------------------------------------
    (function () {
        var header = document.getElementsByClassName('js-header')[0],
            isHeaderFixed = false,//flag state #1
            isHeaderVisible = true,//flag state #2
            headerOffset = 75,
            scrollOffset = 350,
            headerFixedClass = 'scrolled',
            headerInVisibleClass = 'invisible'; //we need 2 state for smooth header animation

        var raf = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            window.oRequestAnimationFrame;

        var _window = window,
            lastScrollTop = _window.pageYOffset;

        if (raf) {
            loop();
        };

        function checkHeaderOffset(fromTop) {
            if (isHeaderVisible && fromTop >= headerOffset  && fromTop < scrollOffset) {
                isHeaderVisible = false;
                addClass(header, headerInVisibleClass);
            };
            if (!isHeaderFixed && fromTop >= scrollOffset) {
                isHeaderFixed = true;
                isHeaderVisible = false;
                addClass(header, headerFixedClass);
                removeClass(header, headerInVisibleClass);
            };
            if (isHeaderFixed && fromTop < scrollOffset) {
                isHeaderFixed = false;
                isHeaderVisible = false;
                removeClass(header, headerFixedClass);
                addClass(header, headerInVisibleClass);
            };
            if (!isHeaderVisible && fromTop < headerOffset) {
                isHeaderVisible = true;
                removeClass(header, headerInVisibleClass);
            };
        };

        function loop() {
            var fromTop = _window.pageYOffset;
            if (lastScrollTop === fromTop) {
                raf(loop);
                return;
            } else {
                lastScrollTop = fromTop;
                // fire scroll function if scrolls vertically
                checkHeaderOffset(fromTop);
                raf(loop);
            }
        };

        checkHeaderOffset(lastScrollTop); //check scroll on page load
    })();

    //
    //tabs
    //---------------------------------------------------
    function initTabs () {
        var tabs = document.getElementsByClassName('js-tab'),
            content = document.getElementsByClassName('js-tab-content'),
            method = {};

        method.init = function () {
            Array.prototype.forEach.call(content, function (el, i) {//hide tab content
                el.style.display = 'none';
            });
            
            Array.prototype.forEach.call(tabs, function (list, i) {//for each ul.js-tab
                var elements = list.getElementsByTagName('li'),
                    current,
                    id,
                    target,
                    isCurrent = false;

                Array.prototype.forEach.call(elements, function (elem, i) {
                    if (hasClass(elem, 'current')) {//find li.current
                        current = elem;
                        isCurrent = true;
                    }
                });

                if (isCurrent) {
                    id = current.children[0].getAttribute('href');
                    
                } else {//add 'current' class to first 'li' element
                    var first = list.children[0];
                    id = first.children[0].getAttribute('href');
                    addClass(first, 'current');
                };
                target = document.getElementById(method.sliceID(id));
                target.style.display = 'block';//show tab content
            });
        };

        method.sliceID = function (id) {//cut '#' in link
            id = id.slice(id.indexOf('#') + 1 , id.length);
            return id;
        };

        method.show = function (link) {
            var list = link.parentNode.parentNode,
                elements = list.getElementsByTagName('li'),
                id_next = link.getAttribute('href'),
                id_current;

            Array.prototype.forEach.call(elements, function (el, i) {
                if (hasClass(el, 'current')) {//find current tab's id
                    id_current = el.children[0].getAttribute('href');
                };
                removeClass(el, 'current');
            });

            document.getElementById(method.sliceID(id_current)).style.display = 'none';//hide current tab
            addClass(link.parentNode, 'current');
            document.getElementById(method.sliceID(id_next)).style.display = 'block';//show next tab
            history.pushState(null, null, window.location.search + id_next);//add tab's id to url
        };

        method.parcing = function () {//parcing link and open tab after page load
            var hash = window.location.hash;
            if (hash) {
                Array.prototype.forEach.call(tabs, function (el, i) {
                    var elements = el.getElementsByTagName('a');

                    Array.prototype.forEach.call(elements, function (elem, i) {
                        var link = elem.getAttribute('href');
                        if (link === hash) {
                            method.show(elem);
                        };

                    });
                });
            }
        };

        method.init();
        method.parcing();

        Array.prototype.forEach.call(tabs, function (list, i) {//add click trigger
            var links = list.getElementsByTagName('a');

            Array.prototype.forEach.call(links, function (link, i) {
                link.addEventListener('click', function (event) {
                    event = event || window.event;
                    event.preventDefault();
                    method.show(link);
                });
            });
        });
    };

    var tabs = document.getElementsByClassName('js-tab');
    if (tabs.length) {
        initTabs();
    };

    //
    //helpers
    //---------------------------------------------------
    function removeClass(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    };

    function addClass(el, className) {
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    };

    function hasClass(el, className) {
        var result = false;
        if (el.classList) {
            if (el.classList.contains(className)) {
                result = true;
            }
        } else {
            if (new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)) {
                result = true;
            }
        }
        return result;
    };
})();
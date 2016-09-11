/*!
 * teambit2
 * @author: Sergii Nechyporenko, https://github.com/nechiporenko
 * @version: 2.0.1
 * Copyright 2016.
 */



// Application Scripts:
(function () {
    //
    //add js class to html tag
    //---------------------------------------------------
    var html = document.getElementsByTagName('html')[0];
    removeClass(html, 'no-js');
    addClass(html, 'js');

    //
    //show - hide mobile menu
    //---------------------------------------------------
    (function () {
        var menu_btn = document.getElementsByClassName('js-menu-toggle')[0],
            icon = menu_btn.children[0],
            menu = document.getElementsByClassName('js-menu')[0];

        menu_btn.addEventListener('click', checkMenuState);

        function checkMenuState() {
            if (hasClass(menu_btn, 'active')) {
                hideMenu();
            } else {
                showMenu();
            }
        };

        function showMenu() {
            addClass(menu_btn, 'active');
            addClass(menu, 'active');
            removeClass(icon, 'icon-menu');
            addClass(icon, 'icon-close');
        };

        function hideMenu() {
            removeClass(menu_btn, 'active');
            removeClass(menu, 'active');
            removeClass(icon, 'icon-close');
            addClass(icon, 'icon-menu');
        };
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
//
// Beauty Hover Plugin (backlight row and col when cell in mouseover)
//
//
(function ($) {

    $.fn.beautyHover = function () {
        var table = this;
        table.on('mouseover', 'td', function () {
            var idx = $(this).index();
            var rows = $(this).closest('table').find('tr');
            rows.each(function () {
                $(this).find('td:eq(' + idx + ')').addClass('beauty-hover');
            });
        })
		.on('mouseleave', 'td', function (e) {
		    var idx = $(this).index();
		    var rows = $(this).closest('table').find('tr');
		    rows.each(function () {
		        $(this).find('td:eq(' + idx + ')').removeClass('beauty-hover');
		    });
		});
    };

    
})(jQuery);

//
//  Helper for correct size of Messages page
//
function MessagesMenuWidth(){
	var W = window.innerWidth;
	var W_menu = $('#sidebar-left').outerWidth();
	var w_messages = (W-W_menu)*16.666666666666664/100;
	$('#messages-menu').width(w_messages);
}

$(document).ready(function () {
    $('body').on('click', '.show-sidebar', function (e) {
        e.preventDefault();
        $('div#main').toggleClass('sidebar-show');
        setTimeout(MessagesMenuWidth, 250);
    });

    //var ajax_url = location.hash.replace(/^#/, '');
    var hostname ="http://"+ $(location)[0].host;
    var ajax_url = location.href.replace(hostname, '');
    //console.log(hostname);
    if (ajax_url.length < 1) {
        ajax_url = 'ajax/dashboard.html';
    }

    var item = $('.main-menu li a[href$="' + ajax_url + '"]');
    //console.log(item);
    item.addClass('active-parent active');
    $('.dropdown:has(li:has(a.active)) > a').addClass('active-parent active');
    $('.dropdown:has(li:has(a.active)) > ul').css("display", "block");
    $('.main-menu').on('click', 'a', function (e) {
        var parents = $(this).parents('li');
        var li = $(this).closest('li.dropdown');
        var another_items = $('.main-menu li').not(parents);
        another_items.find('a').removeClass('active');
        another_items.find('a').removeClass('active-parent');
        if ($(this).hasClass('dropdown-toggle') || $(this).closest('li').find('ul').length == 0) {
            $(this).addClass('active-parent');
            var current = $(this).next();
            if (current.is(':visible')) {
                li.find("ul.dropdown-menu").slideUp('fast');
                li.find("ul.dropdown-menu a").removeClass('active')
            }
            else {
                another_items.find("ul.dropdown-menu").slideUp('fast');
                current.slideDown('fast');
            }
        }
        else {
            if (li.find('a.dropdown-toggle').hasClass('active-parent')) {
                var pre = $(this).closest('ul.dropdown-menu');
                pre.find("li.dropdown").not($(this).closest('li')).find('ul.dropdown-menu').slideUp('fast');
            }
        }
        if ($(this).hasClass('active') == false) {
            $(this).parents("ul.dropdown-menu").find('a').removeClass('active');
            $(this).addClass('active')
        }
        if ($(this).hasClass('ajax-link')) {
            e.preventDefault();
            if ($(this).hasClass('add-full')) {
                $('#content').addClass('full-content');
            }
            else {
                $('#content').removeClass('full-content');
            }
            var url = $(this).attr('href');
            window.location.href = url;
            console.log(url);
            //LoadAjaxContent(url);
        }
        if ($(this).attr('href') == '#') {
            e.preventDefault();
        }
    });
    var height = window.innerHeight - 49;
    $('#main').css('min-height', height)
		.on('click', '.expand-link', function (e) {
		    var body = $('body');
		    e.preventDefault();
		    var box = $(this).closest('div.box');
		    var button = $(this).find('i');
		    button.toggleClass('fa-expand').toggleClass('fa-compress');
		    box.toggleClass('expanded');
		    body.toggleClass('body-expanded');
		    var timeout = 0;
		    if (body.hasClass('body-expanded')) {
		        timeout = 100;
		    }
		    setTimeout(function () {
		        box.toggleClass('expanded-padding');
		    }, timeout);
		    setTimeout(function () {
		        box.resize();
		        box.find('[id^=map-]').resize();
		    }, timeout + 50);
		})
		.on('click', '.collapse-link', function (e) {
		    e.preventDefault();
		    var box = $(this).closest('div.box');
		    var button = $(this).find('i');
		    var content = box.find('div.box-content');
		    content.slideToggle('fast');
		    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
		    setTimeout(function () {
		        box.resize();
		        box.find('[id^=map-]').resize();
		    }, 50);
		})
		.on('click', '.close-link', function (e) {
		    e.preventDefault();
		    var content = $(this).closest('div.box');
		    content.remove();
		});
    $('#locked-screen').on('click', function (e) {
        e.preventDefault();
        $('body').addClass('body-screensaver');
        $('#screensaver').addClass("show");
        ScreenSaver();
    });
    $('body').on('click', 'a.close-link', function (e) {
        e.preventDefault();
        CloseModalBox();
    });
    $('#top-panel').on('click', 'a', function (e) {
        if ($(this).hasClass('ajax-link')) {
            e.preventDefault();
            if ($(this).hasClass('add-full')) {
                $('#content').addClass('full-content');
            }
            else {
                $('#content').removeClass('full-content');
            }
            var url = $(this).attr('href');
            window.location.hash = url;
            LoadAjaxContent(url);
        }
    });
    $('#search').on('keydown', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('#content').removeClass('full-content');
            ajax_url = 'ajax/page_search.html';
            window.location.hash = ajax_url;
            LoadAjaxContent(ajax_url);
        }
    });
    $('#screen_unlock').on('mouseover', function () {
        var header = 'Enter current username and password';
        var form = $('<div class="form-group"><label class="control-label">Username</label><input type="text" class="form-control" name="username" /></div>' +
					'<div class="form-group"><label class="control-label">Password</label><input type="password" class="form-control" name="password" /></div>');
        var button = $('<div class="text-center"><a href="index.html" class="btn btn-primary">Unlock</a></div>');
        OpenModalBox(header, form, button);
    });
    $('.about').on('click', function () {
        $('#about').toggleClass('about-h');
    })
    $('#about').on('mouseleave', function () {
        $('#about').removeClass('about-h');
    })
});

//
//  Helper for open ModalBox with requested header, content and bottom
//
//
function OpenModalBox(header, inner, bottom) {
    var modalbox = $('#modalbox');
    modalbox.find('.modal-header-name span').html(header);
    modalbox.find('.devoops-modal-inner').html(inner);
    modalbox.find('.devoops-modal-bottom').html(bottom);
    modalbox.fadeIn('fast');
    $('body').addClass("body-expanded");
}

function doSignOut() {
    $.ajax({
        type: 'POST',
        url: _url + 'Login/Logout',
        success: function (data) {
            console.log(data);
            if (data.status == "1") {
                document.location.reload();
            }
            else {
                AlertThongBao("Lỗi : " + data.sErr);
            }
        },
        async: false,
    });
}
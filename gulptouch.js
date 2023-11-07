;
(function (window, document, $, undefined) {
    //Shortcut for fancyBox object
    var F = $.fancybox,
        W = $(window),
        D = $(document),
        isTouch = document.createTouch !== undefined;

    F.helpers.overlayAdvanced = {
        defaults: {
            closeClick: true, // if true, fancyBox will be closed when user clicks on the overlay
            speedOut: 200, // duration of fadeOut animation
            showEarly: true, // indicates if should be opened immediately or wait until the content is ready
            css: {}, // custom CSS properties
            additionalClasses: {},
            locked: !isTouch, // if true, the content will be locked into overlay
            fixed: true       // if false, the overlay CSS position property will not be set to "fixed"
        },

        overlay: null, // current handle
        fixed: false, // indicates if the overlay has position "fixed"
        el: $('html'), // element that contains "the lock"

        // Public methods
        create: function (opts) {
            var parent;

            opts = $.extend({}, this.defaults, opts);

            if (this.overlay) {
                this.close();
            }

            parent = F.coming ? F.coming.parent : opts.parent;

            this.overlay = $('<div class="fancybox-overlay"></div>').appendTo(parent && parent.lenth ? parent : 'body');
            this.fixed = false;

            if (opts.fixed && F.defaults.fixed) {
                this.overlay.addClass('fancybox-overlay-fixed');

                this.fixed = true;
            }
        },

        open: function (opts) {
            var that = this;

            opts = $.extend({}, this.defaults, opts);

            if (this.overlay) {
                this.overlay.unbind('.overlay').width('auto').height('auto');

            } else {
                this.create(opts);
            }

            if (!this.fixed) {
                W.bind('resize.overlay', $.proxy(this.update, this));

                this.update();
            }

            if (opts.closeClick) {
                this.overlay.bind('click.overlay', function (e) {
                    if ($(e.target).hasClass('fancybox-overlay')) {
                        if (F.isActive) {
                            F.close();
                        } else {
                            that.close();
                        }

                        return false;
                    }
                });
            }

            this.overlay.css(opts.css).show();
        },

        close: function () {
            W.unbind('resize.overlay');

            if (this.el.hasClass('fancybox-lock')) {
                $('.fancybox-margin').removeClass('fancybox-margin');

                this.el.removeClass('fancybox-lock');

                W.scrollTop(this.scrollV).scrollLeft(this.scrollH);
            }

            $('.fancybox-overlay').remove().hide();

            $.extend(this, {
                overlay: null,
                fixed: false
            });
        },

        // Private, callbacks

        update: function () {
            var width = '100%', offsetWidth;

            // Reset width/height so it will not mess
            this.overlay.width(width).height('100%');

            // jQuery does not return reliable result for IE
            if (IE) {
                offsetWidth = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth);

                if (D.width() > offsetWidth) {
                    width = D.width();
                }

            } else if (D.width() > W.width()) {
                width = D.width();
            }

            this.overlay.width(width).height(D.height());
        },

        // This is where we can manipulate DOM, because later it would cause iframes to reload
        onReady: function (opts, obj) {
            var overlay = this.overlay;

            $('.fancybox-overlay').stop(true, true);

            if (!overlay) {
                this.create(opts);
            }

            if (opts.locked && this.fixed && obj.fixed) {
                obj.locked = this.overlay.append(obj.wrap);
                obj.fixed = false;
            }

            if (opts.showEarly === true) {
                this.beforeShow.apply(this, arguments);
            }
        },

        beforeShow: function (opts, obj) {
            if (obj.locked && !this.el.hasClass('fancybox-lock')) {
                if (this.fixPosition !== false) {
                    $('*').filter(function () {
                        return ($(this).css('position') === 'fixed' && !$(this).hasClass("fancybox-overlay") && !$(this).hasClass("fancybox-wrap"));
                    }).addClass('fancybox-margin');
                }

                this.el.addClass('fancybox-margin');

                this.scrollV = W.scrollTop();
                this.scrollH = W.scrollLeft();

                this.el.addClass('fancybox-lock');

                W.scrollTop(this.scrollV).scrollLeft(this.scrollH);
            }

            this.open(opts);
        },

        onUpdate: function () {
            if (!this.fixed) {
                this.update();
            }
        },

        afterClose: function (opts) {
            // Remove overlay if exists and fancyBox is not opening
            // (e.g., it is not being open using afterClose callback)
            if (this.overlay && !F.coming && !application.overlay.open) {
                this.overlay.fadeOut(opts.speedOut, $.proxy(this.close, this));
            }

            if (application.overlay.open) {
                this.overlay.unbind('click.overlay');
                $('html').removeClass('fancybox-lock');
            }
        }
    };

}(window, document, jQuery));

var application = {
    overlay: {
        open: false
    },
    defaultShowErrors: function (errorMap, errorList) {
        var i, elements, error;
        for (i = 0; this.errorList[i]; i++) {
            error = this.errorList[i];
            if (this.settings.highlight) {
                this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
            }

            if (error.element.dataset.msgRecaptcharequired == 'Подтвердите, что Вы не робот' && error.message == 'Подтвердите, что Вы не робот') {
                this.showLabel(error.element, error.message);
            }
        }
        if (this.errorList.length) {
            this.toShow = this.toShow.add(this.containers);
        }
        if (this.settings.success) {
            for (i = 0; this.successList[i]; i++) {
                this.showLabel(this.successList[i]);
            }
        }
        if (this.settings.unhighlight) {
            for (i = 0, elements = this.validElements(); elements[i]; i++) {
                this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
            }
        }
        this.toHide = this.toHide.not(this.toShow);
        this.hideErrors();
        this.addWrapper(this.toShow).show();
    },
    fancybox: {
        swipe: function () {
            if (!jQuery.fn.swipe)
                return;

            jQuery('.fancybox-wrap').swipe({
                swipe: function (event, direction) {
                    if (direction === 'left' || direction === 'up') {
                        jQuery.fancybox.prev(direction);
                    } else {
                        jQuery.fancybox.next(direction);
                    }
                }
            });
        },
        init: function (app) {
            if (jQuery.fn.fancybox) {
                jQuery.extend(jQuery.fancybox.defaults.tpl, {
                    error: '<p class="fancybox-error">Ошибка загрузки данных.<br/>Пожалуйста попробуйте позже.</p>',
                    closeBtn: '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"></a>',
                    next: '<a title="Следующий" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',
                    prev: '<a title="Предыдущий" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
                });

                jQuery('a.vid-item').fancybox({
                    wrapCSS: 'fancybox-video',
                    fitToView: false,
                    padding: 9,
                    maxWidth: 700
                });

                jQuery('a.fancybox').fancybox({
                    afterShow: app.fancybox.swipe
                });

                jQuery('.js-login-form-link').fancybox({
                    wrapCSS: 'fancybox-login',
                    afterShow: function () {
                        var form = jQuery('.fancybox-login').find('form');

                        if (jQuery.fn.validate) {
                            form.validate({
                                showErrors: app.defaultShowErrors,
                                submitHandler: app.users.login
                            });
                        }
                    }
                });
                jQuery('.js-register-form-link').fancybox({
                    wrapCSS: 'fancybox-register',
                    afterShow: function () {
                        $('.g-recaptcha').each(function (index, el) {
                        grecaptcha.render(el, {
                            'sitekey': $(this).data('sitekey')
                            });
                        });
                        var form = jQuery('.fancybox-register').find('form');
                        if (jQuery.fn.validate) {
                            form.validate({
                                showErrors: app.defaultShowErrors,
                                submitHandler: app.users.login
                            });
                        }
                    }
                });
                $('.js-booking-form-link').fancybox({
                    wrapCSS: 'fancybox-booking',
                    modal: true,
                    fitToView: false,
                    maxWidth: '100%',
                    scrolling: 'visible',
                    helpers: {
                        overlay: false,
                        overlayAdvanced: true
                    },
                    beforeShow: function () {
                        $("body").css({'overflow-y': 'hidden'});
                    },
                    afterClose: function () {
                        $("body").css({'overflow-y': 'visible'});
                    },
                    beforeShow: function () {
                        var selectOptions = {
                            dropdownParent: $('.fancybox-wrap'),
                            placeholder: 'Выберите время'
                        };
                        if ($('select.js-field-worktime-id').length) {
                            var $select = $('.js-field-worktime-id').select2(selectOptions);
                        }
                        $('.js-field-worktime-id').on('afterRemoteLoading', function (event) {
                            if ($('select.js-field-worktime-id').length) {
                                $select.val(null).trigger('change.select2');
                                $('.js-field-worktime-id').select2(selectOptions);
                            }
                        });
                    },
                    afterShow: function () {
                        if ($('select.js-field-worktime-id').length == 0) {
                            setTimeout(function () {
                                $('.js-field-worktime-id').trigger('change');
                            }, 500);
                        }

                        $(".js-admin-order-email:not(.error)").on("keyup", function () {
                            var $email = $(this).val();
                            var $form = $(this).closest(".js-form-submit-admin-order");

                            SendAjax("CHECK_EMAIL", {
                                email: $email,
                            }, function (data) {
                                $form.find('[name="lname"]').val(data.LAST_NAME);
                                $form.find('[name="fname"]').val(data.NAME);
                                $form.find('[name="sname"]').val(data.SECOND_NAME);
                                $form.find('[name="phone"]').val(data.PERSONAL_PHONE);
                            });
                        });

                        var $form = $('.fancybox-booking').find('form'),
                            submit_btn = $form.find("input[type='submit']"),
                            cabinet_id = $form.find("[name='cabinet-id']").val(),
                            $form_container = $form.closest('.form-container'),
                            $ajax_result = $form_container.find('.ajax-result'),
                            rentType = 'individual';

                        if ($.fn.validate) {
                            $form = $('.fancybox-booking').find('form');
                            $form.validate({
                                showErrors: app.defaultShowErrors
                            });
                        }

                        $('.fancybox-booking').find('.fancybox-close').on('click', function (event) {
                            $.fancybox.close(true);
                        });

                        if ($.fn.datepicker) {
                            var array = [
                                    "2021-10-30",
                                    "2021-10-31",
                                    "2021-11-01",
                                    "2021-11-02",
                                    "2021-11-03",
                                    "2021-11-04",
                                    "2021-11-05",
                                    "2021-11-06",
                                    "2021-11-07",
                                ],
                                maxDate = '+1year',
                                cabinetId = parseInt($('.datepicker').attr('data-cabinet-id'));
                            if (cabinetId === 15 || cabinetId === 23234) {
                                maxDate = new Date(2022, 2, 31);
                            }

                            $('.datepicker').datepicker({
                                minDate: -0,
                                maxDate: maxDate,
                                beforeShowDay: function (date) {
                                    var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
                                    return [array.indexOf(string) == -1]
                                }
                            });
                            $('.datepicker, select[name=cabinet-id]').on('input change', function (e) {
                                cabinet_id = $form.find("[name='cabinet-id']").val();
                                var date = $form.find('.datepicker').val();
                                $.ajax({
                                    type: 'GET',
                                    dataType: 'json',
                                    url: '/ajax.php?action=getCabinetWorkingTimes&cabinet_id=' + cabinet_id + '&date=' + date,
                                    beforeSend: function () {
                                        $ajax_result.empty();
                                        submit_btn.prop('disabled', true);
                                    }
                                })
                                    .done(function (data) {
                                        if (data.error) {
                                            $ajax_result.html('Ошибка! Выберите другую дату');
                                        } else {
                                            $.each(data.items, function (index, val) {
                                                var $elem = $('.js-field-worktime-id').find('option[value="' + val.id + '"]');
                                                if (val.disabled) {
                                                    $elem.prop('disabled', true);
                                                } else {
                                                    $elem.prop('disabled', false);
                                                }
                                            });

                                   // if (data.allDayEnable) {
                                   //   $('.js-field-worktime-id').find('option[value="all-day"]').prop('disabled', false);
                                   // } else {
                                   //   $('.js-field-worktime-id').find('option[value="all-day"]').prop('disabled', true);
                                   // }
                                        }

                                        $('.js-field-worktime-id').trigger('afterRemoteLoading');
                                    })
                                    .fail(function (jqXHR, textStatus, errorThrown) {
                                        $ajax_result.html('Ошибка! Обратитесь к администратору');
                                    })
                                    .always(function (data) {
                                        submit_btn.prop('disabled', false);
                                    });
                            });
                        }

                        function hello()
                        {
                            $(".js-order-discount").html('');
                            $.ajax({
                                type: 'GET',
                                dataType: 'json',
                                url: '/ajax.php',
                                data: {
                                    "action": "GET_ORDER_COST",
                                    "data": $form.serializeArray()
                                },
                                beforeSend: function () {
                                    $ajax_result.empty();
                                    $('.fancybox-inner').css('pointer-events', 'none');
                                    jQuery.fancybox.showLoading();
                                }
                            })
                                .done(function (data) {
                                    if (!data.error) {
                                        $('.available_cost').html(data.balance.available);
                                        if (data.balance.available < data.cost)
                                        {
                                            $('.add_cost-btn').data('needle', data.balance.available - data.cost);
                                            $('.choise_time_form').addClass('no_cost');
                                        }
                                        else
                                        {
                                            $('.choise_time_form').removeClass('no_cost');
                                        }
                                        $('.js-price').html(data.cost);
                                        if (data.discount > 0) {
                                            $(".js-order-discount").html("<span class='discount-order'>Ваша скидка " + data.discount + " р</span>");
                                        }
                                    } else {
                                        $('.js-price').html(0);
                                        $ajax_result.html(data.text);
                                        $(".js-order-discount").html("");
                                    }
                                })
                                .fail(function (jqXHR, textStatus, errorThrown) {
                                    $ajax_result.html('Ошибка! Обратитесь к администратору');
                                })
                                .always(function (data) {
                                    jQuery.fancybox.hideLoading();
                                    $('.fancybox-inner').css('pointer-events', 'auto');
                                    $('input.js-phone').attr('readonly', true);
                                });
                        }

                        let timeout = false;

                        $('.js-field-worktime-id').on('change', function (event) {
                            if (timeout) clearTimeout(timeout);
                            timeout = setTimeout(hello, 500);
                        });

                        $('.js-field-worktime-id').change();
                        $('.js-field-session-type').on('change', function (event) {
                            if ($(this).val() == 'individual') {
                                rentType = 'individual';
                            } else if ($(this).val() == 'group') {
                                rentType = 'group';
                            }
                            $('.js-field-worktime-id').trigger('change');
                        });
                    }
                });

                jQuery('a.remote-modal-form').fancybox({
                    wrapCSS: 'fancybox-form form-2',
                    fitToView: true,
                    afterShow: function () {
                        var form = jQuery('.fancybox-form').find('form'),
                            form_id = form.find("input[name='system_form_id']").val(),
                            submit_btn = form.find("input[type='submit']"),
                            form_container = form.closest("div.form-container"),
                            ajax_result = form_container.find(".ajax-result"),
                            captcha = form.find('img.captcha_img');

                        form.validate({
                            showErrors: app.defaultShowErrors,
                            submitHandler: function (form) {
                                if (jQuery.fn.ajaxSubmit) {
                                    jQuery(form).ajaxSubmit({
                                        beforeSubmit: function (arr, $form, options) {
                                            submit_btn.button('loading');
                                            ajax_result.empty();
                                            ajax_result.show();
                                            jQuery.fancybox.update();
                                        },
                                        error: function () {
                                            jQuery.fancybox.update();
                                            jQuery('.ajax-result').html('Ошибка! Обратитесь к администратору');
                                            submit_btn.button('reset');
                                        },
                                        success: function (responseText, statusText, xhr, form) {
                                            jQuery.fancybox.update();
                                            var json = jQuery.parseJSON(responseText);

                                            if (json.status) {
                                                ajax_result.html(json.message);
                                                var d = new Date();
                                                captcha.attr('src', '/captcha.php?reset&' + d.getTime());
                                                submit_btn.button('reset');
                                            } else {
                                                jQuery.ajax({
                                                    type: "GET",
                                                    dataType: 'json',
                                                    url: '/udata/webforms/posted/' + form_id + '.json',
                                                    success: function (data) {
                                                        ajax_result.html(data.result);
                                                        form.remove();
                                                        jQuery.fancybox.update();
                                                    },
                                                    error: function (jqXHR, textStatus, errorThrown) {
                                                        ajax_result.html('Ошибка! Обратитесь к администратору');
                                                        submit_btn.button('reset');
                                                        jQuery.fancybox.update();
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                        form.attr('action', '/webforms/ajax_send/');
                    },
                    width: 500,
                    autoSize: false,
                    autoHeight: true
                });

                jQuery("a.zoom-map").fancybox({
                    speedIn: 600,
                    speedOut: 200,
                    overlayShow: !0
                });
            }
        }
    },
    toTop: {
        init: function (app) {
            if (jQuery.fn.UItoTop) {
                jQuery().UItoTop({easingType: 'easeOutQuart', text: i18n.btnTopLabel});
            }
        }
    },
    validation: {
        init: function (app) {
            if (!jQuery.fn.validate)
                return;

            jQuery.validator.addMethod('whiteSpaceNotAllowed', function (value, element) {
                if (this.optional(element) && value === '')
                    return true;

                if (/\s/.test(value)) {
                    return false;
                }

                return true;
            }, 'Whitespace not allowed');

            jQuery.validator.addMethod('сyrillicNotAllowed', function (value, element) {
                if (this.optional(element) && value === '')
                    return true;

                if (/[А-Я]/.test(value) || /[а-я]/.test(value)) {
                    return false;
                }

                return true;
            }, 'Cyrillic not allowed');

            jQuery.validator.addMethod('strongPassword', function (value, element) {
                if (this.optional(element) && value === '')
                    return true;

                if (/[0-9]/.test(value) && (/[A-Z]/.test(value) || /[А-Я]/.test(value)) && (/[a-z]/.test(value) || /[а-я]/.test(value))) {
                    return true;
                }

                return false;
            }, 'Password must contain capital letter, lowercase letter and digit');

            jQuery.validator.addMethod('notEqualTo', function (value, element, param) {
                return this.optional(element) || value != $(param).val();
            }, 'This has to be different...');

            jQuery.validator.addMethod('recaptchaRequired', function (value, element, param) {
                return (grecaptcha.getResponse() == '') ? false : true;
            }, 'Recaptcha required');

            jQuery('form').not('.inline-form').each(function (index, el) {
                jQuery(this).validate({
                    ignore: '.ignore',
                });
            });

            jQuery('form.inline-form').each(function (index, el) {
                jQuery(this).validate({
                    ignore: '.ignore',
                    showErrors: app.defaultShowErrors
                });
            });
        }
    },
    slider: {
        init: function (app) {
            if (!jQuery.fn.bxSlider)
                return;

            if (jQuery('.main-slider').children().length > 1) {
                jQuery('.main-slider').bxSlider({
                    auto: true,
                    pause: 3000,
                    autoHover: true,
                    mode: 'fade',
                    captions: true,
                    nextText: 'Назад',
                    prevText: 'Вперед'
                });
            }

            if (jQuery('.gallery-slider').children().length > 1) {
                jQuery('.gallery-slider').bxSlider({
                    auto: false,
                    pause: 5000,
                    autoHover: true,
                    captions: false,
                    adaptiveHeight: true,
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    nextText: 'Next',
                    prevText: 'Prev',
                    useCSS: false,
                    pagerCustom: '#bx-pager'
                });
            }

            if (jQuery('.our-address_slider').length > 0) {
                var sliders = [];
                jQuery('.js-main-tab-link').on('shown.bs.tab', function (e) {
                    sliders[jQuery(e.target).data('id')].reloadSlider();
                });

                jQuery('.our-address_slider').each(function (index, el) {
                    if (jQuery(this).children().length > 1) {
                        sliders[jQuery(this).data('id')] = jQuery(this).bxSlider({
                            auto: true,
                            pause: 5000,
                            autoHover: true,
                            captions: true,
                            minSlides: 1,
                            maxSlides: 4,
                            moveSlides: 1,
                            slideWidth: 390,
                            nextText: 'Назад',
                            prevText: 'Вперед'
                        });
                    }
                });
            }
        }
    },
    modernizr: {
        init: function (app) {
            var self = this;
            if (!self.available())
                return;
            if (!Modernizr.csstransforms3d) {
                jQuery('.fade').removeClass('fade');
            }
        },
        available: function () {
            return typeof Modernizr !== "undefined";
        }
    },
    ajax_forms: {
        current: {
            sending: false
        },
        init: function (app) {
            var self = this;
            jQuery('.ajax-form').on('submit', function () {
                var form = jQuery(this);
                if ($.fn.validate) {
                    if (!form.valid())
                        return false;
                }

                var form_id = form.find("input[name='system_form_id'").val();
                if (!form_id)
                    return true;
                if (self.current.sending)
                    return false;
                var submit_btn = form.find("input[type='submit']");
                var send_data = form.serializeArray();
                var ajax_result = form.find(".ajax-result");

                self.current.sending = true;
                submit_btn.button('loading');

                jQuery.ajax({
                    type: "POST",
                    data: send_data,
                    dataType: 'json',
                    url: '/webforms/ajax_send/',
                    beforeSend: function () {
                        ajax_result.empty();
                    }
                })
                    .done(function (data) {
                        if (data.status) {
                            ajax_result.html(data.message);
                            var d = new Date();
                            form.find('img.captcha_img').attr('src', '/captcha.php?reset&' + d.getTime());
                            submit_btn.button('reset');
                            self.current.sending = false;
                        } else {
                            jQuery.ajax({
                                type: "GET",
                                dataType: 'json',
                                url: '/udata/webforms/posted/' + form_id + '.json'
                            })
                                .done(function (data) {
                                    ajax_result.html(data.result);
                                    form.get(0).reset();
                                    self.current.sending = false;
                                    submit_btn.button('reset');
                                }).fail(function (jqXHR, textStatus, errorThrown) {
                                ajax_result.html('Ошибка! Обратитесь к администратору');
                            });
                        }
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        ajax_result.html('Ошибка! Обратитесь к администратору');
                    })
                    .always(function (data) {
                        submit_btn.button('reset');
                        self.current.sending = false;
                    });
                return false;
            });
        }
    },
    captcha: {
        init: function (app) {
            jQuery('body').on('click', '.captcha-reset', function () {
                var d = new Date();
                jQuery(this).closest('form').find('.captcha-img').attr('src', '/captcha.php?reset&' + d.getTime());
            });
        }
    },
    users: {
        current: {
            sending: false
        },
        init: function (app) {
        },
        login: function (form) {
//      var $form = jQuery(form),
//              $formResponse = $form.find('.js-ajax-result');
//
//      jQuery.ajax({
//        type: 'POST',
//        data: $form.serializeArray(),
//        dataType: 'json',
//        url: $form.attr('action'),
//        beforeSend: function () {
//          $formResponse.empty();
//        }
//      })
//              .done(function (data) {
//                $formResponse.html(data.message);
//                if (!data.status) {
//                  setTimeout(function () {
//                    location.reload()
//                  }, 500);
//                }
//              })
//              .fail(function (jqXHR, textStatus, errorThrown) {
//                $formResponse.html('Ошибка! Обратитесь к администратору');
//              })
//              .always(function (data) {
//                // self.current.sending = false;
//              });
        }
    },
    tabs: {
        init: function (app) {
            if ($.fn.tab) {

                var separator = '_';

                $.address.wrap(true);

                $.address.change(function (event) {
                    var currentTab = $("a[href='#" + event.value.replace(/^\//, '').replace('/', separator) + "']:first");
                    currentTab.tab('show');

                    $('.nav-tabs a').on("click", function (e) {
                        $.address.value(e.target.hash.replace(/^#/, '').replace(separator, '/'));
                        e.preventDefault();
                        $(this).tab('show');
                    });
                });
            }
        }
    },
    orders: {
        current: {
            sending: false
        },
        init: function (app) {
            var self = this;

            jQuery('.js-order-detail').on('click', function (event) {
                event.preventDefault();

                var $btn = jQuery(this),
                    orderID = $btn.data('id');

                if (!orderID)
                    return;

                if ($btn.find('i').hasClass('glyphicon-minus')) {
                    $btn.closest('tr').next('.detail-view').remove();
                    $btn.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
                    return;
                }

                if (self.current.sending)
                    return false;

                jQuery.ajax({
                    type: 'GET',
                    url: '/order-detail.ajax/' + orderID + '/',
                    beforeSend: function () {
                        self.current.sending = true;
                    }
                })
                    .done(function (data) {
                        jQuery(data).insertAfter($btn.closest('tr'));
                        $btn.find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {

                    })
                    .always(function (data) {
                        self.current.sending = false;
                    });
            })
        }
    },
    calendar: {
        current: {
            sending: false
        },
        init: function (app) {
            var self = this;

            $("body").on('click', '.js-month-select', function (event) {
                event.preventDefault();

                var $btn = jQuery(this),
                    year = $btn.data('year'),
                    month = $btn.data('month'),
                    cabinetID = $btn.closest('.js-schedule').data('cabinet-id');

                if (!year || !month)
                    return;

                if (self.current.sending)
                    return false;

                var $url = location.href;

                var $data = {
                    "cabinet_id": cabinetID,
                    "year": year,
                    "month": month,
                    "get_ajax_month_table": "Y",
                };


                jQuery.ajax({
                    type: 'GET',
                    url: $url,
                    data: $data,
                    dataType: 'html',
                    beforeSend: function () {
                        self.current.sending = true;
                    }
                })
                    .done(function (data) {
                        jQuery('.js-month-table').replaceWith($(data).find('.js-month-table'));

                        jQuery('.js-prev-month').replaceWith($(data).find('.js-prev-month'));

                        jQuery('.js-next-month').replaceWith($(data).find('.js-next-month'));

                        jQuery('.js-selected-date').html($(data).find('.js-selected-date').html());
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {

                    })
                    .always(function (data) {
                        self.current.sending = false;
                    });
            });
        }
    }
}

jQuery(document).ready(function () {
    (function () {
        this.fancybox.init(this);
        this.toTop.init(this);
        this.validation.init(this);
        this.slider.init(this);
        this.modernizr.init(this);
        this.ajax_forms.init(this);
        this.captcha.init(this);
        this.users.init(this);
        // this.tabs.init(this);
        this.orders.init(this);
        this.calendar.init(this);
    }).call(application);
});

var onRecaptchaLoadCallback = (function () {
    $('.g-recaptcha').each(function (index, el) {
        grecaptcha.render(el, {
            'sitekey': $(this).data('sitekey')
        });
    });
})();

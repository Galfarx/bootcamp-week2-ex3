var AjaxAPP = (function ($, Handlebars) {

    var textTemplate = $("#li-template").html();
    var compiledTemplate = Handlebars.compile(textTemplate);
    var $list = $(".js_list");
    var $form = $(".js_form");
    var $button = $form.find("button");

    function init() {
        addEvents();
    }

    function addEvents() {
        $button.on('click', getData)
    }

    function getData(e) {
        e.preventDefault();

        $.getJSON('https://jsonplaceholder.typicode.com/users', function (data) {
            addElement(data)
        })
        .fail(function () {
            renderErrorMessage("Ups! Stało się coś złego, nie udało się pobrać danych...");
        });

        $button.prop('disabled', true);
    }

    function addElement(data) {

        if (data.length < 0) {
            renderErrorMessage("Ups! Twoje dane gdzieś zniknęły...");
            return -1;
        }

        var df = document.createDocumentFragment();

        $.each(data, function (i, el) {
            $(df).append(compiledTemplate(el));
        });

        $list.append(df);
    }

    function renderErrorMessage(message) {
        var $li = $("<li></li>", {
            "class": "text-danger",
            text: message
        });

        $list.append($li)
    }

    return {
        init: init
    }
})(jQuery, Handlebars);

$(document).ready(function () {
    AjaxAPP.init()
});
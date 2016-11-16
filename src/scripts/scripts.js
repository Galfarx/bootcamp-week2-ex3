function Fetch(url, userSuccessCallback, userFailureHandler) {

    if (arguments.length != 3) {
        throw new Error('Fetch przyjmuje 3 argumenty: URL, success callback, failure callback');
    }

    if (typeof arguments[1] !== 'function') {
        throw new Error('Success callback musi być funckcją');
    }

    if (typeof arguments[2] !== 'function') {
        throw new Error('Failure callback musi być funkcją');
    }

    if (!(this instanceof Fetch)) {
        return new Fetch(url, userSuccessCallback, userFailureHandler);
    }


    this._xhr = new XMLHttpRequest();
    this._successHandler = userSuccessCallback;
    this._failureHandler = userFailureHandler;

    this._xhr.open('GET', url);
    this._asignEvents();
    this._xhr.send(null);
}

Fetch.prototype._handleResponse = function () {
    if (this._xhr.readyState === 4 && this._xhr.status >= 200  && this._xhr.status < 400){
        this._successHandler(this._xhr.response);
    } else if (this._xhr.readyState === 4 && this._xhr.status >= 400) {
        this._failureHandler(this._xhr);
    }
};

Fetch.prototype._handleError = function () {
    this._failureHandler(this._xhr);
};

Fetch.prototype._asignEvents = function () {
    this._xhr.addEventListener('readystatechange', this._handleResponse.bind(this), false);
    this._xhr.addEventListener('abort', this._handleError.bind(this), false);
    this._xhr.addEventListener('error', this._handleError.bind(this), false);
    this._xhr.addEventListener('timeout', this._handleError.bind(this), false);
};

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


        Fetch(
            'https://jsonplaceholder.typicode.com/users',
            function (data) {
                addElement(data);
                console.log('Sukces!');
            },
            function (xhr) {
                console.log(xhr);
                console.log('Błąd!')
            }
        );

        $button.prop('disabled', true);
    }

    function addElement(data) {

        if (data.length == 0) {
            renderErrorMessage("Ups! Twoje dane gdzieś zniknęły...");
            return -1;
        }

        var df = document.createDocumentFragment();

        $.each(JSON.parse(data), function (i, el) {
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
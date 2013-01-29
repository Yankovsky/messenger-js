messenger = (function () {
    var events = {};

    return {
        listen : function (eventName, handle, canHandle) {
            if (!events[eventName]) {
                events[eventName] = [];
            }
            events[eventName].push({
                handle : handle,
                canHandle : canHandle
            });
        },
        notify : function (eventName, sender) {
            var listeners = events[eventName];
            for (var i = 0; i < listeners.length; i++) {
                var listener = listeners[i];
                if (listener.canHandle(sender)) {
                    listener.handle(sender);
                }
            }
        }
    }
})();

function Control(id, props) {
    if (id) {
        this.element = document.getElementById(id);
    }

    for (var prop in props) {
        if (prop == "init") {
            props[prop](this);
        }
        this[prop] = props[prop];
    }
}

InputControl.prototype = new Control();
function InputControl(id, props) {
    Control.call(this, id, props);

    if (this.element) {
        this.element.onclick = this.onInputChanged;
    }
}
InputControl.prototype.onInputChanged = function () {
};

var nameInputControl = new InputControl("name-input", {
    onInputChanged : function () {
        messenger.notify("nameChanged", this);
    }
});
var nameSelectControl = new InputControl("name-select", {
    onInputChanged : function () {
        messenger.notify("nameChanged", this);
    }
});

var helloUsernameControl = new Control("hello-username", {
    init : function (that) {
        messenger.listen("nameChanged", function (sender) {
            that.element.innerHTML = sender.value;
        }, function (sender) {
            return sender.value != "bad";
        });
    }
});
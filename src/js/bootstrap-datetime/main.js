/**
 * @module main
 */
define([
    './date-view',
    'moment',
    './time-view',
    './util',
], function (
    DateView,
    moment,
    TimeView,
    util
) {
    'use strict';

    function addViewFooterBtn(picker) {
        while (picker.btnGroup.previousElementSibling) {
            picker.btnGroup.parentNode.removeChild(picker.btnGroup.previousElementSibling);
        }

        picker.btnGroup.parentNode.insertBefore(picker.views[picker.currentView].footerButton, picker.btnGroup);
    }

    function updateActiveViewBtn(picker) {
        var activeBtn = picker.btnGroup.querySelector('.active');

        if (activeBtn && activeBtn.className.indexOf('active')) {
            activeBtn.className = activeBtn.className.replace('active', '');
        }

        if (picker.btnGroup.children.length > picker.currentView) {
            var currentBtn = picker.btnGroup.children[picker.currentView];

            if (currentBtn.className.indexOf('active') < 0) {
                currentBtn.className += ' active';
            }
        }
    }

    function renderView(picker, view) {
        var i;
        var titleContents = view.titleContents;
        var titleDiv = picker.popover.children[1];
        var bodyContents = view.bodyContents;
        var bodyDiv = picker.popover.children[2];

        // Remove current children from popover title
        while (titleDiv.firstChild) {
            titleDiv.removeChild(titleDiv.firstChild);
        }

        // Remove current children from popover body
        while (bodyDiv.firstChild) {
            bodyDiv.removeChild(bodyDiv.firstChild);
        }

        if (titleContents) {
            // Add title contents from view
            for (i = 0; i < titleContents.length; i++) {
                titleDiv.appendChild(titleContents[i]);
            }

            titleDiv.style.display = 'block';
        } else {
            titleDiv.style.display = 'none';
        }

        if (bodyContents) {
            // Add title contents from view
            for (i = 0; i < bodyContents.length; i++) {
                bodyDiv.appendChild(bodyContents[i]);
            }

            bodyDiv.style.display = 'block';
        } else {
            bodyDiv.style.display = 'none';
        }

        bodyDiv.setAttribute('data-id', view.bodyDataId);

        updateActiveViewBtn(picker);
        addViewFooterBtn(picker);
    }

    function viewClickHandler(picker, e) {
        picker.currentInput = e.currentTarget;

        var index = parseInt(picker.currentInput.getAttribute('data-index'));

        // If clicked view is current view nothing to do
        if (index === picker.currentView) {
            return;
        }

        picker.currentView = index;

        renderView(picker, picker.views[index]);
    }

    function setupFooterButtons(picker) {
        while (picker.btnGroup.firstChild) {
            picker.btnGroup.removeChild(picker.btnGroup.firstChild);
        }

        // If there is only one view then we don't need view buttons
        if (picker.views.length === 1) {
            return;
        }

        for (var i = 0; i < picker.views.length; i++) {
            var button = util.el('a', 'btn btn-default');
            button.href = '#';
            button.setAttribute('data-index', i);
            var span = util.el('span', 'glyphicon glyphicon-' + picker.views[i].icon);
            button.appendChild(span);

            button.onclick = function (e) {
                e.preventDefault();
                viewClickHandler(picker, e);
            };

            picker.btnGroup.appendChild(button);
        }
    }

    function configurePicker(picker, inputGroup) {
        picker.currentInput = inputGroup.children[0];

        switch (picker.currentInput.getAttribute('data-type')) {
            case 'date':
                picker.views = [
                    picker.dateView,
                ];
                break;

            case 'time':
                picker.views = [
                    picker.timeView,
                ];
                break;

            default:
                picker.views = [
                    picker.dateView,
                    picker.timeView,
                ];
        }

        setupFooterButtons(picker);
        renderView(picker, picker.views[0]);
    }

    function createPopover(picker) {
        var popover = util.el('div', 'popover bottom datetime-popover');
        var arrow = util.el('div', 'arrow');
        var title = util.el('div', 'popover-title text-center');
        var body = util.el('div', 'popover-content');
        var footer = util.el('div', 'panel-footer');
        picker.btnGroup = util.el('div', 'btn-group btn-group-xs pull-right');
        var clearfix = util.el('div', 'clearfix');

        footer.appendChild(picker.btnGroup);
        footer.appendChild(clearfix);
        popover.appendChild(arrow);
        popover.appendChild(title);
        popover.appendChild(body);
        popover.appendChild(footer);

        return popover;
    }

    function getInputs(bindTo) {
        // If bindTo is a string treat it as a query selector
        if (typeof bindTo === 'string') {
            return document.querySelectorAll(bindTo);
        }

        // If bindTo is a DOM element
        if (bindTo.hasOwnProperty('nodeType')) {
            return [bindTo];
        }

        // If bindTo is an array
        if (bindTo instanceof Array) {
            var inputs = [];

            for (var i = 0; i < bindTo.length; i++) {
                inputs = inputs.concat(getInputs(bindTo[i]));
            }

            return inputs;
        }

        // If bindTo is null then nothing to do
        if (bindTo === null) {
            return null;
        }

        throw 'Unknown type to bind bootstrap-datetime picker to';
    }

    function overrideDefaults(overrides) {
        var options = {
            dateFormat: 'YYYY-MM-DD',
            dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
            timeFormat: 'HH:mm:ss',
        };

        if (!overrides) {
            return options;
        }

        for (var key in overrides) {
            if (overrides.hasOwnProperty(key) && options.hasOwnProperty(key)) {
                options[key] = overrides[key];
            }
        }

        return options;
    }

    function pickerClickHandler(picker, e) {
        var inputGroup = e.currentTarget.parentNode;

        // If popover is already visible for this picker then hide it
        if (picker.popover.parentNode === inputGroup.parentNode && picker.popover.style.display === 'block') {
            picker.popover.style.display = 'none';
            return;
        }

        picker.currentView = 0;

        // If picker is not already configured for this input
        if (picker.popover.parentNode !== inputGroup.parentNode) {
            // Add picker to DOM for this input
            inputGroup.parentNode.insertBefore(picker.popover, inputGroup.nextSibling);
        }

        configurePicker(picker, inputGroup);

        // Make picker visible
        picker.popover.style.display = 'block';

        picker.currentDateTime = moment(inputGroup.children[0].value);

        if (!picker.currentDateTime || !picker.currentDateTime.isValid()) {
            picker.currentDateTime = moment();
        }

        picker.views[picker.currentView].update(picker.currentDateTime);
    }

    function triggerCallbacks(picker) {
        for (var i = 0; i < picker.callbacks.length; i++) {
            picker.callbacks[i](picker.currentDateTime, picker.currentInput);
        }
    }

    function updateCallback(picker, dateTime) {
        picker.currentDateTime = dateTime;

        // If current view is only view or last view then close popover
        if ((picker.views.length === 1 || picker.currentView === (picker.views.length - 1)) &&
            picker.views[picker.currentView].closeOnUpdate) {
            picker.popover.style.display = 'none';
        } else if (picker.currentView < (picker.views.length - 1)) {
            picker.currentView += 1;
            renderView(picker, picker.views[picker.currentView]);
            picker.views[picker.currentView].update(picker.currentDateTime);
        }

        var format;

        // Get text format for datetime based on input type
        switch (picker.currentInput.getAttribute('data-type')) {
            case 'date':
                format = picker.options.dateFormat;
                break;

            case 'time':
                format = picker.options.timeFormat;
                break;

            default:
                format = picker.options.dateTimeFormat;
        }

        // Check for custom format specific to input
        var customFormat = picker.currentInput.getAttribute('data-format');

        // If input specifies custom format use it instead
        if (customFormat) {
            format = customFormat;
        }

        picker.currentInput.value = picker.currentDateTime.format(format);

        triggerCallbacks(picker);
    }

    function Picker(options) {
        this.options = overrideDefaults(options);
        this.popover = createPopover(this);
        this.views = [];
        this.callbacks = [];

        var self = this;

        this.dateView = new DateView(function (dateTime) {
            updateCallback(self, dateTime);
        });

        this.timeView = new TimeView(function (dateTime) {
            updateCallback(self, dateTime);
        });
    }

    Picker.prototype.addCallback = function (callback) {
        this.callbacks.push(callback);
    };

    Picker.prototype.auto = function () {
        this.bind('input[type="date"], input[type="datetime"], input[type="time"]');
    };

    Picker.prototype.bind = function (bindTo) {
        var inputs = getInputs(bindTo);
        var self = this;

        for (var i = 0; i < inputs.length; i++) {
            var icon,
                inputGroup;

            var input = inputs[i];

            // If input is not in an input group, put it inside an input group
            if (input.parentNode.className.indexOf('input-group') < 0) {
                inputGroup = util.el('div', 'input-group');
                input.parentNode.appendChild(inputGroup);
                inputGroup.appendChild(input);
            } else {
                inputGroup = input.parentNode;
            }

            switch (input.type) {
                case 'date':
                    input.setAttribute('data-type', 'date');
                    icon = 'calendar';
                    break;

                case 'time':
                    input.setAttribute('data-type', 'time');
                    icon = 'time';
                    break;

                default:
                    input.setAttribute('data-type', 'datetime');
                    icon = 'calendar';
            }

            // Change input type to text so browser doesn't try to implement its own picker
            input.type = 'text';

            //
            var inputGroupBtn = util.el('div', 'input-group-btn');
            inputGroup.appendChild(inputGroupBtn);

            var pickerBtn = util.el('button', 'btn btn-default');
            inputGroupBtn.appendChild(pickerBtn);

            inputGroupBtn.onclick = function (e) {
                e.preventDefault();
                pickerClickHandler(self, e);
            };

            var glyph = util.el('span', 'glyphicon glyphicon-' + icon);
            pickerBtn.appendChild(glyph);
        }
    };

    Picker.prototype.removeCallback = function (callback) {
        this.callbacks.remove(callback);
    };

    return Picker;
});

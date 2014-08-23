/**
 * @module TimeView
 * @returns {TimeView} picker view for times
 */
define([
    'moment',
    './util',
], function (
    moment,
    util
) {
    'use strict';

    var localeText = {
        DONE: 'Done',
        NOW: 'Now',
    };

    function createButton(timeView, dataId, additionalClassName, contents, clickHandler) {
        var button = util.el('a', 'btn btn-default');
        button.href = '#';

        if (additionalClassName) {
            button.className += ' ' + additionalClassName;
        }

        button.setAttribute('data-id', dataId);
        button.innerHTML = contents;
        button.onclick = function (e) {
            e.preventDefault();
            clickHandler(timeView, e);
        };

        return button;
    }

    function updateTime(timeView) {
        if (!timeView.dt || !timeView.dt.isValid()) {
            timeView.dt = moment();
        }

        timeView.dt.hour(timeView.hourInput.value);
        timeView.dt.minute(timeView.minuteInput.value);
        timeView.dt.second(timeView.secondInput.value);

        timeView.updateCallback(timeView.dt);
    }

    function doneClickHandler(timeView) {
        timeView.closeOnUpdate = true;
        timeView.updateCallback(timeView.dt);
        timeView.closeOnUpdate = false;
    }

    function downClickHandler(timeView, e) {
        var btn = e.currentTarget;
        var input = null;
        var max = 59;

        switch (btn.getAttribute('data-id')) {
            case 'hour-down-btn':
                input = timeView.hourInput;
                max = 23;
                break;

            case 'minute-down-btn':
                input = timeView.minuteInput;
                break;

            default: // second-down-btn
                input = timeView.secondInput;
        }

        var val = parseInt(input.value);

        if (isNaN(val) || val === 0) {
            input.value = max;
        } else {
            input.value = --val;
        }

        updateTime(timeView);
    }

    function upClickHandler(timeView, e) {
        var btn = e.currentTarget;
        var input = null;
        var max = 59;

        switch (btn.getAttribute('data-id')) {
            case 'hour-up-btn':
                input = timeView.hourInput;
                max = 23;
                break;

            case 'minute-up-btn':
                input = timeView.minuteInput;
                break;

            default: // second-up-btn
                input = timeView.secondInput;
        }

        var val = parseInt(input.value);

        if (isNaN(val) || val === max) {
            input.value = 0;
        } else {
            input.value = ++val;
        }

        updateTime(timeView);
    }

    function createNumericPicker(timeView, dataId) {
        var div = util.el('div', 'col-md-4 text-center');

        var upBtn = createButton(timeView, dataId + '-up-btn', '', '<span class="glyphicon glyphicon-chevron-up"></span>', upClickHandler);
        var downBtn = createButton(timeView, dataId + '-down-btn', '', '<span class="glyphicon glyphicon-chevron-down"></span>', downClickHandler);
        var input = util.el('input', 'form-control');
        input.maxLength = 2;
        input.setAttribute('data-id', dataId + '-input');

        div.appendChild(upBtn);
        div.appendChild(input);
        div.appendChild(downBtn);

        return div;
    }

    function nowClickHandler(timeView) {
        var now = moment();

        // If input already has a DateTime update date (keeping time the same)
        if (timeView.dt && timeView.dt.isValid()) {
            timeView.dt.hour(now.hour());
            timeView.dt.minute(now.minute());
            timeView.dt.second(now.second());
        // Otherwise set date and zero out time
        } else {
            timeView.dt = now;
            timeView.dt.hour(0);
            timeView.dt.minute(0);
            timeView.dt.second(0);
        }

        timeView.closeOnUpdate = true;
        timeView.updateCallback(timeView.dt);
        timeView.closeOnUpdate = false;
    }

    function updateUI(dateView, dateTime) {
        dateView.hourInput.value = dateTime.hour();
        dateView.minuteInput.value = dateTime.minute();
        dateView.secondInput.value = dateTime.second();
    }

    function TimeView(updateCallback) {
        this.icon = 'time';
        this.footerButton = createButton(this, 'now-btn', 'btn-xs', localeText.NOW, nowClickHandler);
        this.closeOnUpdate = false;

        var clearDiv = util.el('div', 'clearfix');

        var hourPicker = createNumericPicker(this, 'hour');
        var minutePicker = createNumericPicker(this, 'minute');
        var secondPicker = createNumericPicker(this, 'second');

        this.hourInput = hourPicker.children[1];
        this.minuteInput = minutePicker.children[1];
        this.secondInput = secondPicker.children[1];

        var doneBtn = util.el('a', 'btn btn-xs btn-default pull-right');
        doneBtn.href = '#';
        doneBtn.textContent = localeText.DONE;
        doneBtn.setAttribute('data-id', 'done-btn');

        var self = this;

        doneBtn.onclick = function (e) {
            e.preventDefault();
            doneClickHandler(self);
        };

        this.bodyContents = [
            hourPicker,
            minutePicker,
            secondPicker,
            doneBtn,
            clearDiv,
        ];

        this.titleContents = null;
        this.bodyDataId = 'time-content';
        this.updateCallback = updateCallback;
    }

    TimeView.prototype.update = function (datetime) {
        this.dt = datetime;

        updateUI(this, this.dt);
    };

    return TimeView;
});

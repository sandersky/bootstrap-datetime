/**
 * @module DateView
 * @returns {DateView} picker view for dates
 */
define([
    'moment',
], function (
    moment
) {
    'use strict';

    var localeText = {
        TODAY: 'Today',
    };

    function clearCalendar(dateView) {
        // Remove days from calendar
        while (dateView.tbody.firstChild) {
            dateView.tbody.removeChild(dateView.tbody.firstChild);
        }
    }

    function createButton(dataId, contents, clickHandler) {
        var button = document.createElement('a');
        button.href = '#';
        button.className = 'btn btn-xs btn-default';
        button.setAttribute('data-id', dataId);
        button.innerHTML = contents;
        button.onclick = clickHandler;

        return button;
    }

    function createCalendar(dateView) {
        var th;
        var table = document.createElement('table');
        var thead = document.createElement('thead');
        var theadTr = document.createElement('tr');
        dateView.tbody = document.createElement('tbody');

        table.className = 'table table-condensed table-striped';

        table.appendChild(thead);
        thead.appendChild(theadTr);
        table.appendChild(dateView.tbody);

        var weekdays = moment.weekdaysShort();

        for (var i = 0; i < weekdays.length; i++) {
            th = document.createElement('th');
            th.innerHTML = weekdays[i];
            theadTr.appendChild(th);
        }

        return table;
    }

    function dayClickHandler(dateView, e) {
        e.preventDefault();

        // Update current datetime to be current visible month and year
        dateView.currentDateTime = dateView.visibleDateTime;

        // Update current datetime to be date clicked
        dateView.currentDateTime.date(parseInt(e.currentTarget.innerHTML));

        dateView.updateCallback(dateView.currentDateTime);
    }

    function updateHeader(dateView, dateTime) {
        dateView.header.innerHTML = moment.months()[dateTime.month()] + ' ' + dateTime.year();
    }

    function updateUI(dateView, dateTime) {
        dateView.visibleDateTime = moment(dateTime);

        updateHeader(dateView, dateTime);
        clearCalendar(dateView);

        var tr = document.createElement('tr');
        dateView.tbody.appendChild(tr);

        var dayCount,
            i,
            link,
            td;

        var firstOfMonth = moment(dateTime).startOf('month').day();
        var lastOfMonth = moment(dateTime).endOf('month');

        for (dayCount = 0; dayCount < firstOfMonth; dayCount++) {
            tr.appendChild(document.createElement('td'));
        }

        var currentMonthAndYear = dateView.currentDateTime.month() === dateView.visibleDateTime.month() &&
                                  dateView.currentDateTime.year() === dateView.visibleDateTime.year();

        for (i = 0 ; i < lastOfMonth.date(); i++) {
            if (dayCount === 7) {
                tr = document.createElement('tr');
                dateView.tbody.appendChild(tr);
                dayCount = 0;
            }

            td = document.createElement('td');
            link = document.createElement('a');
            link.href = '#';
            link.innerHTML = i + 1;
            link.onclick = function (e) {
                dayClickHandler(dateView, e);
            };

            if (currentMonthAndYear && (i + 1) === dateTime.date()) {
                link.className = 'btn btn-xs btn-default active';
            }

            td.appendChild(link);
            tr.appendChild(td);

            dayCount++;
        }

        for (i = lastOfMonth.day(); i < 6; i++) {
            tr.appendChild(document.createElement('td'));
            dayCount++;
        }
    }

    function nextMonthClickHandler(dateView) {
        updateUI(dateView, dateView.visibleDateTime.add(1, 'months'));
    }

    function previousMonthClickHandler(dateView) {
        updateUI(dateView, dateView.visibleDateTime.subtract(1, 'months'));
    }

    function todayClickHandler(dateView) {
        var now = moment();

        // If input already has a DateTime update time (keeping date the same)
        if (dateView.currentDateTime && dateView.currentDateTime.isValid()) {
            dateView.currentDateTime.date(now.date());
            dateView.currentDateTime.month(now.month());
            dateView.currentDateTime.year(now.year());
        // Otherwise set date and time to now
        } else {
            dateView.currentDateTime = now;
        }

        dateView.updateCallback(dateView.currentDateTime);
    }

    function DateView(updateCallback) {
        var self = this;

        this.footerButton = createButton('today-btn', localeText.TODAY, function (e) {
            e.preventDefault();
            todayClickHandler(self);
        });
        this.icon = 'calendar';
        this.updateCallback = updateCallback;
        this.closeOnUpdate = true;

        this.header = document.createElement('h3');
        this.header.className = 'panel-title';

        this.titleContents = [
            createButton('previous-btn', '<span class="glyphicon glyphicon-chevron-left"></span>', function (e) {
                e.preventDefault();
                previousMonthClickHandler(self);
            }),
            this.header,
            createButton('next-btn', '<span class="glyphicon glyphicon-chevron-right"></span>', function (e) {
                e.preventDefault();
                nextMonthClickHandler(self);
            }),
        ];

        this.bodyContents = [
            createCalendar(self),
        ];

        this.bodyDataId = 'date-content';
    }

    DateView.prototype.update = function (dateTime) {
        this.currentDateTime = dateTime;

        updateUI(this, this.currentDateTime);
    };

    return DateView;
});

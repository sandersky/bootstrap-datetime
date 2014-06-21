(function () {

  var currentDate,
      currentInput,
      month,
      popover,
      popoverInput,
      tbody,
      title,
      year;

  var dateFormat = 'YYYY-MM-DD';
  var dateTimeFormat = 'YYYY-MM-DD HH:mm:ss';
  var timeFormat = 'HH:mm:ss';

  // Add textEquals selector to jQuery
  jQuery.expr[':'].textEquals = function(a, i, m) {
    return jQuery(a).text().match("^" + m[3] + "$");
  };

  // Add ability to left pad strings
  String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
  };

  var done = 'Done';
  var now = 'Now';
  var today = 'Today';

  function bindEvents() {
    // Bind click events to calendar buttons
    popover.find('[data-id="previous-btn"]').click(previousMonthClickHandler);
    popover.find('[data-id="next-btn"]').click(nextMonthClickHandler);
    popover.find('[data-id="today-btn"]').click(todayClickHandler);
    popover.find('[data-id="done-btn"]').click(doneClickHandler);
    popover.find('[data-id="hour-up-btn"], [data-id="minute-up-btn"], [data-id="second-up-btn"]').click(numericUpClickHandler);
    popover.find('[data-id="hour-input"], [data-id="minute-input"], [data-id="second-input"]').change(numericChangeHandler);
    popover.find('[data-id="hour-down-btn"], [data-id="minute-down-btn"], [data-id="second-down-btn"]').click(numericDownClickHandler);
    popover.find('[data-id="now-btn"]').click(nowClickHandler);
    popover.find('[data-id="date-btn"]').click(dateClickHandler);
    popover.find('[data-id="time-btn"]').click(timeClickHandler);
  }

  function buildCalendar(date) {
    popover.find('[data-id="time-btn"]').removeClass('active');
    popover.find('[data-id="date-btn"]').addClass('active');
    popover.find('[data-id="time-content"], [data-id="now-btn"]').hide();
    popover.find('.popover-title, [data-id="date-content"], [data-id="today-btn"]').show();

    month = date.month();
    year = date.year();

    // Get first of month
    var firstDayOfMonth = moment(date).startOf('month');

    // Get last day of month
    var lastDayOfMonth = moment(date).endOf('month');

    // Set title of popover to month and year
    title.text(moment.months()[month] + ' ' + year);

    var i;
    var dayCount = 0;
    var tableContent = '<tr>';

    for (i = 0; i < firstDayOfMonth.day(); i++) {
      tableContent += '<td></td>';
      dayCount++;
    }

    for (i = 0 ; i < lastDayOfMonth.date(); i++) {
      if (dayCount == 7) {
        tableContent += '</tr><tr>';
        dayCount = 0;
      }
      active = month === currentDate.month() && year === currentDate.year() && (i + 1) === currentDate.date() ? 'btn btn-xs btn-default active' : '';
      tableContent += '<td><a class="' + active + '" href="#">' + (i + 1) + '</a></td>';
      dayCount++;
    }

    for (i = lastDayOfMonth.day(); i < 6; i++) {
      tableContent += '<td></td>';
      dayCount++;
    }

    tableContent += '</tr>';

    tbody.html(jQuery(tableContent));

    tbody.find('a').click(dayClickHandler);
  }

  function buildPopover() {
    // Create DateTime popover
    popover = jQuery(
      '<div class="popover bottom datetime-popover">' +
        '<div class="arrow"></div>' +
        '<div class="popover-title text-center">' +
          '<a data-id="previous-btn" class="btn btn-xs btn-default" href="#"><span class="glyphicon glyphicon-chevron-left"></span></a>' +
          '<h3 class="panel-title">' +
          '</h3>' +
          '<a data-id="next-btn" class="btn btn-xs btn-default" href="#"><span class="glyphicon glyphicon-chevron-right"></span></a>' +
        '</div>' +
        '<div data-id="date-content" class="popover-content">' +
          '<table class="table table-condensed table-striped">' +
            '<thead>' +
              '<tr>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
        '<div data-id="time-content" class="popover-content">' +
          '<div class="col-md-4 text-center">' +
            '<button class="btn btn-default" data-id="hour-up-btn"><span class="glyphicon glyphicon-chevron-up"></span></button>' +
            '<input class="form-control" data-id="hour-input" maxlength="2">' +
            '<button class="btn btn-default" data-id="hour-down-btn"><span class="glyphicon glyphicon-chevron-down"></span></button>' +
          '</div>' +
          '<div class="col-md-4 text-center">' +
            '<button class="btn btn-default" data-id="minute-up-btn"><span class="glyphicon glyphicon-chevron-up"></span></button>' +
            '<input class="form-control" data-id="minute-input" maxlength="2">' +
            '<button class="btn btn-default" data-id="minute-down-btn"><span class="glyphicon glyphicon-chevron-down"></span></button>' +
          '</div>' +
          '<div class="col-md-4 text-center">' +
            '<button class="btn btn-default" data-id="second-up-btn"><span class="glyphicon glyphicon-chevron-up"></span></button>' +
            '<input class="form-control" data-id="second-input" maxlength="2">' +
            '<button class="btn btn-default" data-id="second-down-btn"><span class="glyphicon glyphicon-chevron-down"></span></button>' +
          '</div>' +
          '<button class="btn btn-default btn-xs pull-right" data-id="done-btn">' + done + '</button>' +
          '<div class="clearfix"></div>' +
        '</div>' +
        '<div class="panel-footer">' +
          '<a data-id="today-btn" class="btn btn-xs btn-default" href="#">' + today + '</a>' +
          '<a data-id="now-btn" class="btn btn-xs btn-default" href="#">' + now + '</a>' +
          '<div data-id="datetime-btns" class="btn-group btn-group-xs pull-right">' +
            '<a data-id="date-btn" class="btn btn-default active" href="#"><span class="glyphicon glyphicon-calendar"></span></a>' +
            '<a data-id="time-btn" class="btn btn-default" href="#"><span class="glyphicon glyphicon-time"></span></a>' +
          '</div>' +
          '<div class="clearfix"></div>' +
        '</div>' +
      '</div>');

    // Create table header with names of days
    var theadTr = popover.find('.popover-content > table > thead > tr');
    for (var i in moment.weekdaysShort()) {
      theadTr.append(jQuery('<th>' + moment.weekdaysShort()[i] + '</th>'));
    }

    title = popover.find('.panel-title');
    tbody = popover.find('.popover-content > table > tbody');

    // Bind events to popover
    bindEvents();
  }

  function buildTime(date) {
    popover.find('[data-id="date-btn"]').removeClass('active');
    popover.find('[data-id="time-btn"]').addClass('active');
    popover.find('.popover-title, [data-id="date-content"], [data-id="today-btn"]').hide();
    popover.find('[data-id="time-content"], [data-id="now-btn"]').show();

    // If current date not set get value of current input
    if (!currentDate) {
      currentDate = moment(currentInput.val());
    }

    // If we do not have a valid current date use current Date/Time
    if (!currentDate.isValid()) {
      currentDate = moment();
    }

    jQuery('[data-id="hour-input"]').val(currentDate.hour());
    jQuery('[data-id="minute-input"]').val(currentDate.minute());
    jQuery('[data-id="second-input"]').val(currentDate.second());
  }

  function dateClickHandler(e) {
    e.preventDefault();

    // Get calendar button
    var calendarBtn = jQuery(this);

    // If calendar is already present no need to continue
    if (calendarBtn.hasClass('active')) {
      return;
    }

    buildCalendar(currentDate);

    // Make sure calendar button is not shown as active
    calendarBtn.siblings('.active').removeClass('active');

    // Make calendar button appear as active
    calendarBtn.addClass('active');
  }

  function dayClickHandler(e) {
    e.preventDefault();

    var day = parseInt(jQuery(this).text());
    var date = moment(year + '-' + (month + 1).toString().lpad('0', 2) + '-' + day.toString().lpad('0', 2));

    updateCalendar(date);
  }

  function doneClickHandler(e) {
    e.preventDefault();

    var date = moment();

    date.hour(jQuery('[data-id="hour-input"]').val());
    date.minute(jQuery('[data-id="minute-input"]').val());
    date.second(jQuery('[data-id="second-input"]').val());

    updateTime(date);
  }

  function hideDateTimeButtons() {
    popover.find('[data-id="datetime-btns"]').hide();
  }

  function hidePopover() {
    // Remove popover from DOM
    popover.detach();
    popoverInput = null;
    currentDate = null;
  }

  function nextMonthClickHandler(e) {
    e.preventDefault();

    var m = month + 2;
    var y = year;

    if (month === 12) {
      y++;
      m = 0;
    }

    var date = moment(y.toString().lpad('0', 4) + '-' + m.toString().lpad('0', 2) + '-' + '01');

    buildCalendar(date);
  }

  function nowClickHandler(e) {
    e.preventDefault();

    // Get current DateTime
    var date = moment();

    updateTime(date);
  }

  function numericChangeHandler() {
    var input = jQuery(this);
    input.val(input.val().match(/\d*\.?\d+/));
  }

  function numericDownClickHandler(e) {
    e.preventDefault();

    var btn = jQuery(this);
    var input = null;
    var max = 59;

    switch (btn.data('id')) {
      case 'hour-down-btn':
        input = jQuery('[data-id="hour-input"]');
        max = 24;
        break;
      case 'minute-down-btn':
        input = jQuery('[data-id="minute-input"]');
        break;
      default: // second-down-btn
        input = jQuery('[data-id="second-input"]');
    }

    var val = parseInt(input.val());
    if (isNaN(val) || val === 0) {
      input.val(max);
    } else {
      input.val(--val);
    }
  }

  function numericUpClickHandler(e) {
    e.preventDefault();

    var btn = jQuery(this);
    var input = null;
    var max = 60;

    switch (btn.data('id')) {
      case 'hour-up-btn':
        input = jQuery('[data-id="hour-input"]');
        max = 24;
        break;
      case 'minute-up-btn':
        input = jQuery('[data-id="minute-input"]');
        break;
      default: // second-up-btn
        input = jQuery('[data-id="second-input"]');
    }

    var val = parseInt(input.val());
    if (isNaN(val) || val === max) {
      input.val(0);
    } else {
      input.val(++val);
    }
  }

  function popoverHandler() {
    // If popover hasn't been built yet then build it
    if (!popover) {
      buildPopover();
    }

    var inputBtn = jQuery(this);
    currentInput = inputBtn.parent().prev();

    if (popoverInput && this === popoverInput) {
      hidePopover();
      return;
    }

    popoverInput = this;

    currentInput.parent().after(popover);

    var date = moment(currentInput.val());

    // If date is invalid default to today
    if (!date.isValid()) {
      date = moment();
    }

    currentDate = date;

    // Build calendar based on date
    presentInput(date);

    // Show DateTime picker
    popover.show();
  }

  function presentInput(date) {
    switch (currentInput.data('type')) {
      case 'date':
        hideDateTimeButtons();
        buildCalendar(date);
        break;
      case 'time':
        hideDateTimeButtons();
        buildTime(date);
        break;
      default:
        showDateTimeButtons();
        buildCalendar(date);
    }
  }

  function previousMonthClickHandler(e) {
    e.preventDefault();

    var m = month;
    var y = year;

    if (month == -1) {
      y--;
      m = 11;
    }

    var date = moment(y.toString().lpad('0', 4) + '-' + m.toString().lpad('0', 2) + '-' + '01');

    buildCalendar(date);
  }

  function showDateTimeButtons() {
    popover.find('[data-id="datetime-btns"]').show();
  }

  function timeClickHandler(e) {
    e.preventDefault();

    // Get time button
    var timeBtn = jQuery(this);

    // If time is already present no need to continue
    if (timeBtn.hasClass('active')) {
      return;
    }

    buildTime(currentDate);

    // Make sure calendar button is not shown as active
    timeBtn.siblings('.active').removeClass('active');

    // Make time button appear as active
    timeBtn.addClass('active');
  }

  function todayClickHandler(e) {
    e.preventDefault();

    // Get current DateTime
    var date = moment();

    updateCalendar(date);
  }

  function updateCalendar(date) {
    // Get DateTime from input
    var previousDate = moment(currentInput.val());

    // If input already has a DateTime value keep time the same
    if (previousDate.isValid()) {
      date.hour(previousDate.hour());
      date.minute(previousDate.minute());
      date.second(previousDate.second());
    // Otherwise zero out time
    } else {
      date.hour(0);
      date.minute(0);
      date.second(0);
    }

    currentDate = date;

    // Update input value
    switch (currentInput.data('type')) {
      case 'date':
        currentInput.val(date.format(dateFormat));
        break;
      case 'time':
        currentInput.val(date.format(timeFormat));
        break;
      default:
        currentInput.val(date.format(dateTimeFormat));
    }

    // Remove active class from previously selected day
    tbody.find('.active').removeClass('active');

    // Add active class to newly selected day
    tbody.find('a:textEquals("' + date.date() + '")').addClass('active');

    if (currentInput.data('type') === 'date') {
      hidePopover();
    } else {
      buildTime(currentDate);
    }
  }

  function updateTime(date) {
    if (!currentDate) {
      currentDate = moment(currentInput.val());
    }

    // If a date has been set lets make sure to keep it
    if (currentDate.isValid()) {
      currentDate.hour(date.hour());
      currentDate.minute(date.minute());
      currentDate.second(date.second());
      date = currentDate;
    }

    // Update input value
    switch (currentInput.data('type')) {
      case 'time':
        currentInput.val(date.format(timeFormat));
        break;
      default:
        currentInput.val(date.format(dateTimeFormat));
    }

    hidePopover();
  }

  // Bootstrap DateTime object with public methods
  bootstrapDateTime = {

    // Add picker to all date, datetime, and time inputs currently in DOM
    auto: function () {
      bootstrapDateTime.bind('input[type="date"], input[type="datetime"], input[type="time"]');
    },

    // Add picker to inputs based on a given jQuery selector
    bind: function (bindTo) {
      var inputs;

      // If bindTo is a string treat it as a jQuery selector
      if (typeof bindTo === 'string') {
        inputs = jQuery(bindTo);

      // If bindTo is a jQuery object
      } else if (bindTo instanceof jQuery) {
        inputs = bindTo;

      // If bindTo is null no reason to continue
      } else if (bindTo === null) {
        return;

      // If bindTo is a DOM element get it as jQuery object
      } else if (bindTo.hasOwnProperty('nodeType')) {
        inputs = jQuery(bindTo);

      // If bindTo is something else throw exception
      } else {
          throw 'Unknown type to bind to';
      }

      // Setup each input one by one
      inputs.each(function (i, input) {
        input = jQuery(input);

        var alreadyPicker = false;
        input.parent().find('button').each(function (i, el) {
            // Get events for button
            var events = jQuery._data(el, 'events');

            // If button has click events, look for popover handler
            if (events && 'click' in events) {
                for (var j = 0; j < events.click.length; j++) {
                    if (events.click[j].handler === popoverHandler) {
                        alreadyPicker = true;
                        return;
                    }
                }
            }
        });

        if (alreadyPicker) {
            return;
        }

        // If input is not in an input group, put it inside an input group
        if (!input.parent().hasClass('input-group')) {
          input.wrap('<div class="input-group"></div>');
        }

        var icon;

        switch (input.attr('type')) {
          case 'date':
            input.data('type', 'date');
            icon = 'calendar';
            break;
          case 'time':
            input.data('type', 'time');
            icon = 'time';
            break;
          default:
            input.data('type', 'datetime');
            icon = 'calendar';
        }

        // Add picker button to input group
        input.after(jQuery(
          '<div class="input-group-btn">' +
            '<button class="btn btn-default" type="button">' +
              '<span class="glyphicon glyphicon-' + icon + '"></span>' +
            '</button>' +
          '</div>'
        ));

        // Bind click event to picker button
        input.parent().find('button').click(popoverHandler);
      });

      // Change type of inputs to text to prevent browser from implementing its own pickers
      inputs.attr('type', 'text');
    }

  };

  // Make Bootstrap DateTime global
  window.bootstrapDateTime = bootstrapDateTime;

  return bootstrapDateTime;

})();

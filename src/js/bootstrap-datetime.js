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

  var today = 'Today';

  function bindPicker() {
    // Get all Date and DateTime inputs
    var inputs = jQuery('input[type="date"], input[type="datetime"], input[type="time"]');
      inputs.wrap('<div class="input-group"></div>');

    inputs.each(function (i, input) {
      input = jQuery(input);

      var inputBtn;

      switch (input.attr('type')) {
        case 'date':
          input.data('type', 'date');
          inputBtn = '<button class="btn btn-default" type="button"><span class="glyphicon glyphicon-calendar"></span></button>';
          break;
        case 'time':
          input.data('type', 'time');
          inputBtn = '<button class="btn btn-default" type="button"><span class="glyphicon glyphicon-time"></span></button>';
          break;
        default:
          input.data('type', 'datetime');
          inputBtn = '<button class="btn btn-default" type="button"><span class="glyphicon glyphicon-calendar"></span></button>';
      }

      input.after(jQuery('<div class="input-group-btn">' + inputBtn + '</div>'));
      input.parent().find('button').click(popoverHandler);
    });

    // Change type to text to prevent browser implemented pickers
    inputs.attr('type', 'text');
  }

  function buildCalendar(date) {
    popover.find('[data-id="time-btn"]').removeClass('active');
    popover.find('[data-id="date-btn"]').addClass('active');
    popover.find('[data-id="time-content"]').hide();
    popover.find('[data-id="date-content"]').show();

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
      active = month === currentDate.month() && year === currentDate.year() && (i + 1) === currentDate.date() ? ' active' : '';
      tableContent += '<td><a class="btn btn-xs btn-default' + active + '" href="#">' + (i + 1) + '</a></td>';
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
        '</div>' +
        '<div class="panel-footer">' +
          '<a data-id="today-btn" class="btn btn-xs btn-default" href="#">' + today + '</a>' +
          '<div data-id="datetime-btns" class="btn-group btn-group-xs pull-right">' +
            '<a data-id="date-btn" class="btn btn-default active" href="#"><span class="glyphicon glyphicon-calendar"></span></a>' +
            '<a data-id="time-btn" class="btn btn-default" href="#"><span class="glyphicon glyphicon-time"></span></a>' +
          '</div>' +
        '</div>' +
      '</div>');

    // Bind click events to calendar buttons
    popover.find('[data-id="previous-btn"]').click(previousMonthClickHandler);
    popover.find('[data-id="next-btn"]').click(nextMonthClickHandler);
    popover.find('[data-id="today-btn"]').click(todayClickHandler);
    popover.find('[data-id="date-btn"]').click(dateClickHandler);
    popover.find('[data-id="time-btn"]').click(timeClickHandler);

    // Create table header with names of days
    var theadTr = popover.find('.popover-content > table > thead > tr');
    for (var i in moment.weekdaysShort()) {
      theadTr.append(jQuery('<th>' + moment.weekdaysShort()[i] + '</th>'));
    }

    title = popover.find('.panel-title');
    tbody = popover.find('.popover-content > table > tbody');
  }

  function buildTime(date) {
    popover.find('[data-id="date-btn"]').removeClass('active');
    popover.find('[data-id="time-btn"]').addClass('active');
    popover.find('[data-id="date-content"]').hide();
    popover.find('[data-id="time-content"]').show();
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

  function hideDateTimeButtons() {
    popover.find('[data-id="datetime-btns"]').hide();
  }

  function hidePopover() {
    popover.hide();
    popoverInput = null;
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

  function popoverHandler() {
    currentInput = jQuery(this).parent().prev();

    if (popoverInput && this === popoverInput) {
      hidePopover();
      return;
    }

    popoverInput = this;

    currentInput.before(popover);

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

    hidePopover();
  }

  buildPopover();

  jQuery(function () {
    // Add DateTime popover to DOM
    jQuery('body').append(popover);

    // Bind DateTime picker to Date and DateTime inputs
    bindPicker();
  });

})();

describe('datetime input', function () {
  'use strict';

  var input;

  // Setup each test
  beforeEach(function () {
    // Create datetime input and add it to DOM
    input = jQuery('<input type="datetime">');
    jQuery('body').append(input);

    // Add DateTime picker
    bootstrapDateTime.auto();
  });

  // Cleanup after each test
  afterEach(function () {
    // Remove input group button
    input.siblings('.input-group-btn').remove();

    // Remove input
    input.remove();
  });

  it('should have input group button div next to input', function () {
    var next = input.next();
    expect(next.attr('class')).toMatch('input-group-btn');
  });

  it('should have button within input group button div', function () {
    var button = input.next().find('> .btn');
    expect(button.attr('class')).toMatch('btn btn-default');
  });

  it('should have calendar glypicon within button', function () {
    var glyphicon = input.next().find('> .btn > .glyphicon');
    expect(glyphicon.attr('class')).toBe('glyphicon glyphicon-calendar');
  });

});

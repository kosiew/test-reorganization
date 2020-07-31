var months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const NUMBER = 123;

function monthNumToName(monthnum) {
  return months[monthnum - 1] || '';
}

function saDateToDateString(argument) {
  argument = argument.strip();
  items = argument.split('-');
  yearNumber = items[0];
  monthNumber = items[1];
  dayNumber = items[2];

  monthString = monthNumToName(parseInt(monthNumber));

  var result = dayNumber;
  result += ' ' + monthString + ',';
  result += ' ' + yearNumber;
  return result;
}

QUnit.test('test saDateToDateString', function(assert) {
  var testDate = '2019-11-27';
  assert.strictEqual(
    saDateToDateString(testDate),
    '27 November, 2019',
    'Passed!'
  );
  var testDate = '2019-1-27';
  assert.strictEqual(
    saDateToDateString(testDate),
    '27 January, 2019',
    'Passed!'
  );
});

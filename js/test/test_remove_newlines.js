const testBlock = `line1
line2
line3`;

function removeNewLines(blockOfText) {
  let lines = blockOfText.split('\n');

  let newBlock = lines.join(' ');
  return newBlock;
}

QUnit.test('test removeNewLines', function(assert) {
  let expectedAnswer = 'line1 line2 line3';
  assert.notEqual(testBlock, expectedAnswer, 'Passed initial testBlock');

  assert.strictEqual(
    removeNewLines(testBlock),
    expectedAnswer,
    'Passed removeNewLines'
  );
});

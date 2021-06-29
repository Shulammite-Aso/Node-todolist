const date = require('../date');

test('Title of the page', async () => {
    const day = date.getDay();
    expect(day).toBe('Tuesday');

  });
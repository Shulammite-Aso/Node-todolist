test('Title of the page', async () => {
    const title = await page.title();
    expect(title).toBe('todo list');

  });
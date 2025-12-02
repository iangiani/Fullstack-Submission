Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', '/api/login', { username, password }).then(({ body }) => {
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(body));
    cy.visit('/');
  });
});

Cypress.Commands.add('createBlog', ({ title, author, url, likes = 0 }) => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
  const user = JSON.parse(loggedUserJSON);

  cy.request({
    method: 'POST',
    url: '/api/blogs',
    body: { title, author, url, likes },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  cy.visit('/');
});

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Test User',
      username: 'ttt',
      password: 'onerttt'
    }
    const user2 = {
      name: 'Test User2',
      username: 'tttt',
      password: 'onertttt',
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.request('POST', 'http://localhost:3003/api/users', user2)
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.get('#username')
    cy.get('#password')
    cy.get('#login-button')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('ttt')
      cy.get('#password').type('onerttt')
      cy.get('#login-button').click()
      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('ttt')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
      cy.get('html').should('not.contain', 'Test User logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({
        username: 'ttt',
        password: 'onerttt'
      })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('#title').type('Cypress created blog')
      cy.get('#author').type('Cypress Author')
      cy.get('#url').type('http://cypress-blog.com')
      cy.get('#create-blog-button').click()
      cy.contains('Cypress created blog Cypress Author')
    })

    describe('A blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Blog exist',
          author: 'YYYY',
          url: 'http://test.com',
          likes: 12
        })
      })

      it('user can like a blog', function () {
        cy.contains('Blog exist')
          .contains('view')
          .click()
        cy.contains('Blog exist')
          .parent()
          .parent()
          .as('blog')
        cy.get('@blog').find('.likes-count').should('contain', '12')
        cy.get('@blog').find('.like-button').click()
        cy.get('@blog').find('.likes-count').should('contain', '13')
      })

      it('creator can delete their blog', function () {
        cy.contains('Blog exist')
          .contains('view')
          .click()
        cy.contains('Blog exist')
          .parent()
          .parent()
          .as('blog')
        cy.get('@blog').find('.remove-button').click()
        cy.get('html').should('not.contain', 'Blog exist')
      })
    })

    describe('Blogs', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'First blog',
          author: 'LZYYMH',
          url: 'http://test1.com',
          likes: 99
        })
        cy.createBlog({
          title: 'Second blog',
          author: 'LZYYY',
          url: 'http://test2.com',
          likes: 21
        })
        cy.createBlog({
          title: 'Third blog',
          author: 'YMHYY',
          url: 'http://test3.com',
          likes: 12
        })
      })

      it('only the creator can see the delete button', function () {
        cy.contains('First blog').parent().contains('view').click()
        cy.contains('Second blog').parent().contains('view').click()
        cy.contains('Third blog').parent().contains('view').click()
        cy.contains('First blog')
          .parent()
          .parent()
          .find('.remove-button')
        cy.contains('logout').click()
        cy.login({ username: 'tttt', password: 'onertttt' })
        cy.contains('First blog').parent().contains('view').click()
        cy.contains('First blog')
          .parent()
          .parent()
          .should('not.contain', 'remove')
      })

      it('blogs are ordered by likes', function () {
        cy.contains('First blog').parent().contains('view').click()
        cy.contains('Second blog').parent().contains('view').click()
        cy.contains('Third blog').parent().contains('view').click()
        cy.get('.blog').eq(0).should('contain', 'First blog')
        cy.get('.blog').eq(1).should('contain', 'Second blog')
        cy.get('.blog').eq(2).should('contain', 'Third blog')
      })
    })
  })
})
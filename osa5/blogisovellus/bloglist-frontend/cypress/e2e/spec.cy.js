require('events').EventEmitter.defaultMaxListeners = 20;
describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'ruutti',
      username: 'root',
      password: 'sekret'
    }
    const user2 = {
      name: 'user2',
      username: 'user2',
      password: 'sekret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Username')
    cy.contains('Password')
    cy.contains('Login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.login({ username: 'root', password: 'sekret' })
      cy.contains('ruutti logged in')
    })
    
    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('väärin')
      cy.get('#loginButton').click()
      cy.get('#errorNotification')
        .should('contain', 'Wrong username or password')
      cy.contains('ruutti logged in').should('not.exist')
      /**
       * Shouldin käyttö on jonkin verran "hankalampaa" kuin komennon contains,
       * mutta se mahdollistaa huomattavasti monipuolisemmat testit kuin pelkän
       * tekstisisällön perusteella toimiva contains. 
       * i.e. be.visible, be.disabled, have.length, have.css, have.class, have.attr, have.value
       * be.checked etc.
       */
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'root', password: 'sekret' })
      cy.createBlog({ 
        title: 'Test blog',
        author: 'Test author',
        url: 'http://test.com'
      })
    })

    it('A blog can be created', function() {
      cy.get('#blogTitleSpan').contains('Test blog')
    })

    it('A blog can be liked', function() {
      cy.contains('View details').click()
      cy.get('#likeButton').click()
      cy.contains('Likes: 1')
    })

    it('A blog can be removed', function() {
      cy.contains('View details').click()
      cy.get('#removeButton').click()
      cy.get('#blogTitleSpan').should('not.exist')
    })
    
    it('Only the creator can remove a blog', function() {
      cy.contains('Logout').click()
      cy.login({ username: 'user2', password: 'sekret' })

      cy.contains('View details').click()
      cy.get('#removeButton').should('not.exist')
    })

    it('Blogs are ordered by likes', function() {
      cy.createBlog({ 
        title: 'Kakkosbloginen',
        author: 'Kakkoskirjoittaja',
        url: 'http://test.com',
        likes: 3
      })

      // haetaan kaikki details-napit ja klikataan niistä toista
      cy.get('.detailsButton').eq(1).click()
      // Ainoastaan yksi like-nappi on näkyvissä, joten voidaan klikata sitä
      // ketjutetaan then, jotta voidaan varmistaa, että painallus onnistui ennen tarkistusta
      cy.get('.likeButton').click()
        .then(() => {
          cy.get('.blog').eq(0).contains('Kakkosbloginen')
        })
    })
  })
})
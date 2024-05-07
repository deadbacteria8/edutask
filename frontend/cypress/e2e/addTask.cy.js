describe('Logging into the system', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user

  before(function () {
    // create a fabricated user from a fixture
    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email
        })
      })

  })

  beforeEach(function () {
    cy.visit('/')
    cy.get('#email').type(email)
    cy.get('form').submit()
    cy.get('h1').should('contain.text', 'Your tasks, ' + name)
  })

  it('should add task', () => {
    cy.get('#title').type('MyTask')
    cy.get('#url').type('https://www.youtube.com/watch?v=frDF4ikIQB4&ab_channel=TheUrbanRescueRanch')
    cy.get('form').submit()
    // round about way of checking that task was added
    cy.get('.container').find('.container-element').should('have.length.above', 1)
  })

  it('should open task popup', () => {
    cy.get('.container-element').first().click()
    cy.get('.popup').should('be.visible')
  })

  it('should add todo-item', () => {
    cy.get('.container-element').first().click()
    cy.get('.popup').should('be.visible')

    cy.get('.todo-list').find('input[type="text"]').type('New tooodoo item')
    cy.get('.todo-list').find('input[type="submit"]').click()
    cy.get('.todo-list').should('contain', 'New tooodoo item')
  })

  it('todo list should remain unchanged after adding task with no text desc', () => {
    cy.get('.container-element').first().click();
    cy.get('.popup').should('be.visible');
  
    // gets initial state
    cy.get('.todo-list').then($element => {
      const initialState = $element.text();
      cy.get('.todo-list').find('input[type="submit"]').should('be.disabled');
      cy.get('.todo-list').find('input[type="submit"]').click({ force: true });

      cy.get('.todo-list').invoke('text').should('equal', initialState);
    });
  });

  after(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})
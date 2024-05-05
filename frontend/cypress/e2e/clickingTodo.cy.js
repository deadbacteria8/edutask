describe('Logging into the system', () => {
  // define variables that we need on multiple occasions
  let user = {
    id : null
  }
  let task = {
    id : null
  }
  let activeItem = {
    id : null
  }
  let notActiveItem = {
    id : null
  }
  before(function () {

    //those functions does not explicitly need to be present here but i did so because i didnt feel like i had a better place to put them
    function createUser() {
      return cy.fixture('user.json').then((userJson) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: userJson
        }).then((response) => {
          user = {
            id : response.body._id.$oid,
            name : userJson.firstName + ' ' + userJson.lastName,
            email : userJson.email
          };
          return response.body._id.$oid;
        });
      });
    }

    function createTask(user_id) {
      return cy.fixture('task.json').then((taskJson) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/tasks/create',
          form: true,
          body: { ...taskJson, userid: user_id }
        }).then((response) => {
            task = {
              id : response.body._id.$oid,
              taskTitle : taskJson.title
            };
            return response.body._id.$oid;
        });
      });
    }

    function createActiveItem(taskid) {
      return cy.fixture('ItemActive.json').then((itemJson) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/todos/create',
          form: true,
          body: { ...itemJson, taskid: taskid }
        }).then((response) => {
            activeItem = {
              id: response.body._id.$oid
            };
            return response.body._id.$oid;
        });
      });
    }

    function createNotActiveItem(taskid) {
      return cy.fixture('ItemNotActive.json').then((itemJson) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/todos/create',
          form: true,
          body: { ...itemJson, taskid: taskid}
        }).then((response) => {
            notActiveItem = {
              id: response.body._id.$oid
            };
            return response.body._id.$oid;
        });
      });
    }

    cy.wrap(createUser()).then((uid) => {
      cy.wrap(createTask(uid)).then((taskid) => {
        cy.wrap(createActiveItem(taskid)).then(() => {
          cy.wrap(createNotActiveItem(taskid)).then(() => {
          });
        });
      });
    });
  })

  beforeEach(function () {
    cy.visit('/')
    cy.get('#email').type(email)
    cy.get('form').submit()
    cy.get('h1').should('contain.text', 'Your tasks, ' + user.name)
  })

  it('click checked', () => {
    cy.contains('.todo-item', 'Watch video')
    .find('.checker.unchecked')
    .click()
    .should('have.class', 'checked');
  })



  after(function () {
    // clean up by deleting the user from the database

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${user.id}`
    })

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/todos/byid/${activeItem.id}`
    })


    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/todos/byid/${notActiveItem.id}`
    })

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/tasks/byid/${task.id}`
    })
  })
})

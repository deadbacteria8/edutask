
  // define variables that we need on multiple occasions
describe('logging in', () => {
  let user
  let task
  let activeItem

  before(function () {
      cy.fixture('user.json').then((userJson) => {
        cy.request({
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
        });
      });
  })



  beforeEach( () => {

    function createTask(user_id) {
      return cy.fixture('CreateTask.json').then((taskJson) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/tasks/create',
          form: true,
          body: { ...taskJson, userid: user_id }
        }).then((response) => {
            task = {
              id : response.body[0]._id.$oid,
              taskTitle : taskJson.title,
              todoTitle : response.body[0].todos[0].description
            };
            return response.body[0]._id.$oid;
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
              id: response.body._id.$oid,
              title : response.body.description
            };
            return response.body._id.$oid;
        });
      });
    }

    createTask(user.id).then((taskid) => {
      return createActiveItem(taskid)});


    cy.visit('/')
    cy.get('#email').type(user.email)
    cy.get('form').submit()
    cy.get('h1').should('contain.text', 'Your tasks, ' + user.name)
  })


  it('click checked', () => {
    cy.get('.container-element').first().click();
    cy.contains('.todo-item .editable', task.todoTitle).parent('.todo-item')
    .as('targetTodo');
    cy.get('@targetTodo')
    .find('.checker')
    .click().should('have.class', 'checked');

    
  })

  it('click unchecked', () => {
    cy.get('.container-element').first().click();
    cy.contains('.todo-item .editable', activeItem.title).parent('.todo-item')
    .as('targetTodo');
    cy.get('@targetTodo')
    .find('.checker')
    .click().should('have.class', 'unchecked');

    
  })




  afterEach(() => {

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/tasks/byid/${task.id}`
    })

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/todos/byid/${activeItem.id}`
    })
  });



  after(function () {
    // clean up by deleting the user from the database

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${user.id}`
    })

    

  })
  });
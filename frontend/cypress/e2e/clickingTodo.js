describe('Logging into the system', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user
  let taskid
  let activeItem
  let item
  before(function () {

    //those functions does not explicitly need to be present here but i did so because i didnt feel like i had a better place to put them
    function createUser() {
      return cy.fixture('user.json').then((user) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid;
          name = user.firstName + ' ' + user.lastName;
          email = user.email;
          return uid;
        });
      });
    }
    
    function createTask(user_id) {
      return cy.fixture('task.json').then((task) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/tasks/create',
          form: true,
          body: { ...task, userid: user_id }
        }).then((response) => {
            taskid = response.body._id.$oid;
            return response.body._id.$oid;
        });
      });
    }

    function createActiveItem(taskid) {
      return cy.fixture('item.json').then((item) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/todos/create',
          form: true,
          body: { ...item, taskid: taskid, done: true }
        }).then((response) => {
            activeItem = response.body._id.$oid;
            return response.body._id.$oid;
        });
      });
    }

    function createNotActiveItem(taskid) {
      return cy.fixture('item.json').then((item) => {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:5000/todos/create',
          form: true,
          body: { ...item, taskid: taskid, done: false }
        }).then((response) => {
            item = response.body._id.$oid;
            return response.body._id.$oid;
        });
      });
    }

    createUser().then((uid) => createTask(uid).then((taskid) => {
      createNotActiveItem(taskid);
      createActiveItem(taskid);
    }));

  })

  beforeEach(function () {
    cy.visit('/')
    cy.get('#email').type(email)
    cy.get('form').submit()
    cy.get('h1').should('contain.text', 'Your tasks, ' + name)
  })



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

/*fetch(`http://localhost:5000/todos/byid/${todo._id}`, {
  method: 'delete',

  'tasks/byid/<id>', methods=['GET', 'PUT', 'DELETE']*/
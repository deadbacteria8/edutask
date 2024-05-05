describe('Logging into the system', () => {
  // define variables that we need on multiple occasions
  let user
  let task
  let activeItem
  let notActiveItem
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
            uid : response.body._id.$oid,
            name : userJson.firstName + ' ' + userJson.lastName,
            email : userJson.email
          };
          return uid;
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
              taskid : response.body._id.$oid,
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

    createUser().then((uid) => createTask(uid).then((taskid) => {
      createNotActiveItem(taskid);
      createActiveItem(taskid);
    }));

  })

  beforeEach(function () {
    cy.visit('/')
    cy.get('#email').type(email)
    cy.get('form').submit()
    cy.get('h1').should('contain.text', 'Your tasks, ' + user.name)
  })



  after(function () {
    // clean up by deleting the user from the database

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/todos/byid/${activeItem}`
    })


    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/todos/byid/${notActiveItem}`
    })

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/tasks/byid/${taskid}`
    })

    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    })
  })
})

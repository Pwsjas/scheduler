# Interview Scheduler Project

Interview Scheduler is a single-page appointment scheduling app which allows users to book, edit, and cancel interviews.  The project was created using React and JSX, and used Jest and Cypress for testing purposes. 

## Final Product

Interview Scheduler has various appointment states depending on the user's input and the database's data.

A day with no scheduled appointments:

!["Screenshot of a day with no scheduled appointments"](https://github.com/Pwsjas/scheduler/blob/master/docs/Blank.png?raw=true)

Various appointment states (scheduled, hover, create/edit, confirm delete):

!["Screenshot of various states of appointments"](https://github.com/Pwsjas/scheduler/blob/master/docs/States.png?raw=true)

Saving and Deleting indicators:

!["Screenshot of saving and deleting indicators"](https://github.com/Pwsjas/scheduler/blob/master/docs/Progress.png?raw=true)
## Dependencies

- Node.js
- axios
- classnames
- normalize.css
- react
- react-dom
- react-scripts

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command 
- View the webpage at `http://localhost:8000` by default.

- This application also requires a specific API to interact with.
Setup and instructions for this API can be found at https://github.com/lighthouse-labs/scheduler-api

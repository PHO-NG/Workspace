# Todolist

[A todolist website](https://limitless-gorge-03030.herokuapp.com/) which can hold multiple Todo lists (e.g. Home, work, personal, etc.)

HTML/CSS/JS (EJS emphasis)

Project from [Udemy: The Complete 2022 Web Development Bootcamp](https://www.udemy.com/course/the-complete-web-development-bootcamp/), with extra self-imposed functionalities including:
 - Displaying all List created
 - Deleting empty/completed list (except for home Todolist) to clear database space
 - Compacting list with similar names (e.g. work AND Work)
 - Instead of typing in URL to make a new Database (which still works), created a input to type it out
 
## Key skills learnt
 - Implementing the use of databases into projects using **Mongoose** and **MongoDB**.
 - Key database CRUD operations and when/where to use them.
 - Uploading projects to the web using **Heroku**.

 ## Difficulties and how I overcame them
  - <details>
  <summary>When trying to display all created list, the list would not always be displayed.</summary>
  <p> First tried implementing async functionalities with npm. Would fix the problem only on the home page and not the custom made todo list pages. Opted using timing looping events (i.e. setInterval) to wait until the list has been completely rendered before rendering the rest of the page. </p>
  </details>
  - <details>
  <summary>Errors with duplicate todo list with similar names</summary>
  <p> Used Lodash to capitalise the users inputs which would prevent clumping up database space and, keeping formatting consistent.</p>
  </details>

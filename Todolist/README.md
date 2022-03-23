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
  - <details> <summary>When trying to display all created list, the list would not always be displayed.</summary><p>First tried implementing async functionalities with npm. Would fix the problem only on the home page and not the custom made todo list pages. Opted to using timing looping events (i.e. setInterval) to wait until the list has been completely rendered before rendering the rest of the page.</p></details>
  - <details><summary>Errors with duplicate todo list with similar names</summary><p>Used Lodash to capitalise the users inputs which would prevent clumping up database space and, keeping formatting consistent.</p></details>
<img width="1390" alt="Screen Shot 2022-03-23 at 3 32 15 pm" src="https://user-images.githubusercontent.com/90999777/159624744-67a0981d-a1b6-4c08-a943-58df290ddfaf.png">
<img width="677" alt="Screen Shot 2022-03-23 at 3 33 33 pm" src="https://user-images.githubusercontent.com/90999777/159624750-6fec7245-8602-4e18-b6d9-2f3343aa38e6.png">
<img width="679" alt="Screen Shot 2022-03-23 at 3 33 40 pm" src="https://user-images.githubusercontent.com/90999777/159624754-e3d0c06e-72d6-4c1c-8e9d-8f43f48b6b23.png">
<img width="1023" alt="Screen Shot 2022-03-23 at 3 34 12 pm" src="https://user-images.githubusercontent.com/90999777/159624756-51238189-2eb5-422e-b640-9916cc3c4972.png">
<img width="658" alt="Screen Shot 2022-03-23 at 3 34 22 pm" src="https://user-images.githubusercontent.com/90999777/159624758-9b709b77-83ba-4318-84bb-beea2f656fe6.png">

/* -- https://limitless-gorge-03030.herokuapp.com/ -- */
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const async = require('async')

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true});

const itemSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema]
});

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

const todo1 = new Item({
  name: "New TodoList 🥳"
});
const todo2 = new Item({
  name: "← Click here to delete entry"
});

const tempList = [todo1, todo2];

let allList = []

function displayList() {
  const temp = []
  List.find({}, (err, results) => {
    if (!err) {
      results.forEach((list) => {
        if (list.items.length === 0 && list.name != "Today") {
          List.findOneAndDelete({name: list.name}, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
        temp.push(list.name)
      })
    }
  })
  return temp
}



app.get('/', (req, res) => {
  
  List.find({}, (err, results) => {

    if (results.length === 0) {
      const list = new List({
        name: "Today",
        items: tempList
      })
      list.save();
      res.redirect('/');
    } else {
      (async () => {
        allList = await displayList()
      }).call(res.render('list', {listTitle: "Today", newListItems: results[0].items, allList: allList}))
      
    }
  });
});

app.get('/:customName', (req,res) => {
  allList = displayList()
  const title = _.capitalize(req.params.customName);

  List.find({name: title}, (err,results) => {
    if (results.length === 0) {
      const list = new List({
        name: title,
        items: tempList
      })
      list.save();
      res.redirect('/' + title);
    } else if (title === "Today") { 
      res.redirect('/')
    } else {
      (async () => {
        allList = await displayList()
      }).call(res.render('list', {listTitle: title, newListItems: results[0].items, allList: allList}))
      
      
    }
  })
});

app.post('/', (req, res) => {

  const itemName = req.body.newItem;
  const listName = _.capitalize(req.body.list);

  const newItem = new Item({name: itemName});
  List.find({name: listName}, (err, results) => {
      results[0].items.push(newItem);
      results[0].save();
      res.redirect('/' + listName);
  })
});

app.post('/delete', (req,res) => {

  const listName = _.capitalize(req.body.listName);
  const checkedItemId = req.body.checkbox;
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, result) => {
    if (!err) {
      res.redirect('/' + listName);
    }
  });
});

app.get('/about', (req,res) => {
  res.render("about");
});

let port = process.env.PORT;
if (port === "NULL" || port === "" || !port) {
  port = 3000;
}
app.listen(port, () => {
  console.log("Server started on port " + port);
});


/* -- TODO -- 
  1. COMBINE TODAY'S LIST TO LIST MODEL ✅
  2. SHOW ALL LIST ON SIDE
  3. MAKE ALL LIST CLICKABLE
*/

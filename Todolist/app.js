/* -- https://limitless-gorge-03030.herokuapp.com/ -- */
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

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
  name: "Eat"
});
const todo2 = new Item({
  name: "Work"
});
const todo3 = new Item({
  name: "Sleep"
});

const tempList = [todo1, todo2, todo3];

app.get('/', (req, res) => {
  Item.find({}, (err, results) => {

    if (results.length === 0) {
      Item.insertMany(tempList, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success!");
        }
      });
      res.redirect("/");
    } else {
      res.render('list', {listTitle: "Today", newListItems: results});
    }
  });
});

app.get('/:customName', (req,res) => {
  
  const title = _.capitalize(req.params.customName);

  List.find({name: title}, (err,results) => {
    if (results.length === 0) {
      const list = new List({
        name: title,
        items: tempList
      })
      list.save();
  res.redirect("/" + title);
    } else {
      res.render('list', {listTitle: title, newListItems: results[0].items});
    }
  })
});

app.post("/", (req, res) => {

  const itemName = req.body.newItem;
  const listName = _.capitalize(req.body.list);

  const newItem = new Item({name: itemName});

  if (listName === "Today") {
    newItem.save();
    res.redirect('/');
  } else {
    List.find({name: listName}, (err, results) => {
        results[0].items.push(newItem);
        results[0].save();
        res.redirect('/' + listName);
    })
  }
});

app.post("/delete", (req,res) => {

  const listName = _.capitalize(req.body.listName);
  const checkedItemId = req.body.checkbox;

  if (listName === "Today") {
    Item.deleteOne({_id: checkedItemId}, (err) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
    
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, result) => {
      if (!err) {
        res.redirect('/' + listName);
      }
    });
  }
});

app.get("/about", (req,res) => {
  res.render("about");
});

let port = process.env.PORT;
if (port === "NULL" || port === "" || !port) {
  port = 3000;
}
app.listen(port, () => {
  console.log("Server started on port " + port);
});

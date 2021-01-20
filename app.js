const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Add DB
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const pray = new Item({
    name: "Say a prayer"
})

const drinkWater = new Item({
    name: "Drink water"
});

const brushTeeth = new Item({
    name: "Brush teeth"
});

const defaultItems = [pray, drinkWater, brushTeeth];

// New schema for for custom lists

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {

    Item.find(function(err, foundItems) {
        if (err) {
            console.log(err);
        } else {

            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Successfuly added defualt items to the 'Item' collection." );
                    }
                });
                res.redirect("/");
            } else {
                res.render("list", {listTitle: "Today", newListItems: foundItems})
            }
        }
    })

});

app.get("/:custom", function(req, res) {
    
        const customListName = _.capitalize(req.params.custom);

        List.findOne({name: customListName}, function(err, foundItems) {
            
            if(!err) {
                if (foundItems) {
                    // Document exists, so we show it
                    res.render("list", {listTitle: foundItems.name, newListItems: foundItems.items})
                } else {
                    // Document doeosn't exist, so we create it
                    const list = new List({
                        name: customListName,
                        items: defaultItems
                    });
                    list.save();
                    res.redirect("/" + customListName);
                }
            } else {
                console.log(err);
            }

           
          });
});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const customItem = new Item({
        name: itemName
    })

    if(listName === "Today") {
        customItem.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundLists) {
            foundLists.items.push(customItem);
            foundLists.save();
            res.redirect("/" + listName)
        })
        
    }

});

app.post("/delete", function(req, res) {
const checkedItemId = req.body.checkbox;
const listName = req.body.listName;

if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("successfuly deleted checked item.");
          res.redirect("/");
        }
      });
} else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
        if (!err) {
            res.redirect("/" + listName);
        }
    });
}

})

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "work list", newListItems: workItems})
});

app.get("/about", function(req, res) {
    res.render("about");
})
app.listen(process.env.PORT || 3000, function() {
    console.log("server running on port 3000");
})
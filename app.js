const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var newItem = ["Morning Text", "brush teet", "Eat breakfast", "Get to work"];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {

    const today = new Date();
    var options = { 
        weekday: 'long', 
        day: 'numeric' ,
        month: 'long',
    };
    var day = today.toLocaleDateString("en-US", options)

    res.render("list", {kindOfDay: day, newListItem: newItem})

})

app.post("/", function(req, res) {
    newItem.push(req.body.newItem);
    res.redirect("/");

   // console.log(newItem);
})

app.listen(process.env.PORT || 3000, function() {
    console.log("server running on port 3000");
})
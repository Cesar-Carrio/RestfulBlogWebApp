var bodyParser = require("body-parser"),
  express = require("express"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  app = express();
var mongoose = require("mongoose");

//App config
mongoose.connect(
  "mongodb://localhost:27017/restful_blog_app",
  { useNewUrlParser: true }
);
app.set("view engine", "ejs");
app.use(express.static("public")); //serve custom style sheet
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//Mongoose config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now } //this enters a default date
});
var Blog = mongoose.model("Blog", blogSchema);

//RESTfulRoutes
app.get("/", function(req, res) {
  res.redirect("/blogs");
});

//INDEX route
app.get("/blogs", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERROR!");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

//NEW route
app.get("/blogs/new", function(req, res) {
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res) {
  //create blog
  //sanitizing input
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog) {
    if (err) {
      res.render("new");
    } else {
      //then, redirect to the
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

//Edit route
app.get("/blogs/:id/edit", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

//Update Route
app.put("/blogs/:id", function(req, res) {
  //sanitizing input
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    err,
    updatedBlog
  ) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});

//Delete Route
app.delete("/blogs/:id", function(req, res) {
  //destroy blog
  //then redirect
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  });
});

app.listen(3001, "127.0.0.1", function() {
  console.log("Blog app server has now started!");
});

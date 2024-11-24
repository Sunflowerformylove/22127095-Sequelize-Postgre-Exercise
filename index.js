const express = require("express");
const expressHbs = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");
const app = express();
const port = 3000;

app.use(express.static(__dirname + "/html"));

app.engine(
	"hbs",
	expressHbs.engine({
		layoutsDir: __dirname + "/views/layouts",
		partialsDir: __dirname + "/views/partials",
		extname: "hbs",
		defaultLayout: "layout",
		runtimeOptions: {
			allowProtoPropertiesByDefault: true,
		},
		helpers: {
            createPagination,
			formatDate: (date) => {
				return date.toLocaleDateString("en-US", {
					year: "numeric",
					month: "long",
					day: "numeric",
				});
			},
		},
	})
);

app.set("view engine", "hbs");

app.get("/", (req, res) => {
	res.redirect("/blogs");
});

app.use("/blogs", require("./routes/blogRouter"));

app.get("/detail", (req, res) => {
	res.render("details");
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

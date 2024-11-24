const controller = {};
const { query } = require("express");
const model = require("../models");
const { Op } = require("sequelize");

controller.init = async (req, res, next) => {
	res.locals.category = await model.Category.findAll({
		include: [{ model: model.Blog }],
	});
	res.locals.tag = await model.Tag.findAll();
	next();
};

controller.showList = async (req, res) => {
	let {category = 0, tag = 0, keyword = "", page = 1} = req.query;
	category = isNaN(category) ? 0 : parseInt(category);
	tag = isNaN(tag) ? 0 : parseInt(tag);
	page = isNaN(page) ? 1 : parseInt(page);
	let limit = 2;
	let offset = (page - 1) * limit;
	let options = {
		include: [{ model: model.Comment }, { model: model.Tag }],
		where: {},
	};
	if (category) {
		options.where = { categoryId: category };
	}
	if (tag) {
		options.include.push({
			model: model.Tag,
			where: { id: tag },
		});
	}
	if (keyword.trim() !== "") {
		options.where[Op.or] = {
			title: {
				[Op.iLike]: `%${keyword.trim()}%`,
			},
			summary: {
				[Op.iLike]: `%${keyword.trim()}%`,
			},
		};
	}

	let totalRows = await model.Blog.count({
		...options,
		distinct: true,
		col: "id"
	})

	res.locals.pagination = {
		page,
		limit,
		totalRows,
		queryParams: req.query,
	}

	let blogs = await model.Blog.findAll({...options, limit, offset});
	res.locals.blogs = blogs;
	res.render("index");
};

controller.showDetails = async (req, res) => {
	let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
	let blog = await model.Blog.findOne({
		where: { id },
		include: [
			{ model: model.Comment },
			{ model: model.User },
			{ model: model.Category },
			{ model: model.Tag },
		],
	});
	res.locals.blog = blog;
	res.render("details");
};

module.exports = controller;

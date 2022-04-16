const db = require('../models');
var moment = require('moment');
const genarat = require('../services/recipeNumber.js');
const ReportSale = db.reportSale;

// Create and Save a new Tutorial
exports.create = (req, res) => {
   // Validate request

   // Create a Tutorial

   const reportSale = new ReportSale({
      allIetms: req.body.allIetms,
      additions: req.body.additions,
      sumation: req.body.sumation,
      time:moment(new Date()).format('hh:mm:ss a'),
      tax:req.body.tax,
      totalAccount:req.body.totalAccount,
      recpieNumber: req.body.recpieNumber,
      casherName: req.body.casherName,
      discraption: req.body.discraption,
      published: req.body.published ? req.body.published : true,
   });
   // genarat();

   // Save Items in the database
   reportSale
      .save(reportSale)
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || 'Some error occurred while creating the Item.',
         });
      });
};
exports.createNewProdect = (req, res) => {
   const id = req.params.id;
   // Create a reportSale
   const product = new Object({
      title: req.body.title ? req.body.title : 'Boneless',
      price: req.body.price ? req.body.price : '2.50',
      image: req.body.image
         ? req.body.image
         : 'https://static.remove.bg/remove-bg-web/a6eefcd21dff1bbc2448264c32f7b48d7380cb17/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png',
      discraption: req.body.discraption ? req.body.discraption : 'true',
      additions: req.body.additions ? req.body.additions : ['halooo'],
   });
   // Save Item in the database
   ReportSale.findOneAndUpdate({ _id: id }, { $push: { product: product } })
      .then((data) => {
         res.send({ massege: 'prodect has been added successfully' }, product);
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || 'Some error occurred while creating the Item.',
         });
      });
};

// Retrieve all Items from the database.
exports.findAll = (req, res) => {
   const tab = req.query.allIetms;
   var condition = tab
      ? { tab: { $regex: new RegExp(tab), $options: 'i' } }
      : {};

   ReportSale.find(condition)
      .then((data) => {
         res.send(data);
         console.log(data);
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || 'Some error occurred while retrieving Items.',
         });
      });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
   const id = req.params.id;

   ReportSale.findById(id)
      .then((data) => {
         if (!data)
            res.status(404).send({
               message: 'Not found Item with id ' + id,
            });
         else res.send(data);
      })
      .catch((err) => {
         res.status(500).send({
            message: 'Error retrieving Item with id=' + id,
         });
      });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
   if (!req.body) {
      return res.status(400).send({
         message: 'Data to update can not be empty!',
      });
   }

   const id = req.params.id;

   ReportSale.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
      .then((data) => {
         if (!data) {
            res.status(404).send({
               message: `Cannot update item with id=${id}. Maybe item was not found!`,
            });
         } else res.send({ message: 'Item was updated successfully.' });
      })
      .catch((err) => {
         res.status(500).send({
            message: 'Error updating item with id=' + id,
         });
      });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
   const id = req.params.id;

   ReportSale.findByIdAndRemove(id, { useFindAndModify: false })
      .then((data) => {
         if (!data) {
            res.status(404).send({
               message: `Cannot delete item with id=${id}. Maybe item was not found!`,
            });
         } else {
            res.send({
               message: 'Item was deleted successfully!',
            });
         }
      })
      .catch((err) => {
         res.status(500).send({
            message: 'Could not delete Item with id=' + id,
         });
      });
};

// Delete One prodect by tab-name (body) and id prodect in (parms)
exports.deleteProdectByName = (req, res) => {
   const tabName = req.body.tab;

   // update Item in the database
   ReportSale.findOneAndUpdate(
      { tab: tabName },
      { $pull: { product: { _id: req.params.id } } }
   )
      .then((data) => {
         res.send({ message: 'Item was Deleted prodect is successfully.' });
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || 'Some error occurred while creating the Item.',
         });
      });
};

// UNDisplay for list without Delete
exports.published = (req, res) => {
   const id = req.params.id;

   ReportSale.findByIdAndUpdate(
      id,
      {
         $set: {
            published: false,
         },
      },
      { useFindAndModify: false }
   )
      .then((data) => {
         if (!data) {
            res.status(404).send({
               message: `Cannot update Item with id=${id}. Maybe Tutorial was not found!`,
            });
         } else res.send({ message: 'Item was updated successfully.' });
      })
      .catch((err) => {
         res.status(500).send({
            message: 'Error updating Item with id=' + id,
         });
      });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
   ReportSale.deleteMany({})
      .then((data) => {
         res.send({
            message: `${data.deletedCount} Item were deleted successfully!`,
         });
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || 'Some error occurred while removing all Item.',
         });
      });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
   var name = req.params.name;
   ReportSale.find({ published: true ,casherName:name })
      .then((data) => {
         res.send(data);
      })
      .catch((err) => {
         res.status(500).send({
            message:
               err.message || 'Some error occurred while retrieving items.',
         });
      });
};

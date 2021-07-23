const express = require("express");
const apiRouter = express.Router();
const { CTRL_admin } = require("../controllers/admin.js");
const { CTRL_cases } = require("../controllers/cases.js");
const { CTRL_customers } = require("../controllers/customers.js");
const { CTRL_staff } = require("../controllers/staff.js");
const { CTRL_consignment } = require("../controllers/consignments.js");
const { CTRL_inventory } = require("../controllers/inventory.js");
const { CTRL_lessons } = require("../controllers/lessons.js");
const { CTRL_rentals } = require("../controllers/rentals.js");
const { CTRL_tags } = require("../controllers/tags.js");
const parseBody = express.urlencoded({ extended: true });
const parseJSON = express.json();

//ADMIN-----------------------------------------------------------------------------------------------
apiRouter.post("/admin/customTable/create/:id", CTRL_admin.createTable);
apiRouter.delete("/admin/customTable/delete/:id", CTRL_admin.deleteTable);
apiRouter.put("/admin/customTable/addFields", parseBody, parseJSON, CTRL_admin.addCustomFields);
apiRouter.get("/admin/serverjobs/cleanconsignmentpics", CTRL_admin.cleanConsignmentPics);
apiRouter.get("/admin/serverjobs/cleanReverbInventory", CTRL_admin.cleanReverbInventory);
apiRouter.get("/admin/serverjobs/postMailerLiteSubscribers", CTRL_admin.postMailerLiteSubscribers);
// CASES----------------------------------------------------------------------------------------------
apiRouter.get("/cases", CTRL_cases.get);
apiRouter.get("/cases/:id", CTRL_cases.get);
apiRouter.post("/cases", parseBody, parseJSON, CTRL_cases.post);
//CONSIGNMENTS----------------------------------------------------------------------------------------
apiRouter.get("/consignments", CTRL_consignment.get);
apiRouter.get("/consignments/reverb/conditions", CTRL_consignment.reverbConditions);
apiRouter.get("/consignments/reverb/categories", CTRL_consignment.reverbCategories);
apiRouter.get("/consignments/reverb", CTRL_consignment.reverbGet);
apiRouter.post("/consignments/reverb", parseBody, parseJSON, CTRL_consignment.reverbPost);
apiRouter.post("/consignments/photos", parseBody, parseJSON, CTRL_consignment.savePhoto);
//INVENTORY-------------------------------------------------------------------------------------------
apiRouter.get("/inventory/brands", CTRL_inventory.getBrandsList);
apiRouter.get("/inventory/categories", CTRL_inventory.getCategoriesList);
apiRouter.get("/inventory/subcategories", CTRL_inventory.getSubCategoriesList);
apiRouter.get("/inventory/selectioncodes", CTRL_inventory.getSelectionCodesList);
apiRouter.post("/inventory/byParams", parseBody, parseJSON, CTRL_inventory.getByParams);
apiRouter.get("/inventory/:id", CTRL_inventory.get);
//CUSTOMERS-------------------------------------------------------------------------------------------
apiRouter.get("/customers/:id", CTRL_customers.get);
apiRouter.post("/customers/entrydate", parseBody, parseJSON, CTRL_customers.getByEntryDate);
//LESSONS---------------------------------------------------------------------------------------------
apiRouter.get("/lessons/instructors", CTRL_lessons.getInstructors);
apiRouter.get("/lessons/students/byteacher", CTRL_lessons.getStudentsByTeacher);
apiRouter.get("/lessons/students/byteacher/:id", CTRL_lessons.getStudentsByTeacher);
apiRouter.get("/lessons/students/:id", CTRL_lessons.getStudents);
apiRouter.get("/lessons/students", CTRL_lessons.getStudents);
apiRouter.get("/lessons/trialconversions", CTRL_lessons.getTrials);
apiRouter.get("/lessons/timeline", CTRL_lessons.getTimeline);
apiRouter.get("/lessons/rates/averageRate", CTRL_lessons.getAverageRate);
//RENTALS---------------------------------------------------------------------------------------------
apiRouter.get("/rentals/bandFolders", CTRL_rentals.getBandFolders);
apiRouter.post("/rentals/bandFolders", parseBody, parseJSON, CTRL_rentals.postBandFolders);
apiRouter.delete("/rentals/bandFolders/:id", CTRL_rentals.deleteBandFolders);
//STAFF-----------------------------------------------------------------------------------------------
apiRouter.get("/staff", CTRL_staff.get);
//TAG GENERATOR---------------------------------------------------------------------------------------
apiRouter.get("/tagGenerator/:id", CTRL_tags.get);

module.exports = apiRouter;

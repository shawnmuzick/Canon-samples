const express = require("express");
const viewRouter = express.Router();
const path = require("path");
function sendView(req, res, view) {
  res.sendFile(path.join(__dirname, view));
}

//ADMIN-----------------------------------------------------------------------------------------------
viewRouter.get("/admin/customTable/create", (req, res) =>
  sendView(req, res, "../views/admin/createCustomTable.html")
);
viewRouter.get("/admin/customTable/delete", (req, res) =>
  sendView(req, res, "../views/admin/dropCustomTable.html")
);
viewRouter.get("/admin/customTable/addFields", (req, res) =>
  sendView(req, res, "../views/admin/addCustomTableFields.html")
);
viewRouter.get("/admin/serverjobs", (req, res) =>
  sendView(req, res, "../views/admin/serverJobs.html")
);
viewRouter.get("/home", (req, res) => sendView(req, res, "../views/home.html"));

// CASES---------------------------------------------------------------------------------------------
viewRouter.get("/cases", (req, res) => sendView(req, res, "../views/cases/caseForm.html"));

//CONSIGNMENTS----------------------------------------------------------------------------------------
viewRouter.get("/consignments", (req, res) =>
  sendView(req, res, "../views/consignments/consignments.html")
);
viewRouter.get("/consignments/reverb/list", (req, res) =>
  sendView(req, res, "../views/consignments/reverbList.html")
);
viewRouter.get("/consignments/reverb/createlisting", (req, res) =>
  sendView(req, res, "../views/consignments/reverbCreateNew.html")
);

// DOCUMENTATION---------------------------------------------------------------------------------------
viewRouter.get("/documentation/api", (req, res) =>
  sendView(req, res, "../views/documentation/api.html")
);

// LESSONS--------------------------------------------------------------------------------------------
viewRouter.get("/lessons/monthlyreport", (req, res) =>
  sendView(req, res, "../views/lessons/monthlyReport.html")
);
viewRouter.get("/lessons/trialconversions", (req, res) =>
  sendView(req, res, "../views/lessons/trialConversions.html")
);
viewRouter.get("/lessons/timeline", (req, res) =>
  sendView(req, res, "../views/lessons/timeline.html")
);
viewRouter.get("/lessons/forcast", (req, res) =>
  sendView(req, res, "../views/lessons/forcast.html")
);
viewRouter.get("/lessons/contract", (req, res) =>
  sendView(req, res, "../views/lessons/contract.html")
);
viewRouter.get("/lessons/cancellationsheets", (req, res) =>
  sendView(req, res, "../views/lessons/cancellationSheets.html")
);
viewRouter.get("/lessons/dashboard", (req, res) =>
  sendView(req, res, "../views/lessons/dashboard.html")
);
//MISC-----------------------------------------------------------------------------------------------
viewRouter.get("/bandFolders", (req, res) =>
  sendView(req, res, "../views/rentals/bandFolders.html")
);
//RENTALS--------------------------------------------------------------------------------------------
viewRouter.get("/rentals/deliverychecklist", (req, res) =>
  sendView(req, res, "../views/rentals/deliveryChecklist.html")
);
viewRouter.get("/rentals/contract", (req, res) =>
  sendView(req, res, "../views/rentals/contract.html")
);
// TAG GENERATOR--------------------------------------------------------------------------------------
viewRouter.get("/taggenerator", (req, res) =>
  sendView(req, res, "../views/tags/tagGenerator.html")
);
module.exports = viewRouter;

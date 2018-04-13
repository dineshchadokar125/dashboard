sap.ui.define([
    "com/sap/dashboard/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast"
  ], function (BaseController, JSONModel, formatter, Filter, FilterOperator, History, MessageToast) {
    "use strict";
    
    var oResource;
    
    return BaseController.extend("com.sap.dashboard.controller.Worklist", {
    	
    onInit : function(){
    	
      var oRouter = this.getRouter();
      oRouter.getRoute("worklist").attachMatched(this._onRouteMatched, this);
    },	
    	
    	//  Route Attached method to handle all the service logic

    _onRouteMatched: function() {

      var that = this;
      this.getView().getModel().setSizeLimit(1000000);
      var aFilters = [];
      aFilters.length = 0;
      var oView = this.getView();

      oView.setBusy(true);
      oResource = this.getView().getModel("i18n").getResourceBundle();
    //  var userName = sap.ushell.Container.getService("UserInfo").getUser().getFullName();

      //this.getView().byId("idlblUserData").setText(oResource.getText("welcome") + " " + userName);

      var sServiceUrl = this.getOwnerComponent().getModel().sServiceUrl;

      var oDataModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);

      var SystemSet = [];

      var mParameters = {
        success: function(oData, oResponse) {
          that.chartdata(oData,oView);
        },
        error: function(oError) {
          oView.setBusy(false);
        }
      };

      var path = "/chartdataSet";

      oDataModel.read(path, mParameters);

    },
    	
    	
   // Chart Data setting	
   chartdata:function(resultsData,oView){
   	
   	var sampleDatajson = new sap.ui.model.json.JSONModel(resultsData);
			var oVizFrame = this.getView().byId("idStackedChart");
			oVizFrame.setVizProperties({
				plotArea: {
					colorPalette: d3.scale.category20().range(),
					dataLabel: {
						showTotal: true
					}
				},
				tooltip: {
					visible: true
				},
				title: {
					text: "Stacked Bar Chart"
				}
			});
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: "Year",
					value: "{Yearid}"
				}],

				measures: [{
					name: "Milk",
					value: "{Milk}"
				}, {
					name: "Sugar",
					value: "{Sugar}"
				}, {
					name: "Tea",
					value: "{Tea}"
				}],

				data: {
					path: "/results"
				}
			});
			oVizFrame.setDataset(oDataset);

			oVizFrame.setModel(sampleDatajson);

			var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Milk"]
				}),
				oFeedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Sugar"]
				}),
				oFeedValueAxis2 = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "valueAxis",
					"type": "Measure",
					"values": ["Tea"]
				}),

				oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					"uid": "categoryAxis",
					"type": "Dimension",
					"values": ["Year"]
				});

			oVizFrame.addFeed(oFeedValueAxis);
			oVizFrame.addFeed(oFeedValueAxis1);
			oVizFrame.addFeed(oFeedValueAxis2);
			oVizFrame.addFeed(oFeedCategoryAxis);
			
            oView.setBusy(false);


    },
   //back action  
    onNavBack : function() {
        var oHistory = History.getInstance(),
          sPreviousHash = oHistory.getPreviousHash();
      if (sPreviousHash !== undefined) {
          // The history contains a previous entry
          history.go(-1);
        }
      }
      
      
    });
  }
);
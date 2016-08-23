define("camelot_viz_ext_camelotlinechart-src/js/flow", ["camelot_viz_ext_camelotlinechart-src/js/module"], function(moduleFunc) {
	var flowRegisterFunc = function() {
		var flow = sap.viz.extapi.Flow.createFlow({
			id: "camelot.viz.ext.camelotlinechart",
			name: "Line Chart",
			dataModel: "sap.viz.api.data.CrosstableDataset",
			type: "BorderSVGFlow"
		});

		var titleElement = sap.viz.extapi.Flow.createElement({
			id: "sap.viz.chart.elements.Title",
			name: "Title"
		});
		flow.addElement({
			"element": titleElement,
			"propertyCategory": "title",
			"place": "top"
		});

		var element = sap.viz.extapi.Flow.createElement({
			id: "camelot.viz.ext.camelotlinechart.PlotModule",
			name: "Line Chart Module"
		});
		element.implement("sap.viz.elements.common.BaseGraphic", moduleFunc);

		/*Feeds Definition*/
		var ds1 = {
			"id": "camelot.viz.ext.camelotlinechart.PlotModule.DS1",
			"name": "X Axis",
			"type": "Dimension",
			"min": 0, //minimum number of data container
			"max": 2, //maximum number of data container
			"aaIndex": 1
		};
		element.addFeed(ds1);

		var ms1 = {
			"id": "camelot.viz.ext.camelotlinechart.PlotModule.MS1",
			"name": "Y Axis",
			"type": "Measure",
			"min": 0, //minimum number of measures
			"max": Infinity, //maximum number of measures
			"mgIndex": 1
		};
		element.addFeed(ms1);

		element.addProperty({
			name: "colorPalette",
			type: "StringArray",
			supportedValues: "",
			defaultValue: d3.scale.category20().range().concat(d3.scale.category20b().range()).concat(d3.scale.category20c().range())
		});

		flow.addElement({
			"element": element,
			"propertyCategory": "plotArea"
		});
		sap.viz.extapi.Flow.registerFlow(flow);
		
			element.addProperty({
			name: "gridline",
			type: "Object",
			supportedValues: {
				visible: {
					name: "visible",
					type: "Boolean",
					supportedValues: [true, false]
				}
			}
		});

		element.addProperty({
			name: "yAxisLine",
			type: "Object",
			supportedValues: {
				visible: {
					name: "visible",
					type: "Boolean",
					supportedValues: [true, false]
				}
			}
		});

		element.addProperty({
			name: "legend",
			type: "Object",
			supportedValues: {
				visible: {
					name: "visible",
					type: "Boolean",
					supportedValues: [true, false]
				}
			}
		});

		element.addProperty({
			name: "yAxisLabel",
			type: "Object",
			supportedValues: {
				visible: {
					name: "visible",
					type: "Boolean",
					supportedValues: [true, false]
				}
			}
		});

		element.addProperty({
			name: "capacitykpi",
			type: "Object",
			supportedValues: {
				visible: {
					name: "visible",
					type: "Boolean",
					supportedValues: [true, false]
				}
			}
		});
	};
	flowRegisterFunc.id = "camelot.viz.ext.camelotlinechart";
	return {
		id: flowRegisterFunc.id,
		init: flowRegisterFunc
	};
});
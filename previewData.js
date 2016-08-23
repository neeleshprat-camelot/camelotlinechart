define([], function() {
	var previewData = {
		cross: {
			"data": {
				"analysisAxis": [{
					"index": 1,
					"data": [{
						"type": "Dimension",
						"name": "Year (TD)",
						"values": ["2016", "2016", "2016"]
					}, {
						"type": "Dimension",
						"name": "Time Division",
						"values": [".YTD", "FC+3", "FC+6"]
					}]
				}],
				"measureValuesGroup": [{
					"index": 1,
					"data": [{
						"type": "Measure",
						"name": "Utilization",
						"values": [
							[83.05, 94.45, 109.42]
						]
					}]
				}]
			},
			"bindings": [{
				"feed": "camelot.viz.ext.camelotlinechart.PlotModule.DS1",
				"source": [{
					"type": "analysisAxis",
					"index": 1
				}]
			}, {
				"feed": "camelot.viz.ext.camelotlinechart.PlotModule.MS1",
				"source": [{
					"type": "measureValuesGroup",
					"index": 1
				}]
			}]
		},
		flat: {
			"metadata": {
				"dimensions": [{
					"name": "Year (TD)",
					"value": "{Year (TD)}"
				}, {
					"name": "Time Division",
					"value": "{Time Division}"
				}],
				"measures": [{
					"name": "Utilization",
					"value": "{Utilization}"
				}],
				"data": {
					"path": "/data"
				}
			},
			"feedItems": [{
				"uid": "camelot.viz.ext.camelotlinechart.PlotModule.DS1",
				"type": "Dimension",
				"values": ["Year (TD)", "Time Division"]
			}, {
				"uid": "camelot.viz.ext.camelotlinechart.PlotModule.MS1",
				"type": "Measure",
				"values": ["Utilization"]
			}],
			"data": {
				"data": [{
					"Year (TD)": "2016",
					"Time Division": ".YTD",
					"Utilization": 77.3895904503373
				}, {
					"Year (TD)": "2016",
					"Time Division": "FC+3",
					"Utilization": 75.9119503093269
				}, {
					"Year (TD)": "2016",
					"Time Division": "FC+6",
					"Utilization": 65.4883700712101
				}]
			}
		}
	};
	return previewData;
});
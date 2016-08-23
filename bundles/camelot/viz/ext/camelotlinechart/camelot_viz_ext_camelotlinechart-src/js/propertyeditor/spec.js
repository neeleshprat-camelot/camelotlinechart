define("camelot_viz_ext_camelotlinechart-src/js/propertyeditor/spec", ["camelot_viz_ext_camelotlinechart-src/js/propertyeditor/renderers/checkbox"], function(checkBoxRenderer) {
	//property editor spec
	var spec = {
		"id": "sample.openpe.extension",
		"dependencies": [],
		"components": [{
			"id": "sample.openpe.samplebar.extension",
			"provide": "sap.viz.controls.propertyeditor.view",
			"instance": {
				'charts': ['camelot.viz.ext.camelotlinechart'],
				'view': {
					'sections': [{
						"id": "sap.viz.controls.propertyeditor.section.chart_title",
						"caption": 'EXTEND_CHART_TITLE',
						"propertyZone": "CHART_TITLE",
						"groups": [{
							"id": "sap.viz.controls.propertyeditor.section.chart_title.group.title.visible",
							"type": "sap.viz.controls.propertyeditor.groupImpl.SwitchGroup",
							"config": {
								"property": "title.visible",
								"label": "Show Chart Title"
							}
						}]
					}, {
						'id': 'sap.viz.controls.propertyeditor.section.plotArea',
						'propertyZone': 'PLOTAREA',
						'caption': 'EXTEND_PLOT_AREA',
						"groups": [{
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.gridline.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.gridline.visible",
								"label": "Show Grid Line"
							}
						}, {
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.yAxisLine.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.yAxisLine.visible",
								"label": "Show Y-Axis Line"
							}
						}, {
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.legend.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.legend.visible",
								"label": "Show Legend"
							}
						}, {
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.yAxisLabel.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.yAxisLabel.visible",
								"label": "Show Y-Axis Label"
							}
						}, {
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.capacitykpi.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.capacitykpi.visible",
								"label": "Show Capa. KPI Ref. Line"
							}
						}, {
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.group.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.group.visible",
								"label": "Group"
							}
						}, {
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.mc.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.mc.visible",
								"label": "MC"
							}
						}, {
							"id": "sap.viz.controls.propertyeditor.section.plotArea.group.itlab.visible",
							'renderer': checkBoxRenderer,
							"config": {
								"property": "plotArea.itlab.visible",
								"label": "IT"
							}
						}]
					}]
				}
			}
		}]
	};
	return spec;
});
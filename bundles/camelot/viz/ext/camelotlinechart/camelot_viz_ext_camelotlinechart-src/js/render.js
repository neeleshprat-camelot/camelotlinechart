define("camelot_viz_ext_camelotlinechart-src/js/render", ["camelot_viz_ext_camelotlinechart-src/js/utils/util"], function(util) {
	/*
	 * This function is a drawing function; you should put all your drawing logic in it.
	 * it's called in moduleFunc.prototype.render
	 * @param {Object} data - proceessed dataset, check dataMapping.js
	 * @param {Object} container - the target d3.selection element of plot area
	 * @example
	 *   container size:     this.width() or this.height()
	 *   chart properties:   this.properties()
	 *   dimensions info:    data.meta.dimensions()
	 *   measures info:      data.meta.measures()
	 */
	var render = function(data, container) {

		/* -----------------------------------------------------------------Data Preparation-------------------------------------------------------------------------- */

		//get dimensions and measures from the metadata
		var dset = data.meta.dimensions('X Axis');
		var mset = data.meta.measures('Y Axis');

		var csvData = data;

		var dimName1 = dset[0];
		var dimName2 = dset[1];
		var dimName3 = dset[2];

		//get the max value from the measure set
		var maxMset = d3.max(csvData, function(d) {
			return d[mset];
		});

		var capacityKpi = 75;

		var sortFunction;
		//sort data based on the available dimensions
		if (dimName3) {
			sortFunction = util.monthComparator(dimName1, dimName2, dimName3);
			csvData.sort(sortFunction);
		} else if (dimName2) {
			sortFunction = util.tdComparator(dimName1, dimName2);
			csvData.sort(sortFunction);
		} else {
			sortFunction = util.yearComparator(dimName1);
			csvData.sort(sortFunction);
		}

		/* --------------------------------------------------------------End of Data Preparation------------------------------------------------------------------- */

		// Chart custom properties
		var properties = this.properties();
		var gridLinesVisibility = properties.gridline && (properties.gridline.visible != null) ? properties.gridline.visible : true;
		var legendVisibility = properties.legend && (properties.legend.visible != null) ? properties.legend.visible : true;
		var yAxisLineVisibility = properties.yAxisLine && (properties.yAxisLine.visible != null) ? properties.yAxisLine.visible : true;
		var yAxisLabelVisibility = properties.yAxisLabel && (properties.yAxisLabel.visible != null) ? properties.yAxisLabel.visible : true;
		var utilKPIVisibility = properties.capacitykpi && (properties.capacitykpi.visible != null) ? properties.capacitykpi.visible : true;

		var utilLineColor = "#0A5497";
		var utilKPIcolor = "#96BC33";

		/* -----------------------------------------------------------Plot Area------------------------------------------------------------------------- */

		//define default margin with some standard top, bottom, right, left values
		var defaultMargin = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		};

		//derive width and height from the default margin values
		var visWidth = this.width() - defaultMargin.left - defaultMargin.right;
		var visHeight = this.height() - defaultMargin.top - defaultMargin.bottom;

		//remove any older svg element from the selection
		container.selectAll('svg').remove();

		//create a new svg element and a canvas 'g' with its weight and height attributes
		//this svg element contains plotArea + title + legend
		var vis = container.append('svg').attr('width', visWidth).attr('height', visWidth)
			.append('g').attr('class', 'camelot_viz_ext_camelotlinechart_vis').attr('width', visWidth).attr('height', visWidth);

		var visMargin = {
			top: 0,
			bottom: 0,
			right: legendVisibility ? 110 : 0,
			left: yAxisLabelVisibility ? 70 : 30
		};

		//define the width and height of the vis elements plotArea + title + legend
		var plotAreaWidth = visWidth - visMargin.right - visMargin.left;
		var plotAreaHeight = visHeight - visMargin.top - visMargin.bottom;

		//create respectice group elements for each vis element, assign them widht and height, and place them

		var visPlotArea = vis.append("g")
			.attr('class', 'camelot_viz_ext_camelotlinechart_visPlotArea')
			.attr("width", plotAreaWidth)
			.attr("height", plotAreaHeight)
			.attr("transform", "translate(" + (visMargin.left + defaultMargin.left) + "," + (visMargin.top + defaultMargin.top) + ")");

		/* -------------------------------------------------------Y and X Axes------------------------------------------------------- */

		//Y Axis
		//define a Y Axis scale
		var asRatioxAxisLabelsHeight = 20;
		var xAxisLabelsHeight = dset.length * asRatioxAxisLabelsHeight;
		var yAxisRange = plotAreaHeight - xAxisLabelsHeight;
		var yAxisScale = d3.scale.linear().rangeRound([yAxisRange, 0]);

		//assign domain with 20% for extra spacing
		yAxisScale.domain([0, maxMset * 1.20]);

		//Y Axis Line
		var visPlotArea_Yaxis = visPlotArea
			.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis")
			.attr("transform", "translate(" + 0 + "," + 0 + ")");
		if (yAxisLineVisibility) {
			visPlotArea_Yaxis.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_Line")
				.append("line")
				.attr("x1", 0)
				.attr("y1", 0)
				.attr("x2", 0)
				.attr("y2", yAxisRange);
		}

		var asRatio = 1000;
		var maxGrid = maxMset;

		if (maxMset < 2500 && maxMset >= 1000) {
			asRatio = 500;
			maxGrid = 2500;
		} else if (maxMset < 1000 && maxMset >= 500) {
			asRatio = 200;
			maxGrid = 1000;
		} else if (maxMset < 500 && maxMset >= 200) {
			asRatio = 100;
			maxGrid = 500;
		} else if (maxMset < 200 && maxMset >= 150) {
			asRatio = 40;
			maxGrid = 200;
		} else if (maxMset < 150 && maxMset >= 120) {
			asRatio = 30;
			maxGrid = 150;
		} else if (maxMset < 120 && maxMset >= 10) {
			asRatio = 20;
			maxGrid = 120;
		}
		maxGrid = maxGrid * 1.10;

		var numberOfTicks = (maxGrid / asRatio).toFixed(0);
		var tDist = asRatio;
		var ticks = [];
		for (var i = 0; i < numberOfTicks; i++) {
			var tick = {
				id: (i + 1) * tDist,
				label: (i + 1) * tDist >= 1000 ? ((i + 1) * tDist / 1000).toString() + "k" : ((i + 1) * tDist).toString()
			};
			ticks.push(tick);
		}

		//assign domain with 20% for extra spacing (already considered)
		yAxisScale.domain([0, maxGrid]);

		//Y Axis Grid Lines
		if (gridLinesVisibility) {
			var visYAxisGridLine = visPlotArea_Yaxis.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_GridLines");
			visYAxisGridLine.selectAll("camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_GridLine_Line")
				.data(ticks)
				.enter().append("line")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_GridLine_Line")
				.attr("x1", 0)
				.attr("y1", function(d) {
					return yAxisScale(d.id);
				})
				.attr("x2", plotAreaWidth)
				.attr("y2", function(d) {
					return yAxisScale(d.id);
				});
		}

		//Y Axis Ticks
		var visYAxisTicks = visPlotArea_Yaxis.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_Ticks");
		visYAxisTicks.selectAll("ccamelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_Ticks_Line")
			.data(ticks)
			.enter().append("line")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_Ticks_Line")
			.attr("x1", 0)
			.attr("y1", function(d) {
				return yAxisScale(d.id);
			})
			.attr("x2", -5)
			.attr("y2", function(d) {
				return yAxisScale(d.id);
			});

		//Y Axis Tick Labels
		var visYAxisLabels = visPlotArea_Yaxis.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_Labels");
		visYAxisLabels.selectAll("camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_Labels_Text")
			.data(ticks)
			.enter().append("text")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_Labels_Text")
			.attr("x", 0 - 30)
			.attr("y", function(d) {
				return yAxisScale(d.id);
			})
			.text(function(d) {
				return d.label;
			});

		if (yAxisLabelVisibility) {

			//Y Axis Main Label
			var mainLabelText = "";
			for (var i = 0; i < d3.max([mset.length, mset.length]); i++) {
				if (i < mset.length) {
					if (util.pixelLength(mainLabelText + mset[i]) < (plotAreaHeight - xAxisLabelsHeight - 20)) {
						mainLabelText = (mainLabelText.length === 0) ? mset[i] : mainLabelText + " & " + mset[i];
					} else {
						mainLabelText = mainLabelText + "...";
						break;
					}
				}
			}

			var visYAxisMainLabel = visPlotArea_Yaxis.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Yaxis_MainLabel");
			visYAxisMainLabel.append("text")
				.attr("x", -(plotAreaHeight / 2))
				.attr("y", -40)
				.text(mainLabelText)
				.attr("transform", "rotate(-90)");
		}

		//X Axis
		//define X Axis scale

		var xAxisScaleLowestDim = d3.scale.ordinal()
			.rangeRoundBands([0, plotAreaWidth]);
		xAxisScaleLowestDim.domain(csvData.map(function(d) {
			var cd = '';
			for (var j = 0; j < dset.length; j++) {
				cd = cd + d[dset[j]];
			}
			return cd;
		}));

		//X Axis Line
		var visPlotArea_Xaxis = visPlotArea
			.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis")
			.attr("transform", "translate(" + 0 + "," + (plotAreaHeight - xAxisLabelsHeight) + ")");
		visPlotArea_Xaxis.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Line")
			.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", plotAreaWidth)
			.attr("y2", 0);

		//X Axis Ticks
		var visXAxisTicks = visPlotArea_Xaxis.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Ticks");
		//first tick
		visXAxisTicks
			.append("line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", 0)
			.attr("y2", xAxisLabelsHeight);

		//ticks for the lowest dimension
		var visXAxisTicksLowestDim = visXAxisTicks.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Ticks_LowestDim");
		visXAxisTicksLowestDim.selectAll("camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Ticks_LowestDim")
			.data(csvData)
			.enter().append("line")
			.attr("x1", function(d, i) {
				return i * xAxisScaleLowestDim.rangeBand();
			})
			.attr("y1", 0)
			.attr("x2", function(d, i) {
				return i * xAxisScaleLowestDim.rangeBand();
			})
			.attr("y2", xAxisLabelsHeight - ((dset.length - 1) * asRatioxAxisLabelsHeight));

		//labels for the lowest dimension
		var visXAxisLabelsLowestDim = visPlotArea_Xaxis.append("g")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Labels");
		visXAxisLabelsLowestDim.selectAll("camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Labels_Text")
			.data(csvData)
			.enter().append("text")
			.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Labels_Text")
			.attr("x", function(d) {
				var cd = '';
				for (var j = 0; j < dset.length; j++) {
					cd = cd + d[dset[j]];
				}
				// return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand()) / 4);
				var label = d[dset[dset.length - 1]];
				var labelWidth = util.pixelLength(label);
				if (labelWidth > xAxisScaleLowestDim.rangeBand() / 2) {
					label = label.substring(0, 3) + ".";
					labelWidth = util.pixelLength(label);
				}
				return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() - labelWidth) / 2);
				//return xAxisScaleLowestDim(cd) + ((xAxisScaleLowestDim.rangeBand() - (d[dset[dset.length - 1]].length * 10)) / 2);
			})
			.attr("y", (xAxisLabelsHeight - (asRatioxAxisLabelsHeight * (dset.length - 1))))
			.text(function(d) {
				var label = d[dset[dset.length - 1]];
				var labelWidth = util.pixelLength(label);
				if (labelWidth > xAxisScaleLowestDim.rangeBand() / 2) {
					label = label.substring(0, 3) + ".";
				}
				return label;
			});

		//ticks and labels for all the higher dimensions
		for (var j = 0; j < dset.length - 1; j++) {
			var dimensions = [];
			var dimCount = [];
			var dimLabels = [];

			csvData.forEach(function(d) {
				var cd = '';
				var label = '';
				for (var l = 0; l <= j; l++) {
					cd = cd + d[dset[l]];
					label = d[dset[j]];
				}
				var index = dimensions.indexOf(cd);
				if (index <= -1) {
					dimensions.push(cd);
					if (dimCount.length > 0) {
						dimCount.push(1 + dimCount[dimCount.length - 1]);
					} else {
						dimCount.push(1);
					}
					dimLabels.push(label);
				} else {
					dimCount[index] = dimCount[index] + 1;
				}
			});

			var tickHeightVar = xAxisLabelsHeight - (j * asRatioxAxisLabelsHeight);
			var labelHeightVar = xAxisLabelsHeight - (j * asRatioxAxisLabelsHeight);

			var dimInfoArr = [];
			dimCount.forEach(function(d) {

				var dimInfo = {};
				dimInfo.dimensions = dimensions[dimCount.indexOf(d)];
				if (dimCount.indexOf(d) > 0) {
					dimInfo.dimCount = dimCount[dimCount.indexOf(d)] - dimCount[dimCount.indexOf(d) - 1];
				} else {
					dimInfo.dimCount = dimCount[dimCount.indexOf(d)];
				}
				dimInfo.dimCountPrev = dimCount[dimCount.indexOf(d) - 1];
				dimInfo.dimLabels = dimLabels[dimCount.indexOf(d)];

				dimInfoArr.push(dimInfo);
			});

			var visXAxisTicksDim = visXAxisTicks.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Ticks");
			visXAxisTicksDim.selectAll("camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Ticks_Dim")
				.data(dimCount)
				.enter().append("line")
				.attr("x1", function(d) {
					return xAxisScaleLowestDim.rangeBand() * d;
				})
				.attr("y1", 0)
				.attr("x2", function(d) {
					return xAxisScaleLowestDim.rangeBand() * d;
				})
				.attr("y2", tickHeightVar);

			var visXAxisLabels = visPlotArea_Xaxis.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Labels");
			visXAxisLabels.selectAll("camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Labels_Text")
				.data(dimInfoArr)
				.enter().append("text")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Xaxis_Labels_Text")
				.attr("x", function(d) {
					var labelWidth = util.pixelLength(d.dimLabels);
					if (d.dimCountPrev) {
						return (xAxisScaleLowestDim.rangeBand() * d.dimCountPrev) + (((xAxisScaleLowestDim.rangeBand() * d.dimCount) - labelWidth) / 2);
					} else {
						return ((xAxisScaleLowestDim.rangeBand() * d.dimCount) - labelWidth) / 2;
					}
				})
				.attr("y", labelHeightVar)
				.text(function(d) {
					return d.dimLabels;
				});
		}

		/* ---------------------------------------------------End of Y and X Axes------------------------------------------------------- */

		var mouseOver = function(label, value, object) {
			var position = d3.mouse(object);

			//append tooltip element
			var tooltip = vis.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_tooltip_container");

			tooltip.append("rect")
				.attr("class", "camelot_viz_ext_camelotlinechart_tooltip_container-rect")
				.attr("x", position[0] - 5)
				.attr("y", position[1] - 40)
				.attr("height", 20);

			var tooltip_text = tooltip.append("text")
				.attr("x", position[0])
				.attr("y", position[1] - 40)
				.html("<tspan dy=\"1.2em\">" + label + "</tspan>: <tspan > " + value + " </tspan>");

			var bbox = tooltip_text.node().getBBox();
			var bboxw = bbox.width * 1.1;
			tooltip.select(".camelot_viz_ext_camelotlinechart_tooltip_container-rect")
				.attr("width", bboxw);

		};

		/* ---------------------------------------------------Utilization KPI Line------------------------------------------------------ */
		if (utilKPIVisibility) {
			//75% utilization line
			var kpiLabel = "Utilization KPI";
			visPlotArea.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Utilization_RefLine")
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.append("line")
				.attr("x1", 0)
				.attr("y1", yAxisScale(capacityKpi))
				.attr("x2", plotAreaWidth)
				.attr("y2", yAxisScale(capacityKpi))
				.attr("stroke", utilKPIcolor)
				.on("mouseover", function() {
					mouseOver(kpiLabel, parseFloat(capacityKpi).toFixed(2) + "%", this);
				})
				.on("mouseout", function() {
					d3.select(".camelot_viz_ext_camelotlinechart_tooltip_container").remove();
				});
		}
		/* -------------------------------------------------End of Utilization KPI Line------------------------------------------------ */

		/* ---------------------------------------------------Utilization Line--------------------------------------------------------- */

		var msDataPoints = [];
		mset.forEach(function(meas, index) {
			var msDataPoint = {};
			var dataPoints = [];
			var lines = [];
			csvData.forEach(function(d, f, csvData) {
				var dataPoint = {};
				dataPoint.meas = meas;
				dataPoint.dim = d[dset[dset.length - 1]];
				dataPoint.val = d[meas];
				dataPoint.scaledVal = yAxisScale(d[meas]);
				dataPoints.push(dataPoint);

				var line = {};
				line.y1 = yAxisScale(d[meas]);
				if (csvData[f + 1]) {
					line.y2 = yAxisScale(csvData[f + 1][meas]);
					lines.push(line);
				}
			});
			msDataPoint.measIndex = index;
			msDataPoint.dataPoints = dataPoints;
			msDataPoint.lines = lines;
			msDataPoints.push(msDataPoint);
		});

		msDataPoints.forEach(function(msDataPoint, k) {

			var visPlotAreaDots = visPlotArea.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Dots");
			visPlotAreaDots.selectAll(".camelot_viz_ext_camelotlinechart_visPlotArea_Dots_Dot")
				.data(msDataPoint.dataPoints).enter()
				.append("circle")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Dots_Dot")
				.attr("cx", function(d, m) {
					return (m * xAxisScaleLowestDim.rangeBand()) + xAxisScaleLowestDim.rangeBand() / 2;
				})
				.attr("cy", function(d) {
					return d.scaledVal;
				})
				.attr("r", 5)
				.attr("fill", utilLineColor)
				.on("mouseover", function(d) {
					mouseOver(d.meas, d.val.toFixed(2).toString() + "%", this);
				})
				.on("mouseout", function() {
					d3.select(".camelot_viz_ext_camelotlinechart_tooltip_container").remove();
				});

			var visPlotAreaDotsLabels = visPlotArea.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_DotsLabels");
			visPlotAreaDotsLabels.selectAll(".camelot_viz_ext_camelotlinechart_visPlotArea_DotsLabels_Label")
				.data(msDataPoint.dataPoints).enter()
				.append("text")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_DotsLabels_Label")
				.attr("x", function(d, m) {
					return ((m * xAxisScaleLowestDim.rangeBand()) + xAxisScaleLowestDim.rangeBand() / 2) - 15;
				})
				.attr("y", function(d) {
					return d.scaledVal - 10;
				})
				.text(function(d) {
					return d.val.toFixed(2).toString() + "%";
				});

			var visPlotAreaLines = visPlotArea.append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Lines");
			visPlotAreaLines.selectAll(".camelot_viz_ext_camelotlinechart_visPlotArea_Lines_Line")
				.data(msDataPoint.lines).enter()
				.append("line")
				.attr("class", "camelot_viz_ext_camelotlinechart_visPlotArea_Lines_Line")
				.attr("x1", function(d, m) {
					return (m * xAxisScaleLowestDim.rangeBand()) + xAxisScaleLowestDim.rangeBand() / 2;
				})
				.attr("y1", function(d) {
					return d.y1;
				})
				.attr("x2", function(d, m) {
					return ((m + 1) * xAxisScaleLowestDim.rangeBand()) + xAxisScaleLowestDim.rangeBand() / 2;
				})
				.attr("y2", function(d) {
					return d.y2;
				})
				.attr("stroke", utilLineColor);

		});

		/* -----------------------------------------------End of Utilization Line------------------------------------------------------ */

		/* --------------------------------------------------------End of Plot Area------------------------------------------------------------------------- */

		/*----------------------------------------------------------------Legend---------------------------------------------------------------------------- */

		if (legendVisibility === true) {

			var legendWidth = visWidth - plotAreaWidth;
			var legendHeight = visHeight / 2 - visMargin.top;

			var legendElements = [];
			mset.forEach(function(d) {
				var legendElement = {
					legendColor: utilLineColor,
					legendText: d
				};
				legendElements.push(legendElement);
			});

			var visLegend = vis.append("g")
				.attr('class', 'camelot_viz_ext_camelotlinechart_visLegend')
				.attr("width", legendWidth)
				.attr("height", legendHeight)
				.attr("transform", "translate(" + (defaultMargin.left + visMargin.left + 20 + plotAreaWidth) + "," + (visMargin.top +
						defaultMargin.top) +
					")");

			var legendElementWidth = (plotAreaHeight / 50 > 5) ? 10 : 5;
			var xDistBetweenElements = legendElementWidth / 2;
			var legendElementHeight = legendElementWidth;
			var yDistBetweenElements = legendElementWidth;

			var legendTextSize = (legendElementHeight >= 10) ? 8 : 8;

			var legend = visLegend
				.selectAll(".camelot_viz_ext_camelotlinechart_visLegend_legend")
				.data(legendElements)
				.enter().append("g")
				.attr("class", "camelot_viz_ext_camelotlinechart_visLegend_legend")
				.attr("transform", function(d, l) {
					return "translate(0," + (l * (legendElementHeight + yDistBetweenElements)) + ")";
				});

			legend.append("line")
				.attr("x1", 0)
				.attr("y1", legendElementHeight / 2)
				.attr("x2", legendElementWidth)
				.attr("y2", legendElementHeight / 2)
				.attr("stroke", utilLineColor);
			legend.append("text")
				.attr("x", legendElementWidth + xDistBetweenElements)
				.attr("y", 0 + legendElementHeight)
				.text(function(d) {
					return d.legendText + " (%)";
				})
				.attr("font-size", legendTextSize);

			visLegend.append("line")
				.attr("x1", 0)
				.attr("y1", mset.length * (legendElementHeight + yDistBetweenElements) + legendElementHeight / 2)
				.attr("x2", legendElementWidth)
				.attr("y2", mset.length * (legendElementHeight + yDistBetweenElements) + legendElementHeight / 2)
				.attr("stroke", utilKPIcolor);
			visLegend.append("text")
				.attr("x", legendElementWidth + xDistBetweenElements)
				.attr("y", (mset.length * (legendElementHeight + yDistBetweenElements)) + legendElementHeight)
				.text(kpiLabel + " (%)")
				.attr("font-size", legendTextSize);
		}

		/*-------------------------------------------------------------End of Legend------------------------------------------------------------------------ */

		/* --------------------------------------------------------End of Plot Area------------------------------------------------------------------- */

	};

	return render;
});
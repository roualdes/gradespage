function makePlots() {
    var d3 = Plotly.d3;
    d3.csv('grades.csv', function(rawData) {

        var innerElementContainer = document.querySelector('[data-num="0"]'),
            elementSelector = innerElementContainer.querySelector('.element.form-control'),
            innerAssignmentContainer = document.querySelector('[data-num="1"'),
            assignmentSelector = innerAssignmentContainer.querySelector('.assignment.form-control');

        function setOptions(textArray, selector) {
            for (var i=0; i<textArray.length;  i++) {
                var currentOption = document.createElement('option');
                currentOption.text = textArray[i];
                selector.appendChild(currentOption);
            }
        }

        ////////////////////////////  table //////////////////////////////
        var listOfElements = {homework: 'hw', exams: 'exam', labs: 'lab',
                              quizzes: 'quiz', worksheets: 'worksheet',
                              presentations: 'presentations'};

        function getTableColumns(chosenElement) {
            var columns = [],
                assignments = Object.keys(rawData[0]);

            for (var i=0; i<assignments.length; i++) {
                if (assignments[i].includes(chosenElement)) {
                    columns.push(assignments[i]);
                }
            }
            return columns;
        }

        // Default Table data
        setTable('hw');

        function setTable(chosenElement) {

            var columns = getTableColumns(chosenElement);
            setOptions(columns, assignmentSelector);

            var table = d3.select("#grdTable")
			.style('display', 'block')
			.style('overflow-x', 'auto')
			.style('white-space', 'nowrap'),
                thead = table.append("thead"),
                tbody = table.append("tbody");

            // append the header row
            thead.append("tr")
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function(column) { return column; });

            var userData = rawData.filter(function(row) {
                if (row['First Name'] === 'D' && row['Last Name'] === 'E') {
                    return row;
                }
            });

            // create a row for each object in the data
            var rows = tbody.selectAll("tr")
                .data(userData)
                .enter()
                .append("tr");

	    // create a totals object to keep track of grade sums
	    var totals = {
	        hw: [0, 0, 0.15],
		exam: [0, 0, 0.40],
		lab: [0, 0, 0.15],
		quiz: [0, 0, 0.15],
		worksheet: [0, 0, 0.15],
		presentation: [0, 0, 0.15] };

            // create a cell in each row for each column
            var cells = rows.selectAll("td")
                .data(function(row) {

		    // sum grades into totals object
		    Object.keys(row).forEach(function(asn) {
		        Object.values(listOfElements).forEach(function(el) {
		            if (asn.includes(el)) {
			        totals[el][0] += parseInt(row[asn]);
				++totals[el][1];
			    }
			});
		    });

                    return columns.map(function(column) {
                        if (column.includes(chosenElement)) {
                            return {column: column, value: row[column]};
                        }
                    });
                })
                .enter()
                .append("td")
                .text(function(d) { return d.value; });

	    // only show percentages if there the component has grades
	    if (cells[0].length > 1) {
	     	// calculate current category's percentage
		var cat = String((totals[chosenElement][0]
		    / (totals[chosenElement][1] * 10) * 100)
		    .toFixed(2)) + '%';
	     	
	     	// calculate total grade percentage
		var comb = ["lab", "worksheet", "quiz"];
		var sum = [0, 0, 0, 0];
		Object.keys(totals).forEach(function(grade) {
		    if (totals[grade][1] > 0) {
			if (!comb.includes(grade)) {
			    sum[0] += (totals[grade][0]
				/ (totals[grade][1] * 10)
				* totals[grade][2]);
			    sum[1] += totals[grade][2];
			} else {
			    sum[2] += totals[grade][0];
			    sum[3] += totals[grade][1];
			}
		    }
		});

		if (sum[3] > 0) {
		    sum[0] += (sum[2] / (sum[3] * 10) * 0.15);
		    sum[1] += 0.15;
		}
		sum = String((sum[0] / sum[1] * 100).toFixed(2)) + '%';

	     	// add current category's percentage to table
		columns.unshift(chosenElement);
		thead.selectAll("tr").insert("th", ":first-child").text(chosenElement);
		rows.insert("td", ":first-child").text(cat);


	     	// add total grade percentage to table
		columns.unshift("total");
		thead.selectAll("tr")
		    .insert("th", ":first-child")
		    .text("total");
		rows.insert("td", ":first-child").text(sum);
	   }
	   setPlot(columns[2]);
        }

        setOptions(Object.keys(listOfElements), elementSelector);

        function updateElement() {
            // clear table
            d3.select("#grdTable").selectAll("*").remove();
            // clear assignment's selection menu
            d3.select(".assignment.form-control").selectAll("*").remove();
            setTable(listOfElements[elementSelector.value]);
        }

        elementSelector.addEventListener('change', updateElement, false);

        //////////////////////////  histogram ////////////////////////////
        var currentData = [];

        function getAssignmentData(chosenAssignment) {
            currentData = [];
            for (var i=0; i<rawData.length; i++) {
                currentData.push(rawData[i][chosenAssignment]);
            }
        };

        function setPlot(chosenAssignment) {

            if (chosenAssignment == null) {
                // clear histogram
                d3.select("#histogram").selectAll("*").remove();
                // clear assignment's selection menu
                d3.select(".assignment.form-control").selectAll("*").remove();
                return;
            }
            getAssignmentData(chosenAssignment);

            var trace = {
                x: currentData,
                type: 'histogram',
                nbinsx: 10
            };
            var data = [trace];

            var grade = +rawData[0][chosenAssignment];
            var layout = {
                title: chosenAssignment.toUpperCase(),
                xaxis: {title: 'Percentage',
                        ticks: 'outside',
                        zeroline: false,
                        showline: true},
                yaxis: {title: 'Count',
                        ticks: 'outside',
                        zeroline: false,
                        showline: true},
                shapes: [{
                    type: 'line',
                    x0: grade,
                    y0: 0,
                    x1: grade,
                    y1: 1,
                    line: {width: 2.5}
                }]
            };

            Plotly.newPlot(document.getElementById('histogram'), data, layout,
                           {modeBarButtonsToRemove: ['sendDataToCloud']});
        };

        function updateAssignment(){
            setPlot(assignmentSelector.value);
        }

        assignmentSelector.addEventListener('change', updateAssignment, false);

    });
};

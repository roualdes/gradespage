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

            var table = d3.select("#grdTable"),
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

            // create a cell in each row for each column
            var cells = rows.selectAll("td")
                .data(function(row) {
                    return columns.map(function(column) {
                        if (column.includes(chosenElement)) {
                            return {column: column, value: row[column]};
                        }
                    });
                })
                .enter()
                .append("td")
                .text(function(d) { return d.value; });

            setPlot(columns[0]);
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

; (function (global, $) {
    'use strict'

    //creating a 'new' object so user don't have to
    var Tables = function (name) {
        return new Tables.init(name);
    }

    // hidden within the scope of the IIFE and never directly accessible
    var hiddenVariables = [];

    function _countColumns(json) {
        var max = 0;
        for (var i = 0; i < json.length; i++) {
            var numProperties = Object.keys(json[i]).length;
            if (numProperties > max) {
                max = numProperties;
            }
        }
        return max;
    }

    function _getColumnIndex(table, columnName) {
        var headers = table.headers;
        for (var i = 0; i < headers.length; i++) {
            if (headers[i] === columnName)
                return i;
        }
    }

    function _createEmptyTable(location) {
        var table = document.createElement('table');
        if(location) {
            jQuery(location).append(table);
        } else {
            jQuery('body').append(table);
        }

        return table;
    }

    function _filterTable(table, userInput, reversed) {
        if (userInput === "") {
            $(table.rows).show();
            $('.highlight').removeClass('highlight');
        } else {
            $(table.rows).filter(function () {
                if (reversed) {
                    _highlightTex($(this).find('td'), userInput)
                    return $(this).text().indexOf(userInput) !== -1;
                } else {
                    _highlightTex($(this).find('td'), userInput)
                    return $(this).text().indexOf(userInput) === -1;
                }
            }).hide();
        }

        function _highlightTex(data, userInput) {
            for (var i = 0; i < data.length; i++) {
                var text = data[i].textContent;
                var index = text.indexOf(userInput);
                if (index >= 0) {
                    var highlightedText = text.substring(0, index) + "<span class='highlight'>" + text.substring(index, index + userInput.length) + "</span>" + text.substring(index + text.length);
                    data[i].innerHTML = text.replace(userInput, highlightedText);
                }
            }
        }
    }

    // prototype holds methods (to save memory space)
    Tables.prototype = {

        // 'this' refers to the calling object at execution time
        //table headers array must match jsonData object keys
        newTable: function (location) {
            this.table = _createEmptyTable(location);

            return this;
        },

        addHeaders(headers) {
            this.table.headers = headers;
            var tr = $('<tr>');

            for (var i = 0; i < headers.length; i++) {
                $('<th>' + headers[i] + '</td>').appendTo(tr);
                tr.appendTo(this.table);
            }

            return this;
        },

        addData(json) {
            var numRows = json.length;
            var headers = this.table.headers;
            var numCols = headers.length;

            for (var r = 1; r < numRows; r++) {
                var tr = $('<tr>');
                for (var c = 0; c < numCols; c++) {
                    var headerName = headers[c];
                    var jsonValue = json[r][headerName];
                    console.log(jsonValue)
                    $('<td>' + jsonValue + '</td>').appendTo(tr);
                }
                tr.appendTo(this.table);
            }
            return this;
        },

        sortBy(sortType, columnName, direction) {
            var table = this.table;
            var columnIndex = _getColumnIndex(table, columnName);
            var rows, switching, x, y, shouldSwitch, direction, switchcount = 0;
            switching = true;

            while (switching) {
                switching = false;
                rows = table.rows;

                for (var i = 1; i < (rows.length - 1); i++) {
                    shouldSwitch = false;

                    x = rows[i].getElementsByTagName('td')[columnIndex];
                    y = rows[i + 1].getElementsByTagName('td')[columnIndex];

                    //TODO: refactor this
                    if (sortType === 'alphabetic') {
                        if (direction === 'ascending') {
                            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                                shouldSwitch = true;
                                break;
                            }
                        } else if (direction === 'descending') {
                            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                                shouldSwitch = true;
                                break;
                            }
                        }
                    } else if (sortType === 'numeric') {
                        if (direction === 'ascending') {
                            if (Number(x.innerHTML) > Number(y.innerHTML)) {
                                shouldSwitch = true;
                                break;
                            }
                        } else if (direction === 'descending') {
                            if ((Number(x.innerHTML) < Number(y.innerHTML))) {
                                shouldSwitch = true;
                                break;
                            }
                        }
                    } else if (sortType === 'date') {
                        if (direction === 'ascending') {
                            if (new Date(x.innerHTML) > new Date(y.innerHTML)) {
                                shouldSwitch = true;
                                break;
                            }
                        } else if (direction === 'descending') {
                            if (new Date(x.innerHTML) < new Date(y.innerHTML)) {
                                shouldSwitch = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldSwitch) {
                    rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                    switching = true;
                    switchcount++;
                } else {
                    if (switchcount == 0 && direction == "ascending") {
                        direction = "descending";
                        switching = true;
                    }
                }
            }
            return this;
        },

        addFilter() {
            var table = this.table;
            $('input').bind("enterKey", function (e) {
                _filterTable(table, e.target.value)
            });
            $('input').keyup(function (e) {
                if (e.keyCode == 13) {
                    $(this).trigger("enterKey");
                }
            });
        }

    };

    Tables.init = function (name) {
        var self = this;
        self.name = name || 'no-name';
    }

    // trick borrowed from jQuery so we don't have to use the 'new' keyword
    Tables.init.prototype = Tables.prototype;

    // attach Tables to the global object, and provide a shorthand '$T'.
    global.Tables = global.T$ = Tables;

}(window, jQuery));
/*The MIT License (MIT)

 Copyright (c) 2014 https://github.com/kayalshri/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.*/

(function($) {
    
    function s2ab(s) {
        if(typeof ArrayBuffer !== 'undefined') {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        } else {
            var buf = new Array(s.length);
            for (var i=0; i!=s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
    };

    $.fn.extend({
        tableExport : function(options) {
            var defaults = {
                separator : ',',
                ignoreColumn : [],
                tableName : 'yourTableName',
                type : 'csv',
                pdfFontSize : 14,
                pdfLeftMargin : 20,
                escape : 'true',
                htmlContent : 'false',
                consoleLog : 'false',
                fileName : 'tableExport'
            };

            var options = $.extend(defaults, options);   
            var $tName = $('#' + this[0].id);
            // $tName.bootstrapTable('refreshOptions', {
                // pageSize: 'All'
            // });                         
            var el = this;

            if (defaults.type == 'csv' || defaults.type == 'txt') {
                defaults.fileName += defaults.type === 'csv' ? '.csv' : '.txt';
                // Header
                var tdData = "";
                $(el).find('thead').find('tr').each(function() {
                    tdData += "\r\n";
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '"' + defaults.separator;
                            }
                        }

                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });

                // Row vs Column
                $(el).find('tbody').find('tr').each(function() {
                    tdData += "\r\n";
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '"' + defaults.separator;
                            }
                        }
                    });
                    //tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });

                //output
                if (defaults.consoleLog == 'true') {
                    console.log(tdData);
                }
                var base64data = "base64," + $.base64.encode(tdData);
                var uri = 'data:application/vnd.ms-' + defaults.type + ';' + base64data;

                var blob = new Blob([tdData], {
                    type: 'data:application/vnd.ms-' + defaults.type + ';',
                });
                saveAs(blob, defaults.fileName);

                // if (defaults.fileName == '') {
                    // window.open(uri);
                // } else {
                    // var downloadLink = document.createElement("a");
                    // downloadLink.href = uri;
                    // downloadLink.download = defaults.fileName;
// 
                    // document.body.appendChild(downloadLink);
                    // downloadLink.click();
                    // document.body.removeChild(downloadLink);
                // }
                return;
            } else if (defaults.type == 'sql') {
                defaults.fileName += '.sql';
                // Header
                var tdData = "INSERT INTO `" + defaults.tableName + "` (";
                $(el).find('thead').find('tr').each(function() {

                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '`' + parseString($(this)) + '`,';
                            }
                        }

                    });
                    tdData = $.trim(tdData);
                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                });
                tdData += ") VALUES ";
                // Row vs Column
                $(el).find('tbody').find('tr').each(function() {
                    tdData += "(";
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                tdData += '"' + parseString($(this)) + '",';
                            }
                        }
                    });

                    tdData = $.trim(tdData).substring(0, tdData.length - 1);
                    tdData += "),";
                });
                tdData = $.trim(tdData).substring(0, tdData.length - 1);
                tdData += ";";

                //output
                //console.log(tdData);

                if (defaults.consoleLog == 'true') {
                    console.log(tdData);
                }

                var base64data = "base64," + $.base64.encode(tdData);
                window.open('data:application/sql;filename=exportData;' + base64data);

            } else if (defaults.type == 'json') {
                defaults.fileName += '.json';
                var jsonHeaderArray = [];
                $(el).find('thead').find('tr').each(function() {
                    var tdData = "";
                    var jsonArrayTd = [];

                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                jsonArrayTd.push(parseString($(this)));
                            }
                        }
                    });
                    jsonHeaderArray.push(jsonArrayTd);

                });

                var jsonArray = [];
                $(el).find('tbody').find('tr').each(function() {
                    var tdData = "";
                    var jsonArrayTd = [];

                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                jsonArrayTd.push(parseString($(this)));
                            }
                        }
                    });
                    jsonArray.push(jsonArrayTd);

                });

                var jsonExportArray = [];
                jsonExportArray.push({
                    header : jsonHeaderArray,
                    data : jsonArray
                });

                //Return as JSON
                //console.log(JSON.stringify(jsonExportArray));

                //Return as Array
                //console.log(jsonExportArray);
                if (defaults.consoleLog == 'true') {
                    console.log(JSON.stringify(jsonExportArray));
                }
                var base64data = "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
                window.open('data:application/json;filename=exportData;' + base64data);
            } else if (defaults.type == 'xml') {
                defaults.fileName += '.xml';
                var xml = '<?xml version="1.0" encoding="utf-8"?>';
                xml += '<tabledata><fields>';

                // Header
                $(el).find('thead').find('tr').each(function() {
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                xml += "<field>" + parseString($(this)) + "</field>";
                            }
                        }
                    });
                });
                xml += '</fields><data>';

                // Row Vs Column
                var rowCount = 1;
                $(el).find('tbody').find('tr').each(function() {
                    xml += '<row id="' + rowCount + '">';
                    var colCount = 0;
                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                xml += "<column-" + colCount + ">" + parseString($(this)) + "</column-" + colCount + ">";
                            }
                        }
                        colCount++;
                    });
                    rowCount++;
                    xml += '</row>';
                });
                xml += '</data></tabledata>';

                if (defaults.consoleLog == 'true') {
                    console.log(xml);
                }

                var base64data = "base64," + $.base64.encode(xml);
                window.open('data:application/xml;filename=exportData;' + base64data);

            } else if (defaults.type == 'xls' || defaults.type == 'excel' || defaults.type == 'doc' || defaults.type == 'powerpoint') {
                if (defaults.type == 'xls' || defaults.type == 'excel'){
                    defaults.fileName += '.xlsx';
                    var wb = XLSX.utils.table_to_book(el[0], {sheet:"Sheet JS"});
                    var wbout = XLSX.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});
                    var fname = defaults.fileName;
                    try {
                        saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fname);
                    } catch(e) { if(typeof console != 'undefined') console.log(e, wbout); }
                    return;
                }
                else if (defaults.type == 'doc')
                    defaults.fileName += '.doc';
                if (defaults.type == 'powerpoint')
                    defaults.fileName += '.ppt';

                //console.log($(this).html());
                var excel = "<table>";
                // Header
                $(el).find('thead').find('tr').each(function() {
                    excel += "<tr>";
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                excel += "<td>" + parseString($(this)) + "</td>";
                            }
                        }
                    });
                    excel += '</tr>';

                });

                // var numPages = options.totalPages; //options.data.length / options.pageSize;
                // Row Vs Column
                // for (var i=0; i < numPages; i++) {
                    var rowCount = 1;
                    $(el).find('tbody').find('tr').each(function() {
                        excel += "<tr>";
                        var colCount = 0;
                        $(this).filter(':visible').find('td').each(function(index, data) {
                            if ($(this).css('display') != 'none') {
                                if (defaults.ignoreColumn.indexOf(index) == -1) {
                                    excel += "<td>" + parseString($(this)) + "</td>";
                                }
                            }
                            colCount++;
                        });
                        rowCount++;
                        excel += '</tr>';
                    });
                    // $tName.bootstrapTable('nextPage');
                // };

                excel += '</table>';

                excel = excel.replaceAll('<tr></tr>', '');
                if (defaults.consoleLog == 'true') {
                    console.log(excel);
                }

                var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:" + defaults.type + "' xmlns='http://www.w3.org/TR/REC-html40'>";
                excelFile += "<head>";
                excelFile += "<!--[if gte mso 9]>";
                excelFile += "<xml>";
                excelFile += "<x:ExcelWorkbook>";
                excelFile += "<x:ExcelWorksheets>";
                excelFile += "<x:ExcelWorksheet>";
                excelFile += "<x:Name>";
                excelFile += "{worksheet}";
                excelFile += "</x:Name>";
                excelFile += "<x:WorksheetOptions>";
                excelFile += "<x:DisplayGridlines/>";
                excelFile += "</x:WorksheetOptions>";
                excelFile += "</x:ExcelWorksheet>";
                excelFile += "</x:ExcelWorksheets>";
                excelFile += "</x:ExcelWorkbook>";
                excelFile += "</xml>";
                excelFile += "<![endif]-->";
                excelFile += "</head>";
                excelFile += "<body>";
                excelFile += excel;
                excelFile += "</body>";
                excelFile += "</html>";
                var blob = new Blob([excelFile], {
                    type: 'data:application/vnd.ms-' + defaults.type + ';',
                });
                saveAs(blob, defaults.fileName);
                
            } else if (defaults.type == 'png') {
                defaults.fileName += '.png';
                html2canvas($(el), {
                    onrendered : function(canvas) {
                        var img = canvas.toDataURL("image/png");
                        window.open(img);
                    }
                });
            } else if (defaults.type == 'pdf') {
                defaults.fileName += '.pdf';
                var doc = new jsPDF('p', 'pt', 'a4', true);
                doc.setFontSize(defaults.pdfFontSize);

                // Header
                var startColPosition = defaults.pdfLeftMargin;
                $(el).find('thead').find('tr').each(function() {
                    $(this).filter(':visible').find('th').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, 20, parseString($(this)));
                            }
                        }
                    });
                });

                // Row Vs Column
                var startRowPosition = 20;
                var page = 1;
                var rowPosition = 0;
                $(el).find('tbody').find('tr').each(function(index, data) {
                    rowCalc = index + 1;

                    if (rowCalc % 26 == 0) {
                        doc.addPage();
                        page++;
                        startRowPosition = startRowPosition + 10;
                    }
                    rowPosition = (startRowPosition + (rowCalc * 10)) - ((page - 1) * 280);

                    $(this).filter(':visible').find('td').each(function(index, data) {
                        if ($(this).css('display') != 'none') {
                            if (defaults.ignoreColumn.indexOf(index) == -1) {
                                var colPosition = startColPosition + (index * 50);
                                doc.text(colPosition, rowPosition, parseString($(this)));
                            }
                        }

                    });

                });

                // Output as Data URI
                doc.output('datauri');
            }
            
            function parseString(data) {

                if (defaults.htmlContent == 'true') {
                    content_data = data.html().trim();
                } else {
                    content_data = data.text().trim();
                }

                if (defaults.escape == 'true') {
                    content_data = escape(content_data);
                }

                return content_data;
            }

        }
    });
})(jQuery);


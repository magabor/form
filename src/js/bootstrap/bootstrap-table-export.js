(function ($) {
    'use strict';

    var TYPE_NAME = {
        json: 'JSON',
        xml: 'XML',
        //html: 'HTML',
        png: 'PNG',
        csv: 'CSV',
        //txt: 'TXT',
        sql: 'SQL',
        excel: 'Ms-Excel',
        //excel2: 'Excel',
        pdf: 'PDF'
    };

    $.extend($.fn.bootstrapTable.defaults, {
        showExport: false,
        exportDataType: 'all', // basic, all, selected
        // 'json', 'xml', 'png', 'csv', 'txt', 'sql', 'doc', 'excel', 'powerpoint', 'pdf'
        exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel', 'pdf'],
        exportOptions: {}
    });

    

    /* PDF */
    function createPDF(columns, dataRows, title) {
        var centeredText = function(doc, text, y) {
            var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.getWidth() - textWidth) / 2;
            doc.text(text, textOffset, y);
        }

        var rightText = function(doc, text, y) {
            var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            var textOffset = (doc.internal.pageSize.getWidth() - textWidth - 15);
            doc.text(text, textOffset, y);
        }

        var rightImage = function(doc, imageData, format, top, width, height) {
            var offset = (doc.internal.pageSize.getWidth() - width - 15);
            doc.addImage(imageData, format, offset, top, width, height);
        }

        var col = columns;
        var rows = [];
        var itemNew = dataRows;

        itemNew.forEach(element => {
            var temp = [];
            for (var i = 0; i < col.length; i++) {
                if (element[col[i]] != undefined) {
                    temp.push(element[col[i]].toString().replace(/<br\s*[\/]?>/gi, "\n"));
                }
            }
            rows.push(temp);
        });

        var options = {};

        var paperSizes = {
            'A0': 'a0',
            'A1': 'a1',
            'A2': 'a2',
            'A3': 'a3',
            'A4': 'a4',
            'Letter': 'letter'
        };
        var paperSizeOptions = "";

        for (var paperSizeKey in paperSizes) {
            if (paperSizeKey == "A4") {
                paperSizeOptions += '<option selected value="' + paperSizes[paperSizeKey] + '">' + paperSizeKey + '</option>';
            } else {
                paperSizeOptions += '<option value="' + paperSizes[paperSizeKey] + '">' + paperSizeKey + '</option>';
            }
        }

        var fontSizeOptions = "";

        for (var i = 5; i < 73; i++) {
            if (i == 7) {
                fontSizeOptions += '<option selected value="' + i + '">' + i + '</option>';
            } else {
                fontSizeOptions += '<option value="' + i + '">' + i + '</option>';
            }
        }

        var submitDlg = bootbox.dialog({
            message:
            '<style>' +
                '.form-group{margin-bottom: 11px;}' +
                '#PDF_Options{margin-left: auto; margin-right: auto; width:250px;}' +
                '#PDF_portrait{margin-right: 20px;}' +
                '#PDF_landscape{margin-left: 20px;}' +
                '.orientationButton{font-size: 30px;}' +
                '.narrowerForm{width: 180px; margin: 0 auto;}' +
            '</style>' +
            '<div id="PDF_Options">' +
                '<div class="form-group narrowerForm" style="text-align: center;">' +
                    '<button id="PDF_portrait" class="btn btn-default orientationButton active" data-toggle="tooltip" data-placement="bottom" title="Portrait" onclick="toggleOrientation(this.id)"><span class="fa fa-file-o"></span></button>' +
                    '<button id="PDF_landscape" class="btn btn-default orientationButton" data-toggle="tooltip" data-placement="bottom" title="Landscape" onclick="toggleOrientation(this.id)"><span class="fa fa-file-o fa-rotate-90"></span></button>' +
                    '<input id="PDF_orientation" type="text" value="portrait" style="display: none;"/>' +
                '</div>' +
                '<br>' +
                '<div class="form-group narrowerForm"><div class="input-group"><span class="input-group-addon" data-toggle="tooltip" data-placement="bottom" title="Paper size"><i class="fa fa-arrows-h fa-fw"></i></span>' +
                    '<select required id="PDF_paperSize" class="form-control dropDown selectCentered">' + paperSizeOptions + '</select></div>' +
                '</div>' +
                '<br>' +
                '<div class="form-group narrowerForm"><div class="input-group"><span class="input-group-addon" data-toggle="tooltip" data-placement="bottom" title="Font size"><i class="fa fa-font fa-fw"></i></span>' +
                    '<select required id="PDF_customFontSize" class="form-control dropDown selectCentered">' + fontSizeOptions + '</select></div>' +
                '</div>' +
            '</div>'
            ,
            title: 'PDF Options',
            className: 'bootbox-dialog',
            size: 'small',
            buttons: {
                confirm: {
                    label: 'Export',
                    className: 'btn-success',
                    callback: function () {
                        var PDF_orientation = $('#PDF_orientation').val(),
                            PDF_paperSize = $('#PDF_paperSize').val(),
                            customFontSize = $('#PDF_customFontSize').val()
                            ;
                        
                        options = {
                            orientation: PDF_orientation,
                            format: PDF_paperSize
                        };

                        var doc = new jsPDF(options);

                        var desiredHeight = 15;
                        var customerWidth = vR.images["customer"]["width"] / vR.images["customer"]["height"] * desiredHeight;
                        doc.addImage(vR.images["customer"]["img"], 'PNG', 15, 10, customerWidth, desiredHeight);
                        
                        rightImage(doc, vR.images["TeleworX"]["img"], 'JPEG', 10, 38, 8);
                
                        var filename = title + '_' + getFormattedTime() + '.pdf';
                        title = title.split('_').join(' ');
                        var date = getFormattedTime(true);
                
                        doc.setFontSize(10);
                        rightText(doc, date, 45);
                        
                        doc.setFontSize(14);
                        centeredText(doc, title, 45);
                        
                        const totalPagesExp = "{total_pages_count_string}";

                        doc.autoTable({
                            head: [col],
                            body: rows,
                            rowPageBreak: 'avoid',
                            styles: {
                                fontSize: customFontSize,
                                minCellWidth: 20
                            },
                            headStyles: {
                                fillColor: $('#loginName').css('background-color')
                            },
                            startY: 50,
                            didDrawPage: data => {
                                let footerStr = "Page " + doc.internal.getNumberOfPages();
                                if (typeof doc.putTotalPages === 'function') {
                                    footerStr = footerStr + " of " + totalPagesExp;
                                }
                                doc.setFontSize(9);
                                doc.text(footerStr, 15, doc.internal.pageSize.getHeight() - 10);
                            }
                        });
                
                        if (typeof doc.putTotalPages === 'function') {
                            doc.putTotalPages(totalPagesExp);
                        }
                        
                        doc.save(filename);
                    }
                },
                cancel: {
                    label: 'Cancel',
                    className: 'btn-danger'
                }
            }
        });
        submitDlg.init(function () {
            showBackdrop(submitDlg);
        });
        submitDlg.on("shown.bs.modal", function () {
            submitDlg.attr("id", "PDF_options");
        });
        
    }

    /* CSV creation */
    function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;
        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }
        columnDelimiter = args.columnDelimiter || ';';
        lineDelimiter = args.lineDelimiter || '\n';
        keys = Object.keys(data[0]);
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;
        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });
        return result;
    }

    /* CSV download */
    function downloadCSV(args, tableData) {
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: tableData
        });
        if (csv == null) return;
        filename = args.filename || 'export.csv';
        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=UTF-8,' + '\uFEFF' + csv;
        }
        data = encodeURI(csv);
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }

    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initToolbar = BootstrapTable.prototype.initToolbar;

    BootstrapTable.prototype.initToolbar = function () {
        this.showToolbar = this.options.showExport;

        _initToolbar.apply(this, Array.prototype.slice.apply(arguments));

        if (this.options.showExport) {
            var that = this,
                $btnGroup = this.$toolbar.find('>.btn-group'),
                $export = $btnGroup.find('div.export');

            if (!$export.length) {
                $export = $([
                    '<div class="export btn-group">',
                        '<button class="btn btn-default dropdown-toggle" ' +
                            'data-toggle="dropdown" type="button">',
                            '<i class="glyphicon glyphicon-export"></i> ',
                            '<span class="caret"></span>',
                        '</button>',
                        '<ul class="dropdown-menu" role="menu">',
                        '</ul>',
                    '</div>'].join('')).appendTo($btnGroup);

                var $menu = $export.find('.dropdown-menu'),
                    exportTypes = this.options.exportTypes;

                if (typeof this.options.exportTypes === 'string') {
                    var types = this.options.exportTypes.slice(1, -1).replace(/ /g, '').split(',');

                    exportTypes = [];
                    $.each(types, function (i, value) {
                        exportTypes.push(value.slice(1, -1));
                    });
                }

                $.each(exportTypes, function (i, type) {
                    if (TYPE_NAME.hasOwnProperty(type)) {
                        $menu.append(['<li data-type="' + type + '">',
                                '<a href="javascript:void(0)">',
                                    TYPE_NAME[type],
                                '</a>',
                            '</li>'].join(''));
                    }
                });

                $menu.find('li').click(function () {
                    var type = $(this).data('type'),
                        doExport = function () {
                            that.$el.tableExport($.extend({}, that.options, {
                                type: type,
                                escape: false,
                                separator: that.$body[0].parentElement.separator
                            }));
                        };
                    //var exportOption = that.$body[0].parentElement.title2; //don't use title --> it pops up as tooltip!
                    var exportOption = 'all';
                    if (exportOption === 'all') { // This second part has been commented since all exports should go through this code// && that.options.pagination) {
                        // Get selected columns
                        var columns = [];
                        var numberOfColumns = that.columns.length;
                        for (var i = 0; i < numberOfColumns; i++) {
                            if (that.columns[i].visible) {
                                columns.push(that.columns[i].field);
                            }
                        }

                        // Get rows of selected columns
                        var rows = [];
                        if (numberOfColumns != columns.length) {                          
                            for (var i = 0; i < that.data.length; i++) {
                                rows[i] = {};
                                for (var j = 0; j < columns.length; j++) {
                                    rows[i][columns[j]] = that.data[i][columns[j]];
                                }
                            }
                        } else {
                            rows = that.data;
                        }
                        
                        // "Actions" column is removed (if it exists).
                        var removedActionsColumn = removeColumn('Actions', columns, rows);
                        columns = removedActionsColumn.columns;
                        rows = removedActionsColumn.rows;

                        // When exporting a table with checkbox, the first column will be 0, so it needs to be removed.
                        var removedCheckboxColumn = removeColumn(0, columns, rows);
                        columns = removedCheckboxColumn.columns;
                        rows = removedCheckboxColumn.rows;

                        if (type === 'excel') {
                            var wb = XLSX.utils.book_new(),
                                ws = XLSX.utils.json_to_sheet(rows);
                            // If table is empty, no file will be downloaded.
                            if (!rows.hasOwnProperty("0")) {
                                return;
                            }
                            // Removes header if first row has the name 'Header'
                            if (rows["0"].hasOwnProperty('Header')) {
                                ws = XLSX.utils.json_to_sheet(rows, {skipHeader: 1});
                            }
                            XLSX.utils.book_append_sheet(wb, ws, 'table');
                            XLSX.writeFile(wb, 'tableExport.xlsx');
                        } else if (type === 'excel2') {
                            dpUI.loading.start("Loading ...");
                            $.ajax({
                                cache: false,
                                url: 'php/PHPOffice/phpspreadsheetxlsx.php',
                                method: 'POST',
                                data: {
                                    'table': JSON.stringify(rows),
                                    'columns': JSON.stringify(columns)
                                },
                                success:function(data){
                                    dpUI.loading.stop();
                                    var opResult = JSON.parse(data);
                                    var $a=$("<a>");
                                    $a.attr("href",opResult.data);
                                    $("body").append($a);
                                    var title = that.$el[0].id + '_' + getFormattedTime() + '.xlsx';
                                    $a.attr("download",title);
                                    $a[0].click();
                                    $a.remove();
                                }
                            });
                        } else if (type === 'csv') {
                            //var title = that.$el[0].id + '_' + getFormattedTime() + '.csv';
                            var title = that.$el[0].id + '_' + getFormattedTime() + '.csv';
                            downloadCSV({ filename: title }, rows);

                            /*dpUI.loading.start("Loading ...");
                            //var stringified = JSON.stringify(rows);
                            //var compressed = LZString.compressToBase64(stringified);
                            // console.log('[rows]', rows);
                            // console.log('[stringified]', stringified);
                            // console.log('[compressed]', compressed);
                            console.log(RJSON.pack('[RJSON]', rows));
                            $.ajax({
                                cache: false,
                                url: 'php/PHPOffice/phpspreadsheetcsv.php',
                                method: 'POST',
                                data: {
                                    //'table': compressed,
                                    //'table': JSON.stringify(RJSON.pack(rows)),
                                    'table': JSON.stringify(rows),
                                    'columns': JSON.stringify(columns)
                                },
                                success:function(data){
                                    dpUI.loading.stop();
                                    var opResult = JSON.parse(data);
                                    var $a=$("<a>");
                                    $a.attr("href",opResult.data);
                                    $("body").append($a);
                                    var title = that.$el[0].id + '_' + getFormattedTime() + '.csv';
                                    $a.attr("download",title);
                                    $a[0].click();
                                    $a.remove();
                                }
                            });*/
                        } else if (type === 'html') {
                            dpUI.loading.start("Loading ...");
                            $.ajax({
                                cache: false,
                                url: 'php/PHPOffice/phpspreadsheethtml.php',
                                method: 'POST',
                                data: {
                                    'table': JSON.stringify(rows),
                                    'columns': JSON.stringify(columns)
                                },
                                success:function(data){
                                    dpUI.loading.stop();
                                    var opResult = JSON.parse(data);
                                    var $a=$("<a>");
                                    $a.attr("href",opResult.data);
                                    $("body").append($a);
                                    var title = that.$el[0].id + '_' + getFormattedTime() + '.html';
                                    $a.attr("download",title);
                                    $a[0].click();
                                    $a.remove();
                                },
                                always: function(xhr, textStatus, error){
                                    console.log(xhr.statusText);
                                    console.log(textStatus);
                                    console.log(error);
                                }
                            });
                        } else if (type === 'pdf') {
                            
                            if (vR.checkNested(that, 'options', 'exportOptions', 'fileName')) {
                                var title = that.options.exportOptions.fileName;
                            } else {
                                var title = that.$el[0].id;
                            }
                            createPDF(columns, rows, title);

                            /*dpUI.loading.start("Loading ...");
                            $.ajax({
                                cache: false,
                                url: 'php/PHPOffice/phpspreadsheetpdf.php',
                                method: 'POST',
                                data: {
                                    'table': JSON.stringify(rows),
                                    'columns': JSON.stringify(that.header.fields),
                                    'title': JSON.stringify(that.$el[0].id),
                                    'date': getFormattedTime(true)
                                },
                                success:function(data){
                                    dpUI.loading.stop();
                                    var opResult = JSON.parse(data);
                                    var $a=$("<a>");
                                    $a.attr("href",opResult.data);
                                    $("body").append($a);
                                    var title = that.$el[0].id + '_' + getFormattedTime() + '.pdf';
                                    $a.attr("download",title);
                                    $a[0].click();
                                    $a.remove();
                                }
                            });*/
                        } else {
                            // AddOrRemoveSpinner('customReportTable-wrapper', true, 'Add', false);
                            that.$el.one(that.options.sidePagination === 'server' ? 'post-body.bs.table' : 'page-change.bs.table', function () {
                                doExport();
                                that.togglePagination();
                                dpUI.loading.stop();
                            });
                            dpUI.loading.start("Exporting...", undefined, undefined, undefined, "#" + that.$el[0].id);
                            setTimeout(function() { that.togglePagination(); }, 0);
                            // AddOrRemoveSpinner('customReportTable-wrapper', true, 'Remove', false);
                            // that.$el.on('load-success.bs.table', function () {
                            //     doExport();
                            //     that.$el.off('load-success.bs.table');
                            //     that.togglePagination();
                            // });
                        }
                    } else if (that.options.exportDataType === 'selected') {
                        var data = that.getData(),
                            selectedData = that.getAllSelections();

                        that.load(selectedData);
                        doExport();
                        that.load(data);
                    } else {
                        doExport();
                    }
                });
            }
        }
    };
})(jQuery);

function getFormattedTime(formatted) {
    var today = new Date();
    var yy = today.getFullYear();
    var mm = addZero(today.getMonth()+1);
    var dd = addZero(today.getDate());
    var m = addZero(today.getMinutes());
    var s = addZero(today.getSeconds());
    if (formatted) {
        var h = today.getHours();
        return dd + "-" + mm + "-" + yy + " " + h + ":" + m + ":" + s;
    } else {
        var h = addZero(today.getHours());
        return yy + "-" + mm + "-" + dd + "_" + h + "-" + m + "-" + s;
    }
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function removeColumn(columnName, columns, rows) {
    if (columns.includes(columnName)) {
        var index = columns.indexOf(columnName);
        if (index !== -1) columns.splice(index, 1);
        for (var i = 0; i < rows.length; i++) {
            delete rows[i][columnName];
        }
    }
    return {
        columns: columns,
        rows: rows
    };
}

function toggleOrientation(clickedButton) {
    if (clickedButton === 'PDF_portrait' && $('#PDF_portrait').hasClass("active")) {
        return;
    } else if (clickedButton === 'PDF_landscape' && $('#PDF_landscape').hasClass("active")) {
        return;
    }
    document.getElementById("PDF_orientation").value = clickedButton.split('_')[1];
    $('#PDF_portrait').toggleClass("active");
    $('#PDF_landscape').toggleClass("active");
}

// Backdrop handling for modals.
function showBackdrop(modal) {
    var modals = document.getElementsByClassName('modal');
    var zIndexList = [];
    var backdrop = modal.next();
    for (var i = 0; i < modals.length; i++){
        zIndexList.push(getComputedStyle(modals.item(i)).zIndex);
    }
    var max = zIndexList.sort().slice(-1);
    backdrop.css('z-index', ++max);
    modal.css('z-index', ++max)
}
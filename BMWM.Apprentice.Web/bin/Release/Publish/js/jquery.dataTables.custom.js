//2016-11-11 Kitti Veragulniyom
//set datatable default
$.extend(true, $.fn.dataTable.defaults, {
    "dom": '<"row"<"col-xs-6"l><"col-xs-6">r>t<"row"<"col-xs-6"i><"col-xs-6"p>>',
    //"stateSave": true,
    //"pageLength": 25,
    "processing": true,
    "language": {
        "processing": "<i class='fa fa-spinner fa-spin'></i> Processing..."
    }
});
var dataTableHelper = {

    rowSelectTag: function (value, name) {
        if (typeof name === 'undefined') { name = 'ids'; }
        return '<label class="position-relative"><input type="checkbox" name="' + name + '" value="' + value + '" class="ace datatable-select" /><span class="lbl"></span></label>';
    },

    handleSelection: function (e, selectCallback) {
        $t = $(e).closest('table');
        $selectall = $('input.datatable-selectall:checkbox', $t);
        $selectall.attr('checked', false); //deselect select all cb
        dataTableHelper.performSelectAction(e, selectCallback); //perform action(as no selected)
        
        //bind event for select all
        $selectall.click(function (event) {
            $selects = $('input.datatable-select:checkbox', $(event.target).closest('table'));
            $selects.prop('checked', event.target.checked);

            //highlight/un-highlight row
            $selects.each(function (j, cb) {
                if (event.target.checked)
                    $(cb).closest('tr').addClass('success');
                else
                    $(cb).closest('tr').removeClass('success');
            });

            dataTableHelper.performSelectAction(event.target, selectCallback);
        });
        //bind event for select
        $('input.datatable-select:checkbox', $t).click(function (event) {
            //highlight/un-highlight row
            if (event.target.checked)
                $(event.target).closest('tr').addClass('success');
            else
                $(event.target).closest('tr').removeClass('success');
            //check/un-check select all
            $tbody = $(event.target).closest('tbody');
            nselect = $('input.datatable-select:checkbox', $tbody).length;
            nselected = $('input.datatable-select:checkbox:checked', $tbody).length;
            $selectall.prop('checked', nselect == nselected);

            dataTableHelper.performSelectAction(event.target, selectCallback);
        });
    },

    performSelectAction: function (e, callback) {
        var $t = $(e).closest('table');
        var $selectedcb = $('input.datatable-select:checkbox:checked', $t);
        $($t.attr("data-datatable-select-action")).prop("disabled", !($selectedcb.length > 0));
        if (callback) {
            callback($selectedcb, $t); //pass ([selected checkboxs jq obj], [table jq obj]) to callback function
        }
    },

    getSelectedObject: function (t) {
        return $('input.datatable-select:checkbox:checked', $(t));
    },
    deleteSelected: function (dt, action, requireToken, confirm, confirmMessage, callback) {
        var $selected = dataTableHelper.getSelectedObject(dt);
        if (confirm) {
            var cmsg = '';
            if (confirmMessage) {
                cmsg = String.format(confirmMessage, $selected.serializeArray().length);
            } else {
                cmsg = String.format('Are you sure you want to delete these {0} items?', $selected.serializeArray().length);
            }
            bootbox.confirm(cmsg, function (result) {
                if (result) {
                    dataTableHelper.callDeleteSelected(dt, $selected, action, requireToken, callback);
                }
            });
        } else {
            dataTableHelper.callDeleteSelected(dt, $selected, action, requireToken, callback);
        }
    },
    callDeleteSelected: function (dt, $selected, action, requireToken, callback) {
        var d = $selected.serialize();
        if (requireToken)
            d += "&__RequestVerificationToken=" + $('input[name="__RequestVerificationToken"]').val();
        $.ajax({
            type: 'POST',
            async: false,
            url: action,
            data: d
        }).done(function (res) {
            if (res.hasOwnProperty('success')) { //check if is Toptier.Web.Common.JsonResult
                if (res.success) {
                    $(dt).DataTable().ajax.reload(); //reload datatable
                    if (typeof callback == "function") callback();
                }
                else {
                    handleAjaxErrorResult(res);
                }
            } else {
                $(dt).DataTable().ajax.reload(); //reload datatable
                if (typeof callback == "function") callback();
            }
        });
    }
};
(function ($) {
    $.fn.dataTableDelete = function (options) {
        //default options
        var defaults = $.extend({
            dt: null,
            action: null,
            requireToken: true,
            confirm: true,
            confirmMessage: null,
            callback: null
        }, options);

        if (!defaults.dt) { //find first datatable in document
            defaults.dt = $('.dataTable').attr('id');
        }
        if (!defaults.action) {
            defaults.action = './DeleteItems';
        }

        return this.click(function () {
            dataTableHelper.deleteSelected(defaults.dt, defaults.action, defaults.requireToken, defaults.confirm, defaults.confirmMessage, defaults.callback);
        });
    };
}(jQuery));

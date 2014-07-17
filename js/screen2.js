//Call startup function onDeviceReady when device is ready
$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    //onDeviceReady()
});

// call the other functions used on screen 2
function onDeviceReady()
{
	console.log("onDeviceReady");
    document.addEventListener("backbutton", onBackKeyDown, true);

    var saved = window.localStorage.getItem(storageKeys.sessionOutput);

    if(saved)
    {
        var vm = ko.mapping.fromJSON(saved);
        vm.struct_data = JSON.parse(ko.toJSON(vm.struct_data));

        window.localStorage.removeItem(storageKeys.sessionOutput);

        $("#a-save-confirm").removeAttr("data-bind");
        $("#div-footer-with-email").removeClass("hidden");
    }
    else
    {
        var data = window.localStorage.getItem(vmKeys.screen1);
        var screen1vm = ko.mapping.fromJSON(data);
        var vm = new ViewModel();
        vm.session = screen1vm;

        calculations(vm);
        loadStructData(vm);
        $("#div-footer-with-save").removeClass("hidden");
    }

    bindUI(vm);

    ko.applyBindings(vm);

    if($("#table3 tr:visible").length > 2)
    {
        if($("#table3 tr:visible:eq(1) td:first").html() == "Not Permitted")
        {
            $("#table3 tr:visible:eq(1)").remove();   
        }
    }
}

function onBackKeyDown()
{
    navigateTo("screen1.html");
}

function calculations(ViewModel){
    var faColHeader = [0.25, 0.5, 0.75, 1,   1.25];
    var fvColHeader = [0.1,  0.2, 0.3,  0.4, 0.5];
    //Parsing variables
    var site, siteName;
    var sa1, sa2;
    var Importance_Cate;
    var isOtherSiteClass;
    //Formula variables
    var faRow, fvRow;
    var faInterp, fvInterp;
    var faFinalValue, fvFinalValue;
    var ieFaSa2, ieFvSa1;
    var fasa2;


    //Parsing data from screen1
    site = ko.toJSON(ViewModel.session.siteClass['Site Properties']);
    siteName = ko.toJSON(ViewModel.session.siteClass.value); 
    siteName = JSON.parse(site)+ " - " + JSON.parse(siteName);
    site = formatSiteOption(site);
    sa1 = ko.toJSON(ViewModel.session.location.Sa10);
    sa1 = parseFloat(JSON.parse(sa1));
    sa2 = ko.toJSON(ViewModel.session.location.Sa02);
    sa2 = parseFloat(JSON.parse(sa2));
    Importance_Cate =  ko.toJSON(ViewModel.session.importanceCategory.value);
    Importance_Cate = parseFloat(JSON.parse(Importance_Cate));
    isOtherSiteClass = JSON.parse(ko.toJSON(ViewModel.session.isOtherSiteClass));

    //calling formula methods
    faRow = getTableRow(faTable(),site,5);
    fvRow = getTableRow(fvTable(),site,5);
    faInterp = getFAVInterp(faRow, sa2, faColHeader);
    fvInterp = getFAVInterp(fvRow, sa1, fvColHeader);
    if(isOtherSiteClass == true)
    {
        faFinalValue = parseFloat(ViewModel.session.fa());
        fvFinalValue = parseFloat(ViewModel.session.fv());
    }
    else
    {
        faFinalValue = getFAV(faInterp);
        fvFinalValue = getFAV(fvInterp);
    }

    ieFaSa2 = getIeFAVSa(Importance_Cate,faFinalValue,sa2);
    ieFvSa1 = getIeFAVSa(Importance_Cate,fvFinalValue,sa1);

    fasa2 = faFinalValue * sa2;

    // Update view values
    ViewModel.ie = Importance_Cate;
    ViewModel.fa = faFinalValue;
    ViewModel.fv = fvFinalValue;
    ViewModel.siteClass = siteName;
    ViewModel.hght = ViewModel.session.buildingHeight;
    ViewModel.iefasa02 = ieFaSa2;
    ViewModel.iefvsa10 = ieFvSa1;
    ViewModel.fasa02 = fasa2;
    ViewModel.sa02(sa2);
    if(ViewModel.iefasa02 <= 0.12)
    {
        ViewModel.needsConsideration(true);
    }
    else
    {
        ViewModel.needsConsideration(false);
    }
}

function loadStructData(ViewModel){
    loadJsonFile("../../json/structural_system.json", function(data) {
        $.each(data, function(index, item) {
            ViewModel.struct_data().push(item);
        });
    });

     var restrictions = [0,0,0,0];
     var apIeFvSa10;
     var apIeFaSa02;
     var restrictionIeFvSa02;
     var dataSize = ViewModel.struct_data().length;
     var displayValue = null;
     var Importance_Cate =  parseFloat(JSON.parse(ko.toJSON(ViewModel.session.importanceCategory.value)));

     for(var i = 0; i < dataSize; i++)
     {
        restrictions[0] = parseFloat(JSON.parse(ko.toJSON(ViewModel.struct_data()[i].lt02)));
        restrictions[1] = parseFloat(JSON.parse(ko.toJSON(ViewModel.struct_data()[i].gteq02lt035)));
        restrictions[2] = parseFloat(JSON.parse(ko.toJSON(ViewModel.struct_data()[i].gteq035lt075)));
        restrictions[3] = parseFloat(JSON.parse(ko.toJSON(ViewModel.struct_data()[i].gt075)));

        restrictionIeFvSa02 = parseFloat(JSON.parse(ko.toJSON(ViewModel.struct_data()[i].gt03)));

        apIeFaSa02 = getAppRestrFASa02(ViewModel.iefasa02,restrictions);
        apIeFvSa10 = getAppRestrFVSa10(ViewModel.iefvsa10,restrictionIeFvSa02);

        finalRestriction = getFinalRestr(apIeFvSa10, apIeFaSa02, Importance_Cate, i);

        displayValue = getHeightLimit(ViewModel.hght(), finalRestriction);

        ViewModel.struct_data()[i].heightLimit = displayValue;
     }
}

function isRowVisible(heightLimit)
{
    if(ko.isObservable(heightLimit))
        heightLimit = heightLimit();

    if(heightLimit && heightLimit == "Not permitted")
    {
        return false;
    }

    return true;
}

function round(number)
{
    if(ko.isObservable(number))
        number = number();

    var decimals = 3;
    var newnumber = new Number(number + '').toFixed(parseInt(decimals));
    return parseFloat(newnumber);
}

function bindUI(viewModel)
{
    $("#modal-output").modal({
        keyboard: false
    });

    $("#modal-output").modal("hide");

    $("#a-email").click(function() {
        $('*').contents().each(function() {
            if(this.nodeType == 8) {
                $(this).remove()
            }
        });

        var body = $("#div-fakeContent").html();

        if(body)
        {
            var action = 'mailto: ?subject=' + viewModel.outputName() + '&body=' + body;
            window.location = action;
        }
    });

    $("#a-save").click(function() {
        $("#modal-output").modal("show");
    });

    $("#a-back").click(function() {
        navigateTo("screen1.html");
    });

    $("#modal-output").removeClass("hidden");
}

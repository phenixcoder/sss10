$(document).ready(function () {
    //document.addEventListener("deviceready", onDeviceReady, false);
    onDeviceReady();
});

function onDeviceReady()
{
    console.log("onDeviceReady");

    var session = window.localStorage.getItem(storageKeys.sessionInput);
    if(session)
    {
        window.localStorage.removeItem(storageKeys.sessionInput);
        var input = JSON.parse(session);

        var vm = new Screen1ViewModel();
        loadJson(vm);

        vm.province(
            ko.utils.arrayFirst(vm.provinces(), function(item) {
                return item.symbol == input.province.symbol;
            })
        );

        vm.location(
            ko.utils.arrayFirst(vm.locations(), function(item) {
                return item.City == input.location.City;
            })
        );

        vm.importanceCategory(
            ko.utils.arrayFirst(vm.importanceCategories(), function(item) {
                return item['Importance Category'] == input.importanceCategory['Importance Category'];
            })
        );

        vm.siteClass(
            ko.utils.arrayFirst(vm.siteProperties(), function(item) {
                return item['Site Properties'] == input.siteClass['Site Properties'];
            })
        );

        vm.isUserSpecified(input.isUserSpecified);
        vm.buildingHeight(input.buildingHeight);
        vm.fa(input.fa);
        vm.fv(input.fv);
    }
    else
    {
        var vm = new Screen1ViewModel();
        loadJson(vm);
    }

    bindUI(vm);

    ko.applyBindings(vm);
}

function bindUI(viewModel) {

    $("#a-next").click(function() {
        var copy = viewModel;
        delete copy.provinces;
        delete copy.cities;
        delete copy.locations;
        delete copy.importanceCategories;
        delete copy.siteProperties;

        var data = ko.toJSON(copy);

        window.localStorage.setItem(vmKeys.screen1, data);
        window.localStorage.setItem(storageKeys.sessionInput, data);

        navigateTo("screen2.html");
    });

    viewModel.province.subscribe(function(newProvince){
        viewModel.location(viewModel.locations()[0]);
    });
}

function loadJson(viewModel)
{
    loadJsonFile("../../json/provinces.json", function(data) {
        $.each(data, function(index, item) {
            viewModel.provinces().push(item);
        });
    });

    loadJsonFile("../../json/cities.json", function(data) {
        $.each(data, function(index, item) {
            viewModel.cities().push(item);
        });

        viewModel.locations = ko.computed(function() {
            return ko.utils.arrayFilter(viewModel.cities(), function(city) {
                if(viewModel.province())
                {
                    return city.Province == viewModel.province().symbol;
                }
            });
        });
    });

    loadJsonFile("../../json/importance_categories.json", function(data) {
        var initial;

        $.each(data, function(index, item) {
            viewModel.importanceCategories().push(item);
            if(item["Importance Category"] == "Normal")
            {
                initial = item;
            }
        });

        viewModel.importanceCategory(initial);
    });

    loadJsonFile("../../json/site_classes.json", function(data) {
        var initial;
        $.each(data, function(index, item) {
            item.tOutput = item["Site Properties"] + " - " + item.value;
            viewModel.siteProperties().push(item);
            if(item["Site Properties"] == "C")
            {
                initial = item;
            }
        });

        viewModel.siteClass(initial);
    });
}

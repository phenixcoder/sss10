function DirectoryViewModel() {
	var self = this;

	self.searchTerm = ko.observable();
    self.province = ko.observable();
    self.city = ko.observable();
    self.type = ko.observable();
    self.isCertfiedOnly = ko.observable(false);
    
    self.provinces = ko.observable();
    self.types = ko.observable();
    self.cities = ko.observable();

	self.members = ko.observable();
    self.totalPages = ko.observable();
    self.currentPage = ko.observable(0);

    self.isAPIInit = ko.observable(false);
    self.isCityFilterInputEnabled = ko.observable(false);
    self.isMemberTypeFilterInputEnabled = ko.observable(false);

    self.nextPage = function()
    {
        var nextPage = self.currentPage() + 1;
        if(nextPage < self.totalPages())
        {
            self.currentPage(nextPage);
        }

        self.search();
    }

    self.prevPage = function()
    {
        var prevPage = self.currentPage() - 1;
        if(prevPage >= 0)
        {
            self.currentPage(prevPage);
        }

        self.search();
    }

    self.search = function() {
        if(!self.searchTerm())
        {
            self.searchTerm("");
        }

        var city = "";
        if(self.city())
        {
            city = self.city().ItemKey;
        }

        self.api.getMembers(self.currentPage(), self.province().ItemID, self.searchTerm(), city, self.type().ItemID, self.isCertfiedOnly());
    };

    self.searchClick = function() {
        self.currentPage(0);
        self.search();

        var city = "";
        if(self.city())
        {
            city = self.city().ItemKey;
        }

        self.api.getMemberCities(self.province().ItemID, self.searchTerm());
        self.api.getMembersCount(self.province().ItemID, self.searchTerm(), city, self.type().ItemID, self.isCertfiedOnly());
    }

    self.reset = function() {
        window.location.reload();
    };

    self.api = new API(self);

    self.init = function() {
        self.api.getProvinces();
        self.api.getMemberType();
        self.api.getMembers(0, 0, "");
        self.api.getMemberCities(0, "");
        self.api.getMembersCount(0, "", "", 0, false);
    };

    self.openEmail = function(item)
    {
        var emailAction = 'mailto:' + item.Email;
        window.location = emailAction;
    };

    self.openUrl = function(item)
    {
        var address = "http://" + item.WebsiteAddress;
        var ref = window.open(address, '_blank', 'location=yes');
        ref.show();
        ref.addEventListener('exit', function() {
                                ref.close();
                             });
    };
}

$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    //onDeviceReady();
});

function onDeviceReady()
{
    console.log("onDeviceReady");

    var vm = new DirectoryViewModel();
    vm.init();

    // vm.province.subscribe(function(newValue) {
    //     vm.api.getMemberCities(vm.province().ItemID, "");
    // });

    // vm.isFilterEnabled.subscribe(function(newValue) {
    //     if(vm.isFilterEnabled() && !vm.isAPIInit())
    //     {
    //         vm.init();
    //     }
    // });

    //bindUI(vm);
    
    ko.applyBindings(vm);
}

function disableUI()
{
    $("input,select").attr("disabled", "disabled");
}

function enableUI()
{
    $("input,select").removeAttr("disabled");
}

function bindUI(viewModel) {
}

function API(viewModel) {
    var self = this;

    var baseUri = 'http://cisc-icca.ca/cisc/ws/directory/ciscdirectory.asmx';

    self.getProvinces = function() {
        showLoading();

        var provinceReq = $.ajax({
                contentType: "application/json",
                type: "POST",
                url: baseUri + "/GetProvinces",
                data: JSON.stringify({ lang: 'en-CA' }),
                //async: false,
                beforeSend: function(xhr) {
                    //xhr.setRequestHeader("Authorization", "Basic Y2lzYzpjIyRzZjQyZkg0");
                },
                success: function(raw)
                {
                    var data = JSON.parse(raw.d);
                    viewModel.provinces(data);

                    if(!viewModel.isAPIInit())
                    {
                        viewModel.isAPIInit(true);
                    }

                    hideLoading();
                },
                error: function(data)
                {
                    console.log(data);
                }
            });
    }

    self.getMemberType = function() {
        showLoading();

        var typeReq = $.ajax({
                contentType: "application/json",
                type: "POST",
                url: baseUri + "/GetMemberType",
                data: JSON.stringify({ lang: 'en-CA' }),
                //async: false,
                beforeSend: function(xhr) {
                    //xhr.setRequestHeader("Authorization", "Basic Y2lzYzpjIyRzZjQyZkg0");
                },
                success: function(raw)
                {
                    var data = JSON.parse(raw.d);
                    viewModel.types(data);

                    hideLoading();
                    viewModel.isMemberTypeFilterInputEnabled(true);
                },
                error: function(data)
                {
                    console.log(data);
                }
            });
    }

    self.getMemberCities = function(provID, keyword) {
        viewModel.isCityFilterInputEnabled(false);
        var baseUri = "http://cisc-icca.ca/api/ciscdirectory";
        var args = JSON.stringify({ lang: 'en-CA', provID: provID, keyword: keyword });

        var cityReq = $.ajax({
                contentType: "application/json",
                type: "GET",
                url: baseUri + "/GetCities?&memberOptions=" + args,
                //data: args,
                //async: false,
                beforeSend: function(xhr) {
                    //xhr.setRequestHeader("Authorization", "Basic Y2lzYzpjIyRzZjQyZkg0");
                },
                success: function(raw)
                {
                    var data = raw;
                    if(data)
                    {
                        viewModel.cities(data);
                    
                        ko.utils.arrayForEach(viewModel.cities(), function(item) {
                            if(viewModel.city())
                            {
                                if(item.ItemKey == viewModel.city().ItemKey)
                                {
                                    viewModel.city(item);
                                }
                            }
                        });

                        viewModel.isCityFilterInputEnabled(true); 
                    }
                },
                error: function(data)
                {
                    console.log(data);
                }
            });
    }

    self.getMembers = function(page, provID, keyword, city, memberType, certifiedOnly) {
        showLoading();
        var baseUri = "http://cisc-icca.ca/api/ciscdirectory";
        var args = JSON.stringify({ lang: 'en-CA', provID: provID, keyword: keyword, city: city, memberType: memberType, certifiedOnly: certifiedOnly });
        var skip = page * 10;
        
        var memberReq = $.ajax({
                contentType: "application/json",
                type: "GET",
                url: baseUri + "/GetMembers?&$top=" + 10 + "&$skip=" + skip + "&memberOptions=" + args,
                //data: args,
                //async: false,
                beforeSend: function(xhr) {
                    //xhr.setRequestHeader("Authorization", "Basic Y2lzYzpjIyRzZjQyZkg0");
                },
                success: function(raw)
                {
                    var data = raw;
                    if(data && data.length > 0)
                    {
                        viewModel.members(data);

                        showResults();
                    }
                    else
                    {
                        showNoResults();
                    }
                },
                error: function(data)
                {
                    console.log(data);
                }
            });
    }

    self.getMembersCount = function(provID, keyword, city, memberType, certifiedOnly) {
        var baseUri = "http://cisc-icca.ca/api/ciscdirectory";
        var args = JSON.stringify({ lang: 'en-CA', provID: provID, keyword: keyword, city: city, memberType: memberType, certifiedOnly: certifiedOnly });
        
        var memberReq = $.ajax({
                contentType: "application/json",
                type: "GET",
                url: baseUri + "/GetMembersSearchCount?&memberOptions=" + args,
                //data: args,
                //async: false,
                beforeSend: function(xhr) {
                    //xhr.setRequestHeader("Authorization", "Basic Y2lzYzpjIyRzZjQyZkg0");
                },
                success: function(raw)
                {
                    var data = raw;

                    viewModel.totalPages(Math.ceil(data/10));
                },
                error: function(data)
                {
                    console.log(data);
                }
            });

    }
};

function showResults()
{
    $(".div-info").addClass("hidden");
    $("#div-results").removeClass("hidden");
}

function showNoResults()
{
    $(".div-info").addClass("hidden");
    $("#div-no-results").removeClass("hidden");
}

function showLoading()
{
    $(".div-info").addClass("hidden");
    $("#div-loading").removeClass("hidden");
}

function hideLoading()
{
    $("#div-loading").addClass("hidden");
}


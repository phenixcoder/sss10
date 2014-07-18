function Screen1ViewModel()
{
    var self = this;
    
    //input
    self.isUserSpecified = ko.observable(false);
    self.province = ko.observable();
    self.location = ko.observable();
    self.importanceCategory = ko.observable();
    self.siteClass = ko.observable();
    self.buildingHeight = ko.observable(0).extend({ min: 0 })

    self.isOtherSiteClass = ko.computed(function() {
        if(self.siteClass())
        {
            var selected = self.siteClass();
            return (selected["Site Properties"] == "F");
        }

        return false;
    });
    self.fa = ko.observable(0);
    self.fv = ko.observable(0);

    //data
    self.provinces = ko.observableArray();
    self.cities = ko.observableArray();
    self.locations;
    self.importanceCategories = ko.observableArray();
    self.siteProperties = ko.observableArray();
};
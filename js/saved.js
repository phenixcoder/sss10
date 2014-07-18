function SavedViewModel(items)
{
	self = this;

	self.items = ko.observableArray(items);
    self.raw = items;

    self.navigate = function(item) {
        window.localStorage.setItem(storageKeys.sessionOutput, ko.toJSON(item.data));
        navigateTo("../sss10/screen2.html")
    };

    self.delete = function(item) {
        for(var i = 0; i < self.raw.length; i++)
        {
            if(self.raw[i].id == item.id)
            {
                self.raw.splice(i, 1);
                break;
            }
        }

        window.localStorage.setItem(storageKeys.savedOutput, ko.toJSON(self.raw));
        self.refresh();
    };

    self.refresh = function()
    {
        window.location.reload();
    }
}

$(document).ready(function () {
    document.addEventListener("deviceready", onDeviceReady, false);
    //onDeviceReady();
});

function onDeviceReady()
{
    console.log("onDeviceReady");

    var data = window.localStorage.getItem(storageKeys.savedOutput);
	var items = JSON.parse(data);

	var vm = new SavedViewModel(items);
	ko.applyBindings(vm);
}
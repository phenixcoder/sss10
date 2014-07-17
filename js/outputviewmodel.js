function OutputViewModel(data)
{
	self = this;

	self.id = new Date().getTime();
	self.name = data.outputName();
	self.city = data.session.location.City();
	self.province = data.session.location.Province();
	self.isUserSpecified = data.session.isUserSpecified();
	self.data = data;
	self.date = new Date(self.id).toDateString();
}
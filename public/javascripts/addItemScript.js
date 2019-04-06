var showDeliveryCost = document.getElementById("showDeliveryCost");
var showPickupAddress = document.getElementById("showPickupAddress");
showDeliveryCost.style.display = 'none';
showPickupAddress.style.display = 'none';

$('select').on('change', function() {
    $('#showDeliveryCost').toggle(this.value=='deliverables');
    $('#showPickupAddress').toggle(this.value=='pickups');
});
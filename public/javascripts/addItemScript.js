$('select').on('change', function() {
    $('#showDeliveryCost').toggle(this.value=='deliverables');
    $('#showPickupAddress').toggle(this.value=='pickups');
});
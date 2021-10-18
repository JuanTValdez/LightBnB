$(() => {
  getAllListings().then(function (json) {
    propertyListings.addProperties(json.properties);
    views_manager.show('listings');
    console.log('Words:  ');
    $('.reserve-button').on('click', function () {
      console.log('more words');
      const idData = $(this).attr('id').substring(17);
      views_manager.show('newReservation', idData);
    });
  });
});

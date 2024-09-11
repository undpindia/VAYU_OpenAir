$(document).ready(function() {
  $('#id_state').change(function() {
    var selectedstate = $(this).val();
    if (selectedstate) {
      $.ajax({
        url: "/get_district/",
        type: "GET",
        data: { state: selectedstate },
        success: function(data) {
          $('#id_district').empty();
          $.each(data, function(i, item) {
            $('#id_district').append($('<option>', { 
              value: i,
              text : item
            }));
          });
        }
      });
    } else {
      $('#id_district').empty();
    }
  });
});

$(document).ready(function() {
  $('#id_district').change(function() {
    var selectedstate = $(this).val();
    if (selectedstate) {
      $.ajax({
        url: "/get_state/",
        type: "GET",
        data: { district: selectedstate },
        success: function(data) {
          $('#id_state').empty();
          $.each(data, function(i, item) {
            $('#id_state').append($('<option>', { 
              value: i,
              text : item
            }));
          });
        }
      });
    } else {
      $('#id_state').empty();
    }
  });
});

$(document).ready(function() {
  $('#id_state').change(function() {
    var selectedstate = $(this).val();
    if (selectedstate) {
      $.ajax({
        url: "/get_district/",
        type: "GET",
        data: { state: selectedstate },
        success: function(data) {
          $('#id_distict').empty();
          $.each(data, function(i, item) {
            $('#id_distict').append($('<option>', { 
              value: i,
              text : item
            }));
          });
        }
      });
    } else {
      $('#id_distict').empty();
    }
  });
});

$(document).ready(function() {
  $('#id_distict').change(function() {
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

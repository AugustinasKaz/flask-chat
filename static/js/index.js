
$(document).ready(function () {
  localStorage.removeItem('username')
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  socket.on('connect', function () {
    socket.emit('first_load');

    if (localStorage.getItem("username")) {
      $("#Display_picture").attr("src", localStorage.getItem("picture"));
      $("#header-name").append(localStorage.getItem("username"));
    }
    else {
      $("#myModal").modal({ backdrop: 'static', keyboard: false });
      $("#button_modal").prop('disabled', true);
      $("#user_input").val('');

      $('#button_modal').on('click', function () {
        var username = $('#user_input').val();
        const time = (new Date).getHours() + ":" + (new Date).getMinutes();
        const picture = "/static/picture1.png";
        $("#Display_picture").attr("src", picture);
        $("#header-name").append(username);
        localStorage.setItem("username", $('#user_input').val());
        socket.emit('new username', { 'username': username, 'time': time, 'message': 'has joined the room', 'picture': picture });
      });

      $("#user_input").on("keyup", function (key) {
        if ($(this).val().length <= 3) {
          $("#button_modal").prop('disabled', true);
        }
        else {
          $("#button_modal").prop('disabled', false);
          if (key.keyCode == 13)
            $("#button_modal").click();
        }
      });
    }


    $("#msg_text").on('keyup', function (key) {
      if (key.keyCode == 13) {
        const username = localStorage.getItem("username");
        const message = $("#msg_text").val();
        const time = (new Date).getHours() + ":" + (new Date).getMinutes();
        const picture = localStorage.getItem("picture");
        $("#msg_text").val(" ");
        socket.emit('to all', { 'message1': message, 'username1': username, 'time1': time, 'picture1': picture });
      }
    })
  });

  socket.on('pranesti', function (data) {
    messagesL(data);
  });

  socket.on('add username', function (data) {
    //$("#Display_user").append(localStorage.getItem("username"));
    messagesL(data);
  })

  socket.on('add picture', function (data) {
    messagesL(data);
  })

  $("#button_form").on('press', function () {
    var msg_len = $("#msg_text").val();
    if (msg_len <= 0)
      $("#button_form").prop('disabled', true);
    else {
      const username = localStorage.getItem("username");
      const message = $("#msg_text").val();
      const time = (new Date).getHours() + ":" + (new Date).getMinutes();
      const picture = localStorage.getItem("picture");
      $("#msg_text").val(" ");
      socket.emit('to all', { 'message1': message, 'username1': username, 'time1': time, 'picture1': picture });
    }
  })
});

function messagesL(data) {
  $("#message-display").html('');
  for (i in data['channels']) {
    if (data['channels'][i]['vartotojas'] == localStorage.getItem('username'))
      user_msg_div(data['channels'][i]['time'], data['channels'][i]['vartotojas'], data['channels'][i]['picture'], data['channels'][i]['tekstas']);
    else
      other_msg_div(data['channels'][i]['time'], data['channels'][i]['vartotojas'], './static/picture2.png', data['channels'][i]['tekstas']);
  }
}

function user_msg_div(time, user, picture, text) {
  const boxMain = document.createElement('div');
  boxMain.className = 'msg-1';
  const box1 = document.createElement('div');
  var tmp1 = document.createElement('label');
  var tmp2 = document.createElement('label');
  tmp1.innerHTML = time;
  tmp2.innerHTML = user;
  box1.append(tmp1, tmp2);
  box1.className = 'username_time-1';


  const box2 = document.createElement('p');
  box2.innerHTML = text;
  box2.className = 'text-1';

  const box3 = document.createElement('img');
  $(box3).attr("src", picture);
  box3.className = 'picture-1';

  $("#message-display").append(boxMain);
  boxMain.append(box1);
  boxMain.append(box2);
  boxMain.append(box3);

  $(document).scrollTop($(document).height());
}

function other_msg_div(time, user, picture, text) {
  const boxMain = document.createElement('div');
  boxMain.className = 'msg-2';
  const box1 = document.createElement('div');
  var tmp1 = document.createElement('label');
  var tmp2 = document.createElement('label');
  tmp1.innerHTML = time;
  tmp2.innerHTML = user;
  box1.append(tmp1, tmp2);
  box1.className = 'username_time-1';


  const box2 = document.createElement('p');
  box2.innerHTML = text;
  box2.className = 'text-1';

  const box3 = document.createElement('img');
  $(box3).attr("src", picture);
  box3.className = 'picture-2';

  $("#message-display").append(boxMain);
  boxMain.append(box1);
  boxMain.append(box2);
  boxMain.append(box3);

  $(document).scrollTop($(document).height());
}

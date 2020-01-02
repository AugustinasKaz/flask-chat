
$(document).ready(function(){
    var socket=io.connect(location.protocol+'//'+document.domain+':'+location.port);
    //localStorage.removeItem('username');
    socket.on('connect', function(){
    $("#Display_picture").attr("src",localStorage.getItem("picture"));
    $("#header-name").append(localStorage.getItem("username"));
    $("#myMessage").on('keyup', function(key){
        if(key.keyCode==13){
          const username = localStorage.getItem("username");    
          const message =  $("#myMessage").val();  
          const time = (new Date).getHours() + ":" + (new Date).getMinutes();
          const picture = localStorage.getItem("picture");
          $("#myMessage").val(" ");
         socket.emit('to all', {'message1': message, 'username1': username, 'time1': time, 'picture1': picture});
        }
    })  
      
      if(!localStorage.getItem("username"))
      {
        $("#myModal").modal({backdrop: 'static', keyboard : false});
        $("#button_modal").prop('disabled', true);
        $("#user_input").val('');    
      }

  });

    socket.on('pranesti', function(data){
       messagesL(data);
    });

    socket.on('add username', function(data){
        //$("#Display_user").append(localStorage.getItem("username"));
        messagesL(data);
    })

    socket.on('add picture', function(data){
     messagesL(data);
    })

    $('#button_modal').on('click', function(){
        if (!localStorage.getItem('username')){  
          $("#Display_picture").attr("src",localStorage.getItem("picture"));
            var username = $('#user_input').val();
            const time = (new Date).getHours() + ":" + (new Date).getMinutes();
            const picture = "/static/picture1.png";
            localStorage.setItem("username", $('#user_input').val());
            socket.emit('new username', {'username': username, 'time': time, 'message': 'has joined the room', 'picture': picture});
        }
    });  

    $("#user_input").on("keyup", function(key){
        if($(this).val().length <= 3){
          $("#button_modal").prop('disabled', true); 
        }
        else{
          $("#button_modal").prop('disabled', false);
          if(key.keyCode==13){
            $("#button_modal").click();
          } 
        }
    });

    $("#Display_picture").on('click', function(){
      $("#PicsModal").modal({backdrop: 'static', keyboard : false}); 
      $('.user_picture').on('click', function() {
      var picture = document.getElementById($(this).attr('id'));
      var imgCanvas = document.createElement("canvas"),
      imgContext = imgCanvas.getContext("2d");
      imgCanvas.width = picture.width;
      imgCanvas.height = picture.height;
      imgContext.drawImage(picture, 0, 0, picture.width, picture.height);
      var imgAsDataURL = imgCanvas.toDataURL("image/png");
      localStorage.setItem("picture", imgAsDataURL);

      var picture1 = localStorage.getItem("picture");
      var username1 = localStorage.getItem("username");
      const time1 = (new Date).getHours() + ":" + (new Date).getMinutes();
      $("#Display_picture").attr("src",localStorage.getItem("picture"));
      socket.emit('new picture', {"picture": picture1, "username": username1, "time": time1, "message":'picture changed'});
})
    
  
});
});

function messagesL(data){
    $("#messages").html('');
        for(i in data['channels']){
        const boxMain = document.createElement('div');
        if(data['channels'][i]['vartotojas']==localStorage.getItem('username')){
        boxMain.className = 'container2';
        }
        else{
            boxMain.className = 'container2 darker';
        }
        const box1 = document.createElement('p');
        box1.innerHTML = data['channels'][i]['vartotojas'];

        const box2 = document.createElement('span');
        box2.innerHTML = data['channels'][i]['time'];
        box2.className = 'time-right';

        const box3 = document.createElement('p');
        box3.innerHTML = data['channels'][i]['tekstas'];
        box3.className = 'text-left';

        const box4 = document.createElement('img');
        var text = data['channels'][i]['picture'];
        $(box4).attr("src",text);
        box4.className = 'profile_pic';
    
        $("#messages").append(boxMain);
        boxMain.append(box1);
        boxMain.append(box4);
        boxMain.append(box2);
        boxMain.append(box3);
        
        
        $(document).scrollTop($(document).height());
}
}


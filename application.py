import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit,join_room,leave_room, send

app = Flask(__name__)
app.debug = 'DEBUG' in os.environ
socketio = SocketIO(app)


channel = []      

@app.route("/")
def index():
    return render_template("home.html")


@socketio.on('to all')
def sending(data):
    message = {'tekstas':data["message1"], 'vartotojas': data['username1'], 'time': data['time1'], 'picture' : data["picture1"]}
    channel.append(message)
    if(len(channel) > 99):
         channel.pop(0)
    emit('pranesti', {'channels': channel}, broadcast=True)

@socketio.on('new username')
def new_user(data):
     username=data["username"]
     message = {'tekstas':data["message"], 'vartotojas': data['username'], 'time': data['time'], 'picture': data['picture']}
     channel.append(message)
     emit("add username",{'channels': channel, 'username': username}, broadcast=True)    

@socketio.on('new picture')
def new_picture(data):
     message = {'tekstas':data["message"], 'vartotojas': data['username'], 'time': data['time'], 'picture': data['picture']}
     channel.append(message)
     emit("add picture", {"channels": channel}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)    
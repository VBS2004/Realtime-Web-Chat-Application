from flask import Flask, request,send_from_directory
from flask_socketio import SocketIO, emit, send
import socket
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'vnkdjnfjknfl1232#'
socketio = SocketIO(app, cors_allowed_origins="*")

chat_hist = []
current_active = []

@app.route('/')
def serve_react_app():
    return send_from_directory('D:/Web Chat/chat-room/public', 'index.html')

# Route to serve static assets (CSS, JS, images) from the build directory
@app.route('/<path:path>')
def serve_react_assets(path):
    return send_from_directory('D:/Web Chat/chat-room/build', path)
@socketio.on('connect')
def test_connect(auth):
    emit('my response', {'data': 'Connected'})
    
@socketio.on('Update active')
def update(dummy):
    emit('changeActive',current_active,broadcast=True)
    
@socketio.on('Chat')
def handle_message(json):
    message = json['Message']
    cuser = ''
    for i in current_active:
        if i['sessID'] == request.sid:
            cuser = i['Username']
    sent = False
    print(current_active)
    for i in current_active:
        if i['Username'] == json['To']:
            emit('message', f"{cuser}: {json['Message']}", room=i['sessID'])
            send(f"To {json['To']}: {json['Message']}")
            sent = True
            break
    if not sent:
        emit('message', 'User not found', room=request.sid)

@socketio.on('Login')
def handle_login(auth):
    print("Auth:", auth)
    if any(user['Username'] == auth for user in current_active):
        # Emit a message back to the user that the username is already in use
        emit('loginFailed', f"Username '{auth}' is already in use!", room=request.sid)
        return

    # If not active, allow login
    current_active.append({'Username': auth, 'sessID': request.sid})
    text = f"Hi! {auth}"
    send(text, broadcast=False)
    emit('changeActive', current_active, broadcast=True)
    
@socketio.on('disconnect')
def handle_disconnect():
    for i in current_active:
        if i['sessID'] == request.sid:
            print("Disconnect:", i['Username'])
            current_active.remove(i)
            print(current_active)
            break
    emit('changeActive',current_active,broadcast=True)
    send("Disconnected", broadcast=False)

def get_local_ip():
    try:
        # Create a socket object
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Doesn't actually connect to 8.8.8.8, but helps get the local IP
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    hostname = socket.gethostname()
    #ip_address = socket.gethostbyname(hostname)
    ip_address = get_local_ip()
    socketio.run(app, host=ip_address, debug=True)

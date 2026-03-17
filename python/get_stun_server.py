import json

def get_stun_server():
    return {
        "stun": "stun:stun.l.google.com:19302"
    }

if __name__ == "__main__":
    print(json.dumps(get_stun_server()))

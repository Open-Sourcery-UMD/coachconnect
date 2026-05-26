from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models.message import Message
from app.models.user import User

router = APIRouter()


class ConnectionManager:
    def __init__(self):
        self.active: dict[str, WebSocket] = {}

    async def connect(self, user_id: str, ws: WebSocket):
        await ws.accept()
        self.active[user_id] = ws

    def disconnect(self, user_id: str):
        self.active.pop(user_id, None)

    async def deliver(self, user_id: str, data: dict):
        ws = self.active.get(user_id)
        if ws:
            try:
                await ws.send_json(data)
            except Exception:
                self.disconnect(user_id)


manager = ConnectionManager()


def _serialize(m: Message) -> dict:
    return {
        'id': str(m.id),
        'sender_id': m.sender_id,
        'receiver_id': m.receiver_id,
        'text': m.text,
        'timestamp': int(m.timestamp.timestamp() * 1000),
        'read': m.read,
    }


@router.websocket('/ws/{user_id}')
async def websocket_endpoint(ws: WebSocket, user_id: str):
    await manager.connect(user_id, ws)
    try:
        while True:
            data = await ws.receive_json()
            msg = Message(
                sender_id=data['sender_id'],
                receiver_id=data['receiver_id'],
                text=data['text'],
            )
            await msg.insert()
            payload = _serialize(msg)
            await manager.deliver(data['sender_id'], payload)
            await manager.deliver(data['receiver_id'], payload)
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception:
        manager.disconnect(user_id)


@router.get('/conversation/{user1}/{user2}')
async def get_conversation(user1: str, user2: str):
    sent = await Message.find(
        Message.sender_id == user1, Message.receiver_id == user2
    ).to_list()
    recv = await Message.find(
        Message.sender_id == user2, Message.receiver_id == user1
    ).to_list()
    all_msgs = sorted(sent + recv, key=lambda m: m.timestamp)
    return [_serialize(m) for m in all_msgs]


@router.get('/conversations/{user_id}')
async def get_conversations(user_id: str):
    sent = await Message.find(Message.sender_id == user_id).to_list()
    recv = await Message.find(Message.receiver_id == user_id).to_list()
    all_msgs = sorted(sent + recv, key=lambda m: -m.timestamp.timestamp())

    seen: dict[str, dict] = {}
    for m in all_msgs:
        partner = m.receiver_id if m.sender_id == user_id else m.sender_id
        if partner not in seen:
            seen[partner] = {
                'partner_id': partner,
                'partner_name': 'Unknown',
                'last_message': m.text,
                'last_timestamp': int(m.timestamp.timestamp() * 1000),
                'unread': 0,
            }

    for partner_id, conv in seen.items():
        partner_user = await User.find_one(User.firebase_uid == partner_id)
        if partner_user:
            conv['partner_name'] = partner_user.name
        unread_msgs = await Message.find(
            Message.sender_id == partner_id,
            Message.receiver_id == user_id,
            Message.read == False,
        ).to_list()
        conv['unread'] = len(unread_msgs)

    return sorted(seen.values(), key=lambda x: -x['last_timestamp'])


@router.patch('/read/{sender_id}/{receiver_id}')
async def mark_read(sender_id: str, receiver_id: str):
    unread = await Message.find(
        Message.sender_id == sender_id,
        Message.receiver_id == receiver_id,
        Message.read == False,
    ).to_list()
    for m in unread:
        m.read = True
        await m.save()
    return {'marked': len(unread)}

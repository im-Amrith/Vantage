from __future__ import annotations

import json

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.core.state import orchestrator

router = APIRouter()


@router.websocket("/ws/interview/{session_id}")
async def interview_ws(websocket: WebSocket, session_id: str):
    await websocket.accept()

    try:
        session = orchestrator.get_session(session_id)
        await websocket.send_json(
            {
                "type": "question",
                "payload": session.current_question.model_dump(),
            }
        )

        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "payload": {"message": "Invalid JSON"}})
                continue

            msg_type = msg.get("type")
            payload = msg.get("payload") or {}

            if msg_type == "answer":
                answer_text = str(payload.get("text") or "").strip()
                if not answer_text:
                    await websocket.send_json({"type": "error", "payload": {"message": "Empty answer"}})
                    continue

                result = await orchestrator.submit_answer(session_id=session_id, answer_text=answer_text)
                await websocket.send_json({"type": "feedback", "payload": result.feedback.model_dump()})

                if result.next_question is None:
                    await websocket.send_json({"type": "done", "payload": result.report.model_dump()})
                else:
                    await websocket.send_json({"type": "question", "payload": result.next_question.model_dump()})

            elif msg_type == "telemetry":
                await orchestrator.submit_telemetry(session_id=session_id, telemetry=payload)
                await websocket.send_json({"type": "telemetry_ack", "payload": {"ok": True}})

            else:
                await websocket.send_json({"type": "error", "payload": {"message": "Unknown message type"}})

    except WebSocketDisconnect:
        return

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as http_router
from app.api.websockets import router as ws_router

def create_app() -> FastAPI:
    app = FastAPI(title="InterviewFlow AI Backend")

    # CORS is CRITICAL now because Frontend (Localhost) and Backend (Hugging Face) are on different domains.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allows your local React app to talk to this backend
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(http_router, prefix="/api")
    app.include_router(ws_router)

    @app.get("/health")
    async def health():
        return {"status": "ok"}
    
    # ROOT ROUTE: Just a simple message so you know it's working
    @app.get("/")
    async def root():
        return {"message": "Backend is running! Connect your frontend to this URL."}

    return app

app = create_app()
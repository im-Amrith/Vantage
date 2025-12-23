from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.api.endpoints import router as http_router
from app.api.websockets import router as ws_router

def create_app() -> FastAPI:
    app = FastAPI(title="InterviewFlow AI Backend")

    # 1. CORS Middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 2. Include API Routers
    app.include_router(http_router, prefix="/api")
    app.include_router(ws_router)

    # 3. Health Check
    @app.get("/health")
    async def health():
        return {"status": "ok"}

    # ============================================================
    # 4. SERVE REACT FRONTEND (Added for Hugging Face Deployment)
    # ============================================================
    
    # Mount the 'assets' folder (CSS, JS, Images from React build)
    # The Dockerfile copies the React build 'dist' folder to 'static'
    if os.path.exists("static/assets"):
        app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

    # Catch-all route to serve the React App (SPA Support)
    # This must be the LAST route defined.
    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # 1. Check if the user is asking for a specific file (e.g., logo.png, robots.txt)
        file_path = f"static/{full_path}"
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # 2. If the file doesn't exist (or it's a route like /dashboard), return index.html
        # This lets React Router handle the page navigation client-side.
        if os.path.exists("static/index.html"):
             return FileResponse("static/index.html")
        
        # Fallback if static folder is missing (e.g. local dev without build)
        return {"error": "Frontend not found. Did you build the React app?"}

    return app

app = create_app()
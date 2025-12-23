# ==================================
# STAGE 1: Build the React Frontend
# ==================================
FROM node:18 as frontend-builder

WORKDIR /app-frontend

# 1. Copy frontend dependency files from the 'frontend' folder
COPY frontend/package*.json ./

# 2. Install Node dependencies
RUN npm install

# 3. Copy the rest of the frontend source code
COPY frontend/ ./

# 4. Build the React app (This creates the 'dist' folder)
RUN npm run build

# ==================================
# STAGE 2: Build the FastAPI Backend
# ==================================
FROM python:3.10

WORKDIR /code

# 1. Copy requirements from the 'backend' folder
COPY backend/requirements.txt /code/requirements.txt
# (Uncomment these if you use them)
# COPY backend/requirements-ai.txt /code/requirements-ai.txt
# COPY backend/requirements-audio.txt /code/requirements-audio.txt
# COPY backend/requirements-cv.txt /code/requirements-cv.txt

# 2. Install Python dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
# RUN pip install --no-cache-dir --upgrade -r /code/requirements-ai.txt
# RUN pip install --no-cache-dir --upgrade -r /code/requirements-audio.txt
# RUN pip install --no-cache-dir --upgrade -r /code/requirements-cv.txt

# 3. Create a user (Hugging Face security requirement)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

# 4. Copy the Backend Code
COPY --chown=user backend/app $HOME/app/app

# === THE CRITICAL STEP ===
# Copy the BUILT frontend files from Stage 1 into a 'static' folder in the backend
COPY --from=frontend-builder --chown=user /app-frontend/dist $HOME/app/static

# 5. Start the app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
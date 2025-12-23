FROM python:3.10

# Set up a new user named "user" with user ID 1000
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy requirements first to leverage cache
COPY --chown=user ./requirements.txt requirements.txt
COPY --chown=user ./requirements-ai.txt requirements-ai.txt
COPY --chown=user ./requirements-audio.txt requirements-audio.txt
COPY --chown=user ./requirements-cv.txt requirements-cv.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r requirements.txt
RUN pip install --no-cache-dir --upgrade -r requirements-ai.txt
RUN pip install --no-cache-dir --upgrade -r requirements-audio.txt
RUN pip install --no-cache-dir --upgrade -r requirements-cv.txt

# Copy the rest of the application
COPY --chown=user . /app

# Start the application
CMD ["uvicorn", "asgi:app", "--host", "0.0.0.0", "--port", "7860"]

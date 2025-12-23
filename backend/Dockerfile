FROM python:3.10

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
COPY ./requirements-ai.txt /code/requirements-ai.txt
COPY ./requirements-audio.txt /code/requirements-audio.txt
COPY ./requirements-cv.txt /code/requirements-cv.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements-ai.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements-audio.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements-cv.txt

# Copy the application code
COPY ./app /code/app
# Copy data directory if needed
COPY ./data /code/data

# Create a user to run the application (Hugging Face Spaces requirement for security)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app

COPY --chown=user . $HOME/app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]

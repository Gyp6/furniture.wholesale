# Lab 5 — pinned, isolated runner for static metrics (Lizard).
# Same image => same numbers on every laptop / CI agent (see lab5 Reliability Report).
FROM python:3.13.1-slim-bookworm
ENV PYTHONDONTWRITEBYTECODE=1 PIP_DISABLE_PIP_VERSION_CHECK=1 LC_ALL=C.UTF-8
WORKDIR /opt/metrics
COPY requirements.txt .
# --require-hashes: a re-published or tampered package cannot change the analyzer
RUN pip install --no-cache-dir --require-hashes -r requirements.txt
WORKDIR /src
ENTRYPOINT ["lizard"]
CMD ["--version"]

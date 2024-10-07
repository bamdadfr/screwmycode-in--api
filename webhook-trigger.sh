#!/bin/bash

# Set variables
WEBHOOK_URL="$1"
WEBHOOK_SECRET="$2"
PAYLOAD='{}'
TIMESTAMP=$(date +%s)

# Generate HMAC signature
SIGNATURE=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | xxd -p -c 32)

# Send the request
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=$SIGNATURE" \
  -H "X-Hub-Timestamp: $TIMESTAMP" \
  -d "$PAYLOAD"

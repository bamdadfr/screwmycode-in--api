import hashlib
import hmac
import subprocess
import time

from django.core.handlers.wsgi import WSGIRequest
from ninja import Router
from ninja.throttling import AnonRateThrottle

from screwmycodein.screwmycodein.config import Config

router = Router()
config = Config()


@router.post(
    "/deploy",
    response={200: str, 400: str, 401: str, 403: str, 500: str},
    throttle=AnonRateThrottle("1/m"),
)
def webhook_post(request: WSGIRequest):
    # Verify HMAC signature
    signature = request.headers.get("X-Hub-Signature-256")
    if not signature:
        return 401, "Unauthorized: Missing signature"

    computed_signature = hmac.new(
        config.webhook_secret.encode(),
        request.body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(f"sha256={computed_signature}", signature):
        return 403, "Forbidden: Invalid signature"

    # Verify prevent replay attacks (5 minutes tolerance)
    timestamp = request.headers.get("X-Hub-Timestamp")
    if not timestamp or abs(int(timestamp) - int(time.time())) > 300:
        return 403, "Forbidden: Invalid timestamp"

    try:
        subprocess.run(
            [
                f"{config.app_path}/webhook-deploy.sh",
                config.venv_path,
                config.app_path,
            ],
            check=True,
            # capture_output=True,
            # text=True,
        )

        return 200, "Webhook received and redeployment triggered"
    except subprocess.CalledProcessError as e:
        print(f"Redeployment failed: {e.stdout}, {e.stderr}")
        return 500, "Redeployment failed"

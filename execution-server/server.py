from flask import Flask, request
import subprocess
import tempfile

app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run():
    data = request.json
    code = data.get("code", "")

    # Create temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as f:
        f.write(code.encode())
        filename = f.name

    try:
        result = subprocess.run(
            ["python3", filename],
            capture_output=True,
            text=True,
            timeout=3
        )

        return result.stdout or result.stderr

    except Exception as e:
        return str(e)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001)
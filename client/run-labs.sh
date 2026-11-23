#!/usr/bin/env bash

PORTAL="$HOME/college-portal-temp"
CIRCUIT="$HOME/circuitweb-clone/client"
LOGS="$HOME/edulabx-logs"

mkdir -p "$LOGS"

port_used() {
    ss -ltn "sport = :$1" | grep -q LISTEN
}

start_app() {
    NAME="$1"
    DIR="$2"
    PORT="$3"
    COMMAND="$4"
    URL="http://127.0.0.1:$PORT"

    echo
    echo "Checking $NAME on port $PORT..."

    if curl -fsS "$URL" -o /dev/null --max-time 2; then
        echo "$NAME is already running. Reusing it."
        return
    fi

    if port_used "$PORT"; then
        echo "WARNING: Port $PORT is occupied, but $NAME did not respond."
        echo "Not killing or replacing the existing process."
        return
    fi

    echo "Starting $NAME..."

    nohup bash -c \
        'cd "$1" && exec bash -lc "$2"' \
        _ "$DIR" "$COMMAND" \
        > "$LOGS/$NAME.log" 2>&1 &

    echo $! > "$LOGS/$NAME.pid"

    for i in {1..30}; do
        if curl -fsS "$URL" -o /dev/null --max-time 2; then
            echo "$NAME started successfully."
            return
        fi
        sleep 1
    done

    echo "$NAME did not become ready. Check $LOGS/$NAME.log"
}

echo "================================"
echo "       EDULABX + CIRCUITWEB"
echo "================================"

start_app "SimuLab" "$PORTAL" 3000 \
    "pnpm dev -- --hostname 0.0.0.0 --port 3000"

start_app "CircuitWeb" "$CIRCUIT" 5173 \
    "pnpm dev -- --host 0.0.0.0 --port 5173 --strictPort"

echo
echo "================================"
echo "EduLabX:   http://localhost:3000"
echo "CircuitWeb: http://localhost:5173"
echo "Logs: $LOGS"
echo "================================"

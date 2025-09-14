# Quick fix federation_core (most common)
./dev-mode.sh quick-fix

# Restart any specific service
./dev-mode.sh restart-service federation_core

# Watch live logs
./dev-mode.sh logs federation_core

# Check status
./dev-mode.sh status

# Stop dev mode
./dev-mode.sh stop
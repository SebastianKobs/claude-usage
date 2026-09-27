# claude-usage: common commands. `make` alone lists them.
#
#   make start [PORT=8765] [LIVE_MINUTES=5]   dashboard in the background (pid and log in data/)
#   make report ARGS="--days 7 --by project"  any report options
#   make session ID=<session-id>              one session's drilldown

PYTHON ?= python3
CLI := $(PYTHON) -m claude_usage
PID_FILE := data/serve.pid
LOG_FILE := data/serve.log
PORT ?=
LIVE_MINUTES ?=
ARGS ?=
ID ?=
SERVE_OPTIONS := $(if $(PORT),--port $(PORT)) $(if $(LIVE_MINUTES),--live-minutes $(LIVE_MINUTES))

.DEFAULT_GOAL := help
.PHONY: help start stop restart status logs scan report session test test-app test-guard clean cron-line

help: ## list the targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  %-12s %s\n", $$1, $$2}'

start: ## start the dashboard in the background (PORT=, LIVE_MINUTES=)
	@mkdir -p data
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "already running (pid $$(cat $(PID_FILE))); make stop first"; exit 1; \
	fi
	@nohup setsid $(CLI) serve $(SERVE_OPTIONS) > $(LOG_FILE) 2>&1 < /dev/null & echo $$! > $(PID_FILE)
	@for i in 1 2 3 4 5 6 7 8 9 10; do \
		if grep -q "^Serving" $(LOG_FILE) 2>/dev/null; then break; fi; \
		if ! kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then break; fi; \
		sleep 0.5; \
	done
	@if kill -0 $$(cat $(PID_FILE)) 2>/dev/null && grep -q "^Serving" $(LOG_FILE); then \
		echo "$$(grep '^Serving' $(LOG_FILE) | sed 's/  (Ctrl+C to stop)//')  (pid $$(cat $(PID_FILE)), log $(LOG_FILE))"; \
	else \
		echo "failed to start:"; cat $(LOG_FILE); rm -f $(PID_FILE); exit 1; \
	fi

stop: ## stop the background dashboard
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		kill $$(cat $(PID_FILE)); \
		for i in 1 2 3 4 5 6 7 8 9 10; do kill -0 $$(cat $(PID_FILE)) 2>/dev/null || break; sleep 0.3; done; \
		echo "stopped (pid $$(cat $(PID_FILE)))"; \
	else \
		echo "not running"; \
	fi
	@rm -f $(PID_FILE)

restart: stop start ## stop, then start again

status: ## whether the background dashboard runs, and where
	@if [ -f $(PID_FILE) ] && kill -0 $$(cat $(PID_FILE)) 2>/dev/null; then \
		echo "running (pid $$(cat $(PID_FILE))): $$(grep '^Serving' $(LOG_FILE) | sed 's/Serving //; s/  (Ctrl+C to stop)//')"; \
	else \
		echo "not running"; \
	fi

logs: ## show the background dashboard's log
	@cat $(LOG_FILE) 2>/dev/null || echo "no log yet"

scan: ## read new transcript data into the store
	@$(CLI) scan

report: ## usage report (ARGS="--days 7 --by project --json" ...)
	@$(CLI) report $(ARGS)

session: ## one session's drilldown (ID=<session-id>)
	@if [ -z "$(ID)" ]; then echo "usage: make session ID=<session-id>"; exit 2; fi
	@$(CLI) report --session $(ID) $(ARGS)

test: test-app test-guard ## run all tests

test-app: ## the app's tests
	@$(PYTHON) -m unittest discover -s tests

test-guard: ## the guard hook's tests
	@$(PYTHON) -m unittest discover -s .claude/tests

clean: ## remove caches and test scratch folders (never data/)
	@find . -name __pycache__ -type d -prune -exec rm -rf {} +
	@rm -rf tests/.tmp .claude/tests/.tmp *.egg-info build dist

cron-line: ## print a crontab line that keeps the history without the dashboard
	@echo "*/30 * * * * cd $(CURDIR) && $(PYTHON) -m claude_usage scan >/dev/null 2>&1"

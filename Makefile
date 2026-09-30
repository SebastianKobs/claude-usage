# claude-usage: common commands. `make` alone lists them.
#
#   make start [PORT=8765] [LIVE_MINUTES=5]   dashboard in the background (pid and log in data/)
#   make report ARGS="--days 7 --by project"  any report options
#   make session ID=<session-id>              one session's drilldown
#   make backup FILE=<new file>               a copy of the history, e.g. outside the checkout
#   make demo [DEMO_PORT=8799]                made-up transcripts and a dashboard on them, for screenshots
#   make build                                the page's bundle from web/ (needs node; the build is committed)

PYTHON ?= python3
CLI := $(PYTHON) -m claude_usage
PID_FILE := data/serve.pid
LOG_FILE := data/serve.log
PORT ?=
LIVE_MINUTES ?=
ARGS ?=
ID ?=
FILE ?=
DEMO_PORT ?=
SERVE_OPTIONS := $(if $(PORT),--port $(PORT)) $(if $(LIVE_MINUTES),--live-minutes $(LIVE_MINUTES))
# the pid file names a running dashboard, not a process that reused the number after a crash
ALIVE = [ -f $(PID_FILE) ] && ps -p "$$(cat $(PID_FILE))" -o args= 2>/dev/null | grep -q "claude_usage serve"

.DEFAULT_GOAL := help
.PHONY: help start stop restart status logs scan report session backup test clean hook-line notify-test cron-line \
	demo build

help: ## list the targets
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "} {printf "  %-12s %s\n", $$1, $$2}'

start: ## start the dashboard in the background (PORT=, LIVE_MINUTES=)
	@mkdir -p -m 700 data
	@if $(ALIVE); then echo "already running (pid $$(cat $(PID_FILE))); make stop first"; exit 1; fi
	@if [ -f $(LOG_FILE) ]; then mv -f $(LOG_FILE) $(LOG_FILE).1; fi
	@# the log shows the link with the token, so it is yours alone
	@umask 077; nohup setsid $(CLI) serve $(SERVE_OPTIONS) > $(LOG_FILE) 2>&1 < /dev/null & echo $$! > $(PID_FILE)
	@for i in 1 2 3 4 5 6 7 8 9 10; do \
		if grep -q "^Serving" $(LOG_FILE) 2>/dev/null || ! $(ALIVE); then break; fi; \
		sleep 0.5; \
	done
	@if $(ALIVE) && grep -q "^Serving" $(LOG_FILE); then \
		echo "$$(grep '^Serving' $(LOG_FILE) | sed 's/  (Ctrl+C to stop)//')  (pid $$(cat $(PID_FILE)), log $(LOG_FILE))"; \
		sed -n '/^Serving/q; /^warning: /p' $(LOG_FILE); \
	else \
		if $(ALIVE); then kill $$(cat $(PID_FILE)); fi; \
		echo "failed to start:"; cat $(LOG_FILE); rm -f $(PID_FILE); exit 1; \
	fi

stop: ## stop the background dashboard
	@if $(ALIVE); then \
		kill $$(cat $(PID_FILE)); \
		for i in 1 2 3 4 5 6 7 8 9 10; do $(ALIVE) || break; sleep 0.3; done; \
		if $(ALIVE); then echo "still running (pid $$(cat $(PID_FILE))); kill -9 it by hand"; exit 1; fi; \
		echo "stopped (pid $$(cat $(PID_FILE)))"; \
	else \
		echo "not running"; \
	fi
	@rm -f $(PID_FILE)

restart: stop start ## stop, then start again

status: ## whether the background dashboard runs, and where
	@if $(ALIVE); then \
		echo "running (pid $$(cat $(PID_FILE))): $$(grep '^Serving' $(LOG_FILE) | sed 's/Serving //; s/  (Ctrl+C.*//')"; \
	else \
		echo "not running"; \
	fi

logs: ## show the background dashboard's log (the previous run's is data/serve.log.1)
	@cat $(LOG_FILE) 2>/dev/null || echo "no log yet"

scan: ## read new transcript data into the store
	@$(CLI) scan

report: ## usage report (ARGS="--days 7 --by project --json" ...)
	@$(CLI) report $(ARGS)

session: ## one session's drilldown (ID=<session-id>)
	@if [ -z "$(ID)" ]; then echo "usage: make session ID=<session-id>"; exit 2; fi
	@$(CLI) report --session $(ID) $(ARGS)

backup: ## copy the history into a new file (FILE=<path>), e.g. outside the checkout
	@if [ -z "$(FILE)" ]; then echo "usage: make backup FILE=<new file>"; exit 2; fi
	@$(CLI) backup "$(FILE)"

test: ## run the tests
	@$(PYTHON) -m unittest discover -s tests

clean: ## remove caches and test scratch folders (never data/)
	@find . -name __pycache__ -type d -prune -exec rm -rf {} +
	@rm -rf tests/.tmp *.egg-info build dist

hook-line: ## print the hook settings that show permission prompts on the dashboard
	@$(CLI) hook-settings

notify-test: ## show one desktop notification the way the dashboard shows them, and say how
	@$(CLI) notify-test

cron-line: ## print a crontab line that keeps the history without the dashboard (errors go to cron's mail)
	@echo "*/30 * * * * cd '$(CURDIR)' && $$(command -v $(PYTHON)) -m claude_usage scan >/dev/null"

build: ## build the page's bundle from web/ into claude_usage/static (needs node and npm)
	@cd web && npm ci --ignore-scripts && npm run build

demo: ## made-up transcripts in tests/.tmp/demo and a dashboard on them, for the docs' screenshots (DEMO_PORT=)
	@PYTHONPATH=tests $(PYTHON) -m demo $(if $(DEMO_PORT),--port $(DEMO_PORT))

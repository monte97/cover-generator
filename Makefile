# Cover Generator — Makefile
# Must be run from the Hugo site root (website.github.io/), not from this directory.
# Example: make -f scripts/cover-generator/Makefile gen POST=content/posts/kafka/01-intro

GENERATOR_DIR := scripts/cover-generator
INDEX := $(GENERATOR_DIR)/index.js
BATCH := $(GENERATOR_DIR)/generate-all.js
EXPORT := $(GENERATOR_DIR)/export-templates.js

# Override with: make gen POST=... TEMPLATE=dark FORMAT=linkedin
TEMPLATE ?=
FORMAT ?=
POST ?=
SERIES ?=

_TPL := $(if $(TEMPLATE),--template $(TEMPLATE),)
_FMT := $(if $(FORMAT),--format $(FORMAT),)

.PHONY: help install gen all export list-templates list-series clean

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies + Playwright browser
	npm install && npx playwright install chromium

gen: ## Generate cover (POST=path [TEMPLATE=name] [FORMAT=type])
ifndef POST
	@echo "Usage: make -f $(GENERATOR_DIR)/Makefile gen POST=content/posts/kafka/01-intro [TEMPLATE=dark] [FORMAT=linkedin]"
	@exit 1
endif
	node $(INDEX) $(POST) $(_TPL) $(_FMT)

all: ## Batch generate for a series (SERIES=name [TEMPLATE=name] [FORMAT=type])
ifndef SERIES
	@echo "Usage: make -f $(GENERATOR_DIR)/Makefile all SERIES=kafka [TEMPLATE=dark] [FORMAT=linkedin]"
	@exit 1
endif
	node $(BATCH) $(SERIES) $(_TPL) $(_FMT)

export: ## Export static HTML previews of all templates
	node $(EXPORT)

list-templates: ## List available templates
	@node $(INDEX)

list-series: ## List available series
	@node $(BATCH)

clean: ## Remove generated output
	rm -rf $(GENERATOR_DIR)/output/*
	rm -rf $(GENERATOR_DIR)/templates/html/*

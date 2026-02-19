# Cover Generator — Makefile
# Works from any directory. Examples:
#   cd scripts/cover-generator && make gen POST=../../content/posts/kafka/01-intro
#   make -f scripts/cover-generator/Makefile gen POST=content/posts/kafka/01-intro

GENERATOR_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
INDEX := $(GENERATOR_DIR)index.js
BATCH := $(GENERATOR_DIR)generate-all.js
EXPORT := $(GENERATOR_DIR)export-templates.js
SCAFFOLD := $(GENERATOR_DIR)templates/_scaffold.hbs
TEMPLATES_DIR := $(GENERATOR_DIR)templates

# Override with: make gen POST=... TEMPLATE=dark FORMAT=linkedin
TEMPLATE ?=
FORMAT ?=
POST ?=
SERIES ?=
NAME ?=

_TPL := $(if $(TEMPLATE),--template $(TEMPLATE),)
_FMT := $(if $(FORMAT),--format $(FORMAT),)

.PHONY: help install gen all export list-templates list-series clean new-template

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-18s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies + Playwright browser
	cd $(GENERATOR_DIR) && npm install && npx playwright install chromium

gen: ## Generate cover (POST=path [TEMPLATE=name] [FORMAT=type])
ifndef POST
	@echo "Usage: make gen POST=content/posts/kafka/01-intro [TEMPLATE=dark] [FORMAT=linkedin]"
	@exit 1
endif
	node $(INDEX) $(POST) $(_TPL) $(_FMT)

all: ## Batch generate for a series (SERIES=name [TEMPLATE=name] [FORMAT=type])
ifndef SERIES
	@echo "Usage: make all SERIES=kafka [TEMPLATE=dark] [FORMAT=linkedin]"
	@exit 1
endif
	node $(BATCH) $(SERIES) $(_TPL) $(_FMT)

export: ## Export static HTML previews of all templates
	node $(EXPORT)

list-templates: ## List available templates
	@node $(INDEX)

list-series: ## List available series
	@node $(BATCH)

new-template: ## Create a new template from scaffold (NAME=my-theme)
ifndef NAME
	@echo "Usage: make new-template NAME=my-theme"
	@exit 1
endif
	@if [ -f "$(TEMPLATES_DIR)/$(NAME).hbs" ]; then \
		echo "❌ Template '$(NAME).hbs' already exists"; \
		exit 1; \
	fi
	@cp $(SCAFFOLD) $(TEMPLATES_DIR)/$(NAME).hbs
	@sed -i 's/{{!-- name: Scaffold Template --}}/{{!-- name: $(NAME) --}}/' $(TEMPLATES_DIR)/$(NAME).hbs
	@echo "✅ Created templates/$(NAME).hbs"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Edit templates/$(NAME).hbs — customize the CSS and layout"
	@echo "  2. Preview: make gen POST=content/posts/kafka/01-intro TEMPLATE=$(NAME)"
	@echo "  3. Export HTML: make export"

clean: ## Remove generated output
	rm -rf $(GENERATOR_DIR)output/*

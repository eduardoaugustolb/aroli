.PHONY: hands build preview check clean

hands:
	bun scripts/generate-hands.ts

build:
	./scripts/build-cursor

preview:
	bun scripts/generate-preview.ts

check: build
	bun scripts/generate-hands.ts --check
	bun scripts/verify-cursors.ts

clean:
	rm -f cursors/*

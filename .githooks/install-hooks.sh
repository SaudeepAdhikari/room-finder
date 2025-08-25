#!/bin/sh
set -e
echo "Setting up local git hooks (core.hooksPath = .githooks)"
git config core.hooksPath .githooks
echo "Done"

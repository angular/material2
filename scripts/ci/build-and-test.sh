#!/usr/bin/env bash
set -ex

echo "=======  Starting build-and-test.sh  ========================================"

# Go to project dir
SCRIPT_DIR=$(dirname $0)
cd ${SCRIPT_DIR}/../..


start_tunnel() {
  case "$MODE" in
    saucelabs*)
      ./scripts/sauce/sauce_connect_setup.sh
      ;;
    browserstack*)
      ./scripts/browserstack/start_tunnel.sh
      ;;
    *)
      ;;
  esac
}

wait_for_tunnel() {
  case "$MODE" in
    saucelabs*)
      ./scripts/sauce/sauce_connect_block.sh
      ;;
    browserstack*)
      ./scripts/browserstack/waitfor_tunnel.sh
      ;;
    *)
      ;;
  esac
  sleep 10
}

teardown_tunnel() {
  case "$MODE" in
    saucelabs*)
      ./scripts/sauce/sauce_connect_teardown.sh
      ;;
    browserstack*)
      # ./scripts/browserstack/teardown_tunnel.sh
      ;;
    *)
      ;;
  esac
}

# Run the tests for this run (either unit or e2e).
run_tests() {
  case "$MODE" in
    *unit*)
      npm run build
      karma start test/karma.conf.js --single-run --no-auto-watch --reporters='dots'
      ;;
    *e2e*)
     ./scripts/ci/test-e2e-js.sh
      ;;
    *)
      ;;
  esac
}

start_tunnel
wait_for_tunnel
run_tests
teardown_tunnel

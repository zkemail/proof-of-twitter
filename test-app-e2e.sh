#!/bin/bash

# Execute E2E test
cd packages/app && (yarn start-e2e-test-server & yarn test:e2e-ui)
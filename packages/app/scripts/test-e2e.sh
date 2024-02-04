#!/bin/bash

# Execute E2E test 
# This file is required in the CI
yarn start-e2e-test-server & (yarn test:e2e-zkp && yarn test:e2e-ui)
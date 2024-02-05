# Proof of Twitter

Prove ownership of a X (Twitter) account using an email from Twitter, and mint an NFT with your Twitter username.

This project is a demonstration of ZK Email. You can fork it to build other projects using ZK Email.

Try it here: https://twitter.prove.email/

## How it works

You can use an email from Twitter that contains `email was meant for @username` to generate a ZK proof that you own the Twitter account `@username`.

This ZK proof can be used to mint an NFT corresponding to your username in the `ProofOfTwitter` contract.

## Running locally

#### Install dependencies

```bash
yarn
```

#### Start the web app. In `packages/app` directory, run

```bash
yarn start
```

This will start the UI at `http://localhost:3000/` where you can paste the email, generate proof and mint the NFT.

The UI works against the generated zkeys downloaded from AWS and the deployed contract on Sepolia.

## Manual Proof Generation

If you want to generate the proof locally outside browser, follow the instructions below.

### Circuits

Circom circuits are located in `packages/circuits`, the main circuit being [twitter.circom](packages/circuits/twitter.circom). TwitterVerifier circuit use [EmailVerifier](https://github.com/zkemail/zk-email-verify/blob/main/packages/circuits/email-verifier.circom) circuit from `@zk-email/circuits`.

The regex circuit required to parse/extract Twitter username can be generated using [https://github.com/zkemail/zk-regex](zk-regex) package.

#### » Generate Twitter Regex Circuit

```bash
# CWD = packages/circuits
yarn generate-regex
```

This will generate `components/twitter_reset.circom` using the config in `components/twitter_reset.json`. This `twitter_reset.circom` is imported in `twitter.circom`.

Note that `twitter_reset.circom` is already in repo, so this step is optional.

#### » Build the circuit

```bash
# CWD = packages/circuits
yarn build
```

This will create `twitter.wasm` and other files in `packages/circuits/build` directory.

You can test the circuit using

```bash
# CWD = packages/circuits
yarn test
```

#### » Generating Zkey

You can generate proving and verification keys using

```bash
# CWD = packages/circuits/scripts
ZKEY_ENTROPY=<random-number> ZKEY_BEACON=<random-hex> ts-node dev-setup.ts
```

This will generate `zkey` files, `vkey.json` in `build` directory, and Solidity verifier in `packages/contracts/src/Verifier.sol`.

> Note: We are using a custom fork of `snarkjs` which generated **chunked zkeys**. Chunked zkeys make it easier to use in browser, especially since we have large circuit. You can switch to regular `snarkjs` in `package.json` if you don't want to use chunked zkeys.


For browser use, the script also compresses the chunked zkeys. 

**The compressed zkeys, vkey, wasm are copied to /build/artifacts` directory. This directory can be served using a local server or uploaded to S3 for use in the browser.

To upload to S3, the below script can be used.
```bash
python3 upload_to_s3.py --build-dir <project-path>/proof-of-twitter/packages/circuits/build --circuit-name twitter 
```

There are helper functions in `@zk-email/helpers` package to download and decompress the zkeys in the browser.


#### » Generate Input and Proof

```bash
# CWD = packages/circuits/scripts
ts-node generate-proof.ts --email-file ../tests/emls/test_twitter.eml --ethereum-address <your-eth-address>
```

This will generate input + witness using the given email file and Ethereum address, and prove using the generated zkey.

The script will save `inputs.json`, `input.wtns`, `proof.json`, and `public.json` in `proof` directory.

The script also verify the generated proof are correct. You can use the proof and public inputs to verify in the Solidity verifier as well.

### Contracts

The solidity contracts can be found in `packages/contracts`. The main contract is [ProofOfTwitter.sol](packages/contracts/src/ProofOfTwitter.sol).

#### You can build the contracts using

```bash
# CWD = packages/contracts
yarn build  # Assume you have foundry installed
```

#### Run tests

```bash
# CWD = packages/contracts
yarn test
```

Note that the tests will not pass if you have generated your own zkeys and `Verifier.sol` as you would have used a different Entropy.

To fix, update the `publicSignals` and `proof` in `test/TestTwitter.t.sol` with the values from `input.json` and `public.json` generated from the above steps. (Remember that you need to flip items in the nested array of `pi_b`).

#### Deploy contracts

```bash
# CWD = packages/contracts
PRIVATE_KEY=<pk-hex> forge script script/DeployTwitter.s.sol:Deploy -vvvv --rpc-url https://rpc2.sepolia.org --broadcast
```

Currently deployed contracts on Sepolia:

```
  Deployed Verifier at address: 0x6096601EB33d636b0e21593469920d06647FA955
  Deployed DKIMRegistry at address: 0x993873c1b46c756b60089cBbE3baEEC9Fa292e9f
  Deployed ProofOfTwitter at address: 0x86D390fDed54447fD244eD0718dbFCFCcbbA7edc
```

### UI

If you want to update the UI based on your own zkeys and contracts, please make the below changes:

- Set the `VITE_CONTRACT_ADDRESS` in `packages/app/.env`. This is the address of the `ProofOfTwitter` contract.
- Set `VITE_CIRCUIT_ARTIFACTS_URL` in `packages/app/.env` to the URL of the directory containing circuit artifacts (compressed partial zkeys, wasm, verifier, etc). You can run a local server in `circuits/build/artifacts` directory and use that URL or upload to S3 (or similar) and use that public URL/


## History

This repo was originally part of the [zk-email-verify](https://github.com/zkemail/zk-email-verify). Please refer there for the commit history and original contributors.

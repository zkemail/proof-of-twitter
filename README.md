# Proof of Twitter

Prove ownership of a X (Twitter) account using an email from Twitter, and mint a NFT with your Twitter username.

This project is a demonstration of ZK Email. You can fork it to build other stuffs using ZK Email.

Try it here: https://twitter.prove.email/

## How it works

You can use an email from Twitter that contain `email was meant for @username` to generate a ZK proof that you own the Twitter account `@username`. 

This ZK proof can be used to mint a NFT corresponding to your username in the `VerifiedTwitterEmail`` contract.

## How to build and run

You can use the live demo to test the project: https://twitter.prove.email/. You need to copy the full email to the UI and generate proof and mint token.

To build and run locally, follow the instructions.

#### Install dependencies

```bash
yarn
```

#### Generate Twitter Regex Circuit

Circom circuits are located in `packages/circuits`, the main circuit being [packages/circuits/twitter.circomtwitter.circom](packages/circuits/twitter.circom). TwitterVerifier circuit use EmailVerifier from `@zk-email/circuits`.

The regex circuit required to parse/extract Twitter username can be generated using [https://github.com/zkemail/zk-regex](zk-regex) package.

```bash
yarn generate-regex
```

This will generate `packages/circuits/components/twitter_reset.circom` using the config in `packages/circuits/components/twitter_reset.json`. This `twitter_reset.circom` is imported in `twitter.circom`.

Note that `twitter_reset.circom` is already in repo, so this step is optional.

#### Build the circuit

```bash
# CWD = packages/circuits
yarn build
```

This will create `twitter.wasm` and other files in `packages/circuits/build` directory.

#### Generating Zkey

You can generate proving and verifications keys using 
```bash
# CWD = packages/circuits/scripts
ZKEY_ENTROPY=<random-number> ZKEY_BEACON=<random-hex> ts-node dev-setup.ts 
```

This will generate `zkey` files, `vkey.json` in `packages/circuits/build` directory, and Solidity verifier in `packages/circuits/TwitterVerifier.sol`.

We are using a custom fork of `snarkjs` which generated **chunked zkeys**. Chunked zkeys make it easier to use in browser, especially for large circuits. You can use regular `snarkjs` in package.json if you don't want to use chunked zkeys.


#### Generate Input and Proof

```bash
# CWD = packages/circuits/scripts
ts-node generate-proof.ts --email-file ../../../emls/test_twitter.eml --ethereum-address <your-eth-address>
```

This will generate input + witness using a sample eml file [/emls/test_twitter.eml](/emls/test_twitter.eml), and prove using the generated zkey.

The script will save `inputs.json`, `input.wtns`, `proof.json`, and `public.json` in `packages/circuits/proof` directory.

The script also verify the generated proof are correct. You can use the proof and public inputs to verify in the Solidity verifier as well.


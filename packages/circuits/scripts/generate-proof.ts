import { program } from "commander";
import fs from "fs";
import path from "path";
import { generateTwitterVerifierCircuitInputs } from "../helpers";
import { verifyDKIMSignature } from "@zk-email/helpers/dist/dkim";
const snarkjs = require("snarkjs");

program
  .requiredOption("--email-file <string>", "Path to email file")
  .requiredOption(
    "--ethereum-address <string>",
    "Ethereum address to verify twitter handle against"
  )
  .option("--silent", "No console logs");

program.parse();
const args = program.opts();

const CIRCUIT_NAME = "twitter";
const BUILD_DIR = path.join(__dirname, "../build");
const OUTPUT_DIR = path.join(__dirname, "../proofs");

function log(...message: any) {
  if (!args.silent) {
    console.log(...message);
  }
}
const logger = { log, error: log, warn: log, debug: log };

async function generate() {
  if (!fs.existsSync(args.emailFile)) {
    throw new Error("--input file path arg must end with .json");
  }

  log("Generating input and proof for:", args.emailFile);

  const rawEmail = Buffer.from(fs.readFileSync(args.emailFile, "utf8"));
  const dkimResult = await verifyDKIMSignature(rawEmail);

  const circuitInputs = await generateTwitterVerifierCircuitInputs({
    rsaSignature: dkimResult.signature,
    rsaPublicKey: dkimResult.publicKey,
    body: dkimResult.body,
    bodyHash: dkimResult.bodyHash,
    message: dkimResult.message,
    ethereumAddress: args.ethereumAddress,
  });

  log("\n\nGenerated Inputs:", circuitInputs, "\n\n");

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "input.json"),
    JSON.stringify(circuitInputs, null, 2)
  );
  log("Inputs written to", path.join(OUTPUT_DIR, "input.json"));

  // Generate witness
  const wasm = fs.readFileSync(
    path.join(BUILD_DIR, `${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm`)
  );
  const wc = require(path.join(
    BUILD_DIR,
    `${CIRCUIT_NAME}_js/witness_calculator.js`
  ));
  const witnessCalculator = await wc(wasm);
  const buff = await witnessCalculator.calculateWTNSBin(circuitInputs, 0);
  fs.writeFileSync(path.join(OUTPUT_DIR, `input.wtns`), buff);

  // Generate proof
  const { proof, publicSignals } = await snarkjs.groth16.prove(
    path.join(BUILD_DIR, `${CIRCUIT_NAME}.zkey`),
    path.join(OUTPUT_DIR, `${CIRCUIT_NAME}.wtns`),
    logger
  );

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "proof.json"),
    JSON.stringify(proof, null, 2)
  );
  log("Proof written to", path.join(OUTPUT_DIR, "proof.json"));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "public.json"),
    JSON.stringify(publicSignals, null, 2)
  );
  log("Public Inputs written to", path.join(OUTPUT_DIR, "public.json"));

  const vkey = JSON.parse(fs.readFileSync(path.join(BUILD_DIR, `vkey.json`)).toString());
  const proofVerified = await snarkjs.groth16.verify(
    vkey,
    publicSignals,
    proof
  );
  if (proofVerified) {
    console.log("Proof Verified");
  } else {
    throw new Error("Proof Verification Failed");
  }

  process.exit(0);
}

generate().catch((err) => {
  console.error("Error generating inputs", err);
  process.exit(1);
});

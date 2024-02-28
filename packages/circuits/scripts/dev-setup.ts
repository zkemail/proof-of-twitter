/**
 *
 * This script is for generating zKey and Verification Key for the circuit.
 * Running this will download the phase1 file (if not already present),
 * generate the zKey, and also export solidity and json verification keys.
 *
 * Running this will overwrite any existing zKey and verification key files.
 *
 */

// @ts-ignore
import { zKey } from "snarkjs";
import https from "https";
import fs from "fs";
import path from "path";
import pako from "pako";

// ENV Variables
let { ZKEY_ENTROPY, ZKEY_BEACON, SILENT } = process.env;
if (ZKEY_ENTROPY == null) {
  log("No entropy provided, using `dev`");
  ZKEY_ENTROPY = "dev";
}
if (ZKEY_BEACON == null) {
  ZKEY_BEACON =
    "0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f";
  log("No ZKEY_BEACON provided, using default");
}

// Constants
const CIRCUIT_NAME = "twitter";
const BUILD_DIR = path.join(__dirname, "../build");
const PHASE1_URL =
  "https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_22.ptau";
const PHASE1_PATH = path.join(BUILD_DIR, "powersOfTau28_hez_final_22.ptau");
const ARTIFACTS_DIR = path.join(BUILD_DIR, 'artifacts');
const SOLIDITY_TEMPLATE = path.join(
  require.resolve("snarkjs"),
  "../../templates/verifier_groth16.sol.ejs"
);
const SOLIDITY_VERIFIER_PATH = path.join(
  __dirname,
  "../../contracts/src/Verifier.sol"
);

function log(...message: any) {
  if (!SILENT) {
    console.log(...message);
  }
}

async function downloadPhase1() {
  if (!fs.existsSync(PHASE1_PATH)) {
    log(`✘ Phase 1 not found at ${PHASE1_PATH}`);
    log(`䷢ Downloading Phase 1`);

    const phase1File = fs.createWriteStream(PHASE1_PATH);

    return new Promise((resolve, reject) => {
      https
        .get(PHASE1_URL, (response) => {
          response.pipe(phase1File);
          phase1File.on("finish", () => {
            phase1File.close();
            resolve(true);
          });
        })
        .on("error", (err) => {
          fs.unlink(PHASE1_PATH, () => {});
          reject(err);
        });
    });
  }
}

async function generateKeys(
  phase1Path: string,
  r1cPath: string,
  zKeyPath: string,
  vKeyPath: string,
  solidityVerifierPath: string
) {
  await zKey.newZKey(r1cPath, phase1Path, zKeyPath + ".step1", console);
  log("✓ Partial ZKey generated");

  await zKey.contribute(
    zKeyPath + ".step1",
    zKeyPath + ".step2",
    "Contributer 1",
    ZKEY_ENTROPY,
    console
  );
  log("✓ First contribution completed");

  await zKey.beacon(
    zKeyPath + ".step2",
    zKeyPath,
    "Final Beacon",
    ZKEY_BEACON,
    10,
    console
  );
  log("✓ Beacon applied");

  // Verification key
  const vKey = await zKey.exportVerificationKey(zKeyPath, console);
  fs.writeFileSync(vKeyPath, JSON.stringify(vKey, null, 2));
  log(`✓ Verification key exported - ${vKeyPath}`);

  // Solidity verifier
  const templates = {
    groth16: fs.readFileSync(SOLIDITY_TEMPLATE, "utf8"),
  };
  const code = await zKey.exportSolidityVerifier(zKeyPath, templates, console);
  fs.writeFileSync(solidityVerifierPath, code);
  log(`✓ Solidity verifier exported - ${solidityVerifierPath}`);

  // Cleanup
  ["", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"].forEach((suffix) => {
    if (fs.existsSync(zKeyPath + ".step1" + suffix))
      fs.unlinkSync(zKeyPath + ".step1" + suffix);
    if (fs.existsSync(zKeyPath + ".step2" + suffix))
      fs.unlinkSync(zKeyPath + ".step2" + suffix);
  });
}

async function exec() {
  await downloadPhase1();
  log("✓ Phase 1:", PHASE1_PATH);

  const circuitPath = path.join(BUILD_DIR, `${CIRCUIT_NAME}.r1cs`);
  if (!fs.existsSync(circuitPath)) {
    throw new Error(`${circuitPath} does not exist.`);
  }

  // Create artifacts directory and copy build files
  fs.mkdirSync(path.join(BUILD_DIR, 'artifacts'), { recursive: true });

  fs.copyFileSync(
    path.join(BUILD_DIR, `${CIRCUIT_NAME}.r1cs`),
    path.join(ARTIFACTS_DIR, `${CIRCUIT_NAME}.r1cs`)
  );
  fs.copyFileSync(
    path.join(BUILD_DIR, `${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm`),
    path.join(ARTIFACTS_DIR, `${CIRCUIT_NAME}.wasm`)
  );
  
  const zKeyPath = path.join(BUILD_DIR, `${CIRCUIT_NAME}.zkey`);

  await generateKeys(
    PHASE1_PATH,
    circuitPath,
    zKeyPath,
    path.join(ARTIFACTS_DIR, `${CIRCUIT_NAME}.vkey.json`),
    SOLIDITY_VERIFIER_PATH
  );
  log("✓ zkey, vkey and Solidity verifier generated");

  // Compress zkeys and copy to artifacts directory
  ["", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"].forEach((suffix) => {
    fs.writeFileSync(
      path.join(ARTIFACTS_DIR, `${CIRCUIT_NAME}.zkey`) + suffix + '.gz',
      pako.gzip(fs.readFileSync(zKeyPath + suffix))
    );
  });

  log(`✓ All artifacts saved to ${ARTIFACTS_DIR} directory`);
}

exec()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.log("Error: ", err);
    process.exit(1);
  });

// src/proofWorker.js

// import { generateProof } from "@zk-email/helpers/dist/zkp";

import { generateProof } from "@zk-email/helpers/dist/chunked-zkey";


self.onmessage = async (e) => {
  const { input, circuitArtifactsUrl, circuitName } = e.data;

  console.log('input', input)
  console.log('circuitArtifactsUrl', circuitArtifactsUrl)
  console.log('circuitName', circuitName)

  try {
    const { proof, publicSignals } = await generateProof(
      input,
      circuitArtifactsUrl,
      circuitName
    );

    self.postMessage({ proof, publicSignals });
  } catch (error) {
    self.postMessage({ error: error.message });
  }
};

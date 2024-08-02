// src/proofWorker.js

import { generateProof } from "@zk-email/helpers/dist/zkp";

self.onmessage = async (e) => {
  const { input, circuitArtifactsUrl, circuitName } = e.data;

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

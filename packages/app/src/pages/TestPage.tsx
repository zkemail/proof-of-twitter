'use client';
import React, { useState, useEffect } from "react";
import zkeSDK, { Blueprint, testBlueprint, parseEmail, ExternalInputInput,  Proof, ProofStatus } from "@zk-email/sdk";

const TestZKEmail: React.FC = () => {
  const [emlFile, setEmlFile] = useState<File | null>(null);
  const [proofData, setProofData] = useState<any>(null);
  const [publicData, setPublicData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [externalInputs, setExternalInputs] = useState<ExternalInputInput[]>([]);

  const blueprintSlug = "wryonik/twitter@v2"; // Replace with your actual blueprint slug

  // Fetch blueprint and initialize external inputs
  const initializeBlueprint = async () => {
    try {
      const sdk = zkeSDK();
      const fetchedBlueprint = await sdk.getBlueprint(blueprintSlug);
      setBlueprint(fetchedBlueprint);

      const inputs =
        (fetchedBlueprint.props.externalInputs?.map((input) => ({
          name: input.name,
          maxLength: input.maxLength,
          value: input.value || "",
        })) as ExternalInputInput[]) || [];
      setExternalInputs(inputs);
    } catch (error) {
      console.error("Error fetching blueprint:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEmlFile(e.target.files[0]);
    }
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...externalInputs];
    updatedInputs[index] = { ...updatedInputs[index], value };
    setExternalInputs(updatedInputs);
  };

  const validateEmail = async (content: string) => {
    try {
      const isValid = await testBlueprint(content, blueprint?.props!);
      if (!isValid) {
        throw new Error("Email does not match blueprint validation rules.");
      }
      return isValid;
    } catch (error) {
      console.error("Failed to validate email:", error);
      return false;
    }
  };

  const extractMetadata = (content: string) => {
    const subject = content.match(/Subject: (.*)/)?.[1] || "No Subject";
    const date = content.match(/Date: (.*)/)?.[1]
      ? new Date(content.match(/Date: (.*)/)[1]).toISOString()
      : "Invalid Date";
    return { subject, date };
  };

  const generateProof = async () => {
    if (!emlFile) {
      alert("Please upload an EML file.");
      return;
    }
    if (!blueprint) {
      alert("Blueprint not initialized.");
      return;
    }

    setLoading(true);
    try {
      const fileContent = await emlFile.text();

      const isValid = await validateEmail(fileContent);
      if (!isValid) {
        alert("Failed to validate email. Please upload a valid EML file.");
        return;
      }

      const { subject, date } = extractMetadata(fileContent);
      console.log("Extracted Metadata:", { subject, date });

      try {
        await parseEmail(fileContent);
      } catch (err) {
        console.error('Failed to parse email, email is invalid: ', err);
        throw err;
        // TODO: Notify user about this, cannot go to next step, email is invalid
      }

      const externalInputsObject = externalInputs.map((input) => ({
        name: input.name,
        value: input.value,
        maxLength: input.maxLength,
      }));

      console.log("Payload for Proof Generation:", { fileContent, externalInputsObject });

      const prover = blueprint.createProver();
      let proof: Proof;
      try {
        proof = await prover.generateProofRequest(fileContent, externalInputsObject || []);
      } catch (err) {
        console.error("Failed to generate a proof request", err);
        throw err;
      }
      console.log('logging PROOF: ', proof)


///poll the proof until status isn't 1//
      const sdk = zkeSDK();
            // Continue checking status until it changes from InProgress
            console.log('proof status: ', proof.props.status)
            while (proof.props.status === 1) {
              const completedProof = await sdk.getProof(proof.getId());
              const status = await completedProof.checkStatus();
              console.log('Current status:', status);
      
              // Wait for 5 seconds before checking again
              await new Promise((resolve) => setTimeout(resolve, 5000));
              proof = completedProof
            }
/////


      if (!proof || !proof.getProofData) {
        throw new Error("Proof generation failed: Invalid proof object returned.");
      }

      const { proofData: proofResult, publicData: publicResult } = proof.getProofData();
      setProofData(proofResult);
      setPublicData(publicResult);

      console.log("Proof Generated Successfully:", proofResult, publicResult);
    } catch (error) {
      console.error("Error generating proof:", error);
      alert("An error occurred during proof generation. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeBlueprint();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        zkEmail Proof Generator
      </h1>
      <div style={{ marginBottom: "15px" }}>
        <label>
          <strong>Upload EML File:</strong>
          <input type="file" accept=".eml" onChange={handleFileChange} />
        </label>
      </div>
      {externalInputs.map((input, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
          <label>
            <strong>{input.name}:</strong>
            <input
              type="text"
              value={input.value}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder={`Enter ${input.name}`}
              style={{ width: "100%", color: 'black' }}
            />
          </label>
        </div>
      ))}
      <button
        onClick={generateProof}
        disabled={loading}
        style={{
          width: "100%", padding: "10px", backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Generating Proof..." : "Generate Proof"}
      </button>
      {proofData && (
        <pre>{JSON.stringify(proofData, null, 2)}</pre>
      )}
      {publicData && (
        <pre>{JSON.stringify(publicData, null, 2)}</pre>
      )}
    </div>
  );
};

export default TestZKEmail;

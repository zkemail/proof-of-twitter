import { toHex } from "viem";

type Proof = {
  proof: {
    pi_a: string[2];
    pi_b: string[2][2];
    pi_c: string[2];
  };
  public: string[];
};

export function calculateSignalLength(entry: any) {
  let startIdx = 1;
  const parameters = entry.parameters as {
    values: { maxLength: number }[];
    externalInputs: { maxLength: number }[];
    emailBodyMaxLength: number;
    enableMasking: boolean;
  };
  if (parameters.enableMasking) {
    startIdx += parameters.emailBodyMaxLength;
  }
  if (!parameters.externalInputs) {
    parameters.externalInputs = [];
  }
  const valuesLength = parameters.values.reduce(
    (acc, value) =>
      acc + Math.floor(value.maxLength / 31) + (value.maxLength % 31 ? 1 : 0),
    startIdx
  );
  const inputsLength = parameters.externalInputs.reduce(
    (acc, value) =>
      acc + Math.floor(value.maxLength / 31) + (value.maxLength % 31 ? 1 : 0),
    0
  );
  return valuesLength + inputsLength;
}

export const circuitOutputToArgs = (output: Proof) => {
  return [
    [toHex(BigInt(output.proof.pi_a[0])), toHex(BigInt(output.proof.pi_a[1]))],
    [
      [
        toHex(BigInt(output.proof.pi_b[0][1])),
        toHex(BigInt(output.proof.pi_b[0][0])),
      ],
      [
        toHex(BigInt(output.proof.pi_b[1][1])),
        toHex(BigInt(output.proof.pi_b[1][0])),
      ],
    ],
    [toHex(BigInt(output.proof.pi_c[0])), toHex(BigInt(output.proof.pi_c[1]))],
    output.public.map((x) => toHex(BigInt(x))),
  ];
};

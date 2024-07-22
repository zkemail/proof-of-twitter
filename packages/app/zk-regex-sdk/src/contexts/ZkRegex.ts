import { createContext } from 'react';

export interface ProofStatus {
  status: string,
  id: string,
  pollUrl: string,
  estimatedTimeLeft: number
  publicOutput: any,
  proof: any,
}

interface ZkRegexValues {
    zkRegexRegistryUrl: string

    // The worker source code for generating the circuit inputs
    // If not provided, the default worker scripts from zk regex registry will be used
    // Format: { "zk-email/twitter-proof": "https://example.com/generate_inputs_worker_bundled.js" }
    customInputGenWorkerSrc: {
        [key: string]: string
    }
    inputWorkers: {
        [key: string]: Worker
    }
    createInputWorker: (name: string) => void;
    deleteInputWorker: (name: string) => void;
    generateInputFromEmail: (name: string, email: string) => Promise<any>;

    customProofGenWorkerSrc: {
        [key: string]: string
    }
    proofWorkers: {
        [key: string]: Worker
    }
    createProofWorker: (name: string) => void;
    deleteProofWorker: (name: string) => void;
    generateProofLocally: (name: string, input: any) => Promise<any>;

    proofStatus: {
        [key: string]: ProofStatus
    }
    generateProofRemotely: (name: string, input: any) => Promise<any>;
}

const defaultValues: ZkRegexValues = {
    zkRegexRegistryUrl: "",

    customInputGenWorkerSrc: {},
    inputWorkers: {},
    createInputWorker: () => { console.log("context not setup")},
    deleteInputWorker: () => { console.log("context not setup")},
    generateInputFromEmail: async () => { console.log("context not setup");},

    customProofGenWorkerSrc: {},
    proofWorkers: {},
    createProofWorker: () => { console.log("context not setup")},
    deleteProofWorker: () => { console.log("context not setup")},
    generateProofLocally: async () => { console.log("context not setup");},

    proofStatus: {},
    generateProofRemotely: async () => { console.log("context not setup");}
}

const ZkRegexContext = createContext<ZkRegexValues>(defaultValues)

export default ZkRegexContext
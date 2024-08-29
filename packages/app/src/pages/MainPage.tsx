import React, { useEffect, useState } from "react";
// @ts-ignore
import { useMount, useUpdateEffect } from "react-use";
import styled from "styled-components";
import _ from "lodash";
import { useAccount, useWriteContract } from "wagmi";
import {
  downloadProofFiles,
  generateProof,
  verifyProof,
} from "@zk-email/helpers/dist/chunked-zkey";
import { abi } from "../abi.json";
import {
  generateTwitterVerifierCircuitInputs,
  ITwitterCircuitInputs,
} from "@proof-of-twitter/circuits/helpers";
import { LabeledTextArea } from "../components/LabeledTextArea";
import DragAndDropTextBox from "../components/DragAndDropTextBox";
import { SingleLineInput } from "../components/SingleLineInput";
import { Button, TextButton } from "../components/Button";
import { Col, Row } from "../components/Layout";
import { NumberedStep } from "../components/NumberedStep";
import { TopBanner } from "../components/TopBanner";
import { ProgressBar } from "../components/ProgressBar";
import useGoogleAuth from "../hooks/useGoogleAuth";
import {
  RawEmailResponse,
  fetchEmailList,
  fetchEmailsRaw,
} from "../hooks/useGmailClient";
import { formatDateTime } from "../helpers/dateTimeFormat";
import EmailInputMethod from "../components/EmailInputMethod";
import { randomUUID } from "crypto";
import { useZkEmailSDK } from "@zk-email/zk-email-sdk";
import { calculateSignalLength, circuitOutputToArgs } from "../utils";
import { Hex } from "viem";


import { Box, Grid, Typography } from "@mui/material";
import Stepper from '../components/Stepper'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Video from "../components/Video";
import Nav from "../components/Nav";
import {useTheme} from "@mui/material";
import StatusTag from "../components/StatusTag";

const CIRCUIT_NAME = "twitter";
const entry = {
  id: "clyhcz1tl0001r4i0t87dk48g",
  title: "Proof of Twitter V2",
  slug: "zk-email/proof-of-twitter-v2",
  description:
    "Use a password reset email to proof you own the email connected to a twitter handle.",
  createdAt: "2024-07-11T14:22:41.146Z",
  updatedAt: "2024-08-16T08:10:32.501Z",
  createdBy: "zk-email",
  tags: ["twitter", "identity", "email"],
  status: "COMPLETED",
  parameters: {
    name: "twitterProof",
    values: [
      {
        name: "handle",
        parts: [
          { is_public: false, regex_def: "email was meant for @" },
          { is_public: true, regex_def: "[a-zA-Z0-9_]+" },
        ],
        location: "body",
        maxLength: 64,
      },
    ],
    version: "v2",
    senderDomain: "x.com",
    externalInputs: [{ name: "address", maxLength: 64 }],
    emailBodyMaxLength: 2816,
    ignoreBodyHashCheck: false,
    shaPrecomputeSelector: ">Not my account<",
  },
  emailQuery: "Password reset request from: info@x.com ",
  verifierContractAddress: "0xdb862d400104ba05590b9b657e3fb2e80e202c15",
  contractAddress: "0x53acd2f8d26f7bc292852aadd8484531a3117157",
};

export const MainPage: React.FC<{}> = (props) => {
  const { address } = useAccount();

  const {
    googleAuthToken,
    isGoogleAuthed,
    loggedInGmail,
    scopesApproved,
    googleLogIn,
    googleLogOut,
  } = useGoogleAuth();

  const {
    createInputWorker,
    generateInputFromEmail,
    generateProofRemotely,
    proofStatus,
    inputWorkers,
  } = useZkEmailSDK();

  const [ethereumAddress, setEthereumAddress] = useState<string>(address ?? "");
  const [emailFull, setEmailFull] = useState<string>(
    localStorage.emailFull || ""
  );
  const [proof, setProof] = useState<string>(localStorage.proof || "");
  const [publicSignals, setPublicSignals] = useState<string>(
    localStorage.publicSignals || ""
  );
  const [displayMessage, setDisplayMessage] = useState<string>("Prove");

  const [verificationMessage, setVerificationMessage] = useState("");
  const [verificationPassed, setVerificationPassed] = useState(false);
  const [lastAction, setLastAction] = useState<"" | "sign" | "verify" | "send">(
    ""
  );
  const [workerReady, setWorkerReady] = useState<boolean>(false);
  const [isFetchEmailLoading, setIsFetchEmailLoading] = useState(false);
  const [fetchedEmails, setFetchedEmails] = useState<RawEmailResponse[]>([]);
  const [showBrowserWarning, setShowBrowserWarning] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [inputMethod, setInputMethod] = useState<
    "GOOGLE" | "EML_FILE" | null
  >();
  const [status, setStatus] = useState<
    | "not-started"
    | "generating-input"
    | "downloading-proof-files"
    | "generating-proof"
    | "error-bad-input"
    | "error-failed-to-download"
    | "error-failed-to-prove"
    | "done"
    | "sending-on-chain"
    | "proof-files-downloaded-successfully"
    | "sent"
  >("not-started");
  const [isRemoteProofGenerationLoading, setIsRemoteProofGenerationLoading] =
    useState<boolean>(false);
  const [areInputWorkersCreating, setAreInputWorkerCreating] =
    useState<boolean>(false);
  const [externalInputs, setExternalInputs] = useState<Record<string, string>>(
    {}
  );
  const [signalLength, setSignalLength] = useState<number>(1);
  const [
    isRemoteProofVerificationLoading,
    setIsRemoteProofVerificationLoading,
  ] = useState<boolean>(false);

  const [stopwatch, setStopwatch] = useState<Record<string, number>>({
    startedDownloading: 0,
    finishedDownloading: 0,
    startedProving: 0,
    finishedProving: 0,
  });

  useEffect(() => {
    if (isGoogleAuthed) {
      handleFetchEmails();
    }
  }, [isGoogleAuthed]);

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isChrome = userAgent.indexOf("Chrome") > -1;
    if (!isChrome) {
      setShowBrowserWarning(true);
    }
  }, []);

  useEffect(() => {
    if (address) {
      setEthereumAddress(address);
    } else {
      setEthereumAddress("");
    }
  }, [address]);

  const recordTimeForActivity = (activity: string) => {
    setStopwatch((prev) => ({
      ...prev,
      [activity]: Date.now(),
    }));
  };

  const reformatProofForChain = (proofStr: string) => {
    if (!proofStr) return [];

    const proof = JSON.parse(proofStr);

    return [
      proof.pi_a.slice(0, 2),
      proof.pi_b
        .slice(0, 2)
        .map((s: string[]) => s.reverse())
        .flat(),
      proof.pi_c.slice(0, 2),
    ].flat();
  };

  const { data, isPending, isSuccess, writeContract } = useWriteContract();

  const handleFetchEmails = async () => {
    try {
      setIsFetchEmailLoading(true);
      const emailListResponse = await fetchEmailList(
        googleAuthToken.access_token,
        {}
      );

      const emailResponseMessages = emailListResponse.messages;
      if (emailResponseMessages?.length > 0) {
        const emailIds = emailResponseMessages.map((message) => message.id);
        const emails = await fetchEmailsRaw(
          googleAuthToken.access_token,
          emailIds
        );

        setFetchedEmails(emails);
      } else {
        setFetchedEmails([]);
      }
    } catch (error) {
      console.error("Error in fetching data:", error);
    } finally {
      setIsFetchEmailLoading(false);
    }
  };

  useMount(() => {
    function handleKeyDown() {
      setLastAction("");
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    if (!inputWorkers["zk-email/proof-of-twitter-v2"]) {
      setAreInputWorkerCreating(true);
      createInputWorker("zk-email/proof-of-twitter-v2");
      setSignalLength(calculateSignalLength(entry));

      const entryExternalInputs = [
        {
          name: "address",
          maxLength: 64,
        },
      ];

      for (const input of entryExternalInputs) {
        setExternalInputs({
          ...externalInputs,
          [input.name]: "",
        });
      }
    }
  }, []);

  // local storage stuff
  useUpdateEffect(() => {
    if (emailFull) {
      if (localStorage.emailFull !== emailFull) {
        console.info("Wrote email to localStorage");
        localStorage.emailFull = emailFull;
      }
    }
    if (proof) {
      if (localStorage.proof !== proof) {
        console.info("Wrote proof to localStorage");
        localStorage.proof = proof;
      }
    }
    if (publicSignals) {
      if (localStorage.publicSignals !== publicSignals) {
        console.info("Wrote publicSignals to localStorage");
        localStorage.publicSignals = publicSignals;
      }
    }
  }, [emailFull, proof, publicSignals]);

  // On file drop function to extract the text from the file
  const onFileDrop = async (file: File) => {
    if (file.name.endsWith(".eml")) {
      const content = await file.text();
      setEmailFull(content);
    } else {
      alert("Only .eml files are allowed.");
    }
  };

  useEffect(() => {
    const downloadZKey = async () => {
      console.time("zk-dl");

      recordTimeForActivity("startedDownloading");
      setStatus("downloading-proof-files");
      try {
        await downloadProofFiles(
          // @ts-ignore
          import.meta.env.VITE_CIRCUIT_ARTIFACTS_URL,
          CIRCUIT_NAME,
          () => {
            setDownloadProgress((p) => p + 1);
          }
        );
        setStatus("proof-files-downloaded-successfully");
      } catch (e) {
        console.log(e);
        setDisplayMessage("Error downloading proof files");
        setStatus("error-failed-to-download");
        return;
      }

      console.timeEnd("zk-dl");
      recordTimeForActivity("finishedDownloading");
    };

    downloadZKey();
  }, []);

  const handleGenerateProofRemotely = async () => {
    setIsRemoteProofGenerationLoading(true);
    const input = await generateInputFromEmail(
      "zk-email/proof-of-twitter-v2",
      emailFull,
      externalInputs
    );
    const body = Buffer.from(input.emailBody).toString("utf-8");
    console.log("input", input);
    console.log(input);
    try {
      const proofRes = await generateProofRemotely(
        "zk-email/proof-of-twitter-v2",
        input
      );
    } catch (err) {
      console.log("Something went wrong", err);
      setIsRemoteProofGenerationLoading(false);
    } finally {
    }
  };
  useEffect(() => {
    if (proofStatus[Object.keys(proofStatus)[0]]?.status == "COMPLETED") {
      setIsRemoteProofGenerationLoading(false);
      setProof(JSON.stringify(proofStatus[Object.keys(proofStatus)[0]].proof));
      setPublicSignals(
        JSON.stringify(proofStatus[Object.keys(proofStatus)[0]].publicOutput)
      );
    }
  }, [proofStatus]);

  useEffect(() => {
    if (inputWorkers["zk-email/proof-of-twitter-v2"]) {
      setAreInputWorkerCreating(false);
    }
  }, [inputWorkers]);

  console.log(
    proofStatus[Object.keys(proofStatus)[0]]?.proof,
    proofStatus[Object.keys(proofStatus)[0]],
    proofStatus
  );

  const verifyRemoteProof = async (id: string) => {
    if (!proofStatus[Object.keys(proofStatus)[0]]) {
      return;
    }
    setIsRemoteProofVerificationLoading(true);
    await writeContract(
      {
        abi: [
          {
            inputs: [
              {
                internalType: "uint256[2]",
                name: "a",
                type: "uint256[2]",
              },
              {
                internalType: "uint256[2][2]",
                name: "b",
                type: "uint256[2][2]",
              },
              {
                internalType: "uint256[2]",
                name: "c",
                type: "uint256[2]",
              },
              {
                internalType: `uint256[${signalLength}]`,
                name: "signals",
                type: `uint256[${signalLength}]`,
              },
            ],
            name: "verify",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ] as const,
        address: entry.contractAddress! as Hex,
        functionName: "verify",
        args: circuitOutputToArgs({
          proof: proofStatus[Object.keys(proofStatus)[0]].proof,
          public: proofStatus[Object.keys(proofStatus)[0]].publicOutput,
        }) as any,
      },
      {
        onError: (error, variables, context) =>
          setIsRemoteProofVerificationLoading(false),
        onSuccess: (data, variables, context) =>
          setIsRemoteProofVerificationLoading(false),
      }
    );
  };





  const theme = useTheme()

  const [counter, setCounter] = useState(0);


  const [steps, setSteps] = useState<[string, 'completed' | 'uncompleted'][]>([
    ['SEND RESET EMAIL', 'completed'],
    ['COPY/PASTE DKIM SIG', 'uncompleted'],
    ['ADD ADDRESS', 'uncompleted'],
    ['PROVE', 'uncompleted'],
    ['VERIFY & MINT', 'uncompleted']
  ]);

  const [activeStep, setActiveStep] = useState<number>(0);

  const markStepCompleted = (index: number) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index][1] = 'completed';
      return newSteps;
    });
  };

  const markStepUncompleted = (index: number) => {
    setSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[index][1] = 'uncompleted';
      return newSteps;
    });
  };


  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'generating-proof') {
      interval = setInterval(() => {
        setCounter(prevCounter => prevCounter + 1);
      }, 1000);
    } else {
      setCounter(0);
    }
    return () => clearInterval(interval);
  }, [status]);


  useEffect(() => {
    // i'm not sure if this if statement check is correct,  after the &&
    // i want to make sure the user actually put something in the 'Full Email with Headers' section OR if they logged in with Google they actually selected an email and it's not the default localStorage.emailFull=DOMException
    // this code works but there's probably a better check?
    if (emailFull != '' && emailFull != 'DOMException') {
      markStepCompleted(1); // Mark 'COPY/PASTE DKIM SIG' step as completed
    } else {
      markStepUncompleted(1); // Mark 'COPY/PASTE DKIM SIG' step as uncompleted
    }
  }, [emailFull]);


  useEffect(() => {
    if (ethereumAddress != '') {
      markStepCompleted(2); // Mark 'ADD ADDRESS' step as completed
    } else {
      markStepUncompleted(2); // Mark 'ADD ADDRESS' step as uncompleted
    }
  }, [ethereumAddress]);


  useEffect(() => {
    if (status === 'done' || status === 'proof-files-downloaded-successfully') {
      markStepCompleted(3); // Mark 'PROVE' step as completed
    } else {
      // markStepUncompleted(3); // Mark 'PROVE' step as uncompleted 
    }
  }, [status]);


  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    if (status === 'generating-proof') {
      setIsOverlayVisible(true);
    } else {
      setIsOverlayVisible(false);
    }
  }, [status]);







  return (
    <Grid container>
      {isOverlayVisible && <Overlay> </Overlay>}
      {showBrowserWarning && (
        <TopBanner
          message={"ZK Email only works on Chrome or Chromium-based browsers."}
        />
      )}




      {/* --------- LEFT HAND SIDE OF SCREEN --------- */}
      <Grid item xs={12} md={6} sx={{   height: '100vh', overflowY: 'auto', backgroundColor:'#ffbfbf', background:'radial-gradient(70.71% 70.71% at 50% 50%, #FFF 19%, rgba(255, 255, 255, 0.00) 61%), linear-gradient(38deg, rgba(255, 255, 255, 0.00) 60%, rgba(255, 255, 255, 0.69) 100%), linear-gradient(45deg, #FFF 10%, rgba(255, 255, 255, 0.00) 23.5%), linear-gradient(36deg, #FFF 12.52%, rgba(255, 255, 255, 0.00) 76.72%), linear-gradient(214deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 220, 234, 0.40) 37.53%, rgba(255, 255, 255, 0.00) 71%), linear-gradient(212deg, rgba(255, 255, 255, 0.00) 15%, #E4F1FE 72.5%, rgba(255, 255, 255, 0.00) 91.5%)'}}>
        <Nav splitscreen={true}/>
        <Box sx={{backgroundColor:'#FFFFFF', padding:'20px', color:'#000000', minHeight:'650px', paddingX:{sm: '40px', md:'60px'}}} >
        <Stepper
          steps={steps}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
        >

          {/* --------- SEND TWITTER PASSWORD RESET EMAIL SECTION - STEP 0 --------- */}
          {activeStep ==0 && (
            <Box sx={{marginTop:'100px', marginBottom: '40px'}}>
              <Typography variant='h1' sx={{marginBottom:'20px'}}>SEND TWITTER PASSWORD RESET EMAIL</Typography>
              <Typography>Send yourself a password reset email from Twitter. <br></br>(Reminder: Twitter name with emoji might fail to pass DKIM verification)</Typography>
              {/* <Typography sx={{marginTop:'20px', fontWeight:'bold', color:'red'}}>{message}</Typography>  */}
            </Box>
          )}
          {/* --------- END OF: SEND TWITTER PASSWORD RESET EMAIL SECTION - STEP 0 --------- */}






          {/* --------- COPY & PASTE THE EMAIL DKIM SIG - STEP 1 --------- */}
          {activeStep ==1 && (
            <Box>
              <Box sx={{marginTop:'100px', marginBottom: '40px'}}>
                <Typography variant='h1' sx={{marginBottom:'20px'}}>COPY & PASTE THE EMAIL DKIM SIG</Typography>
                <Typography>In your inbox, find the email from Twitter and click the three dot menu, then "Show original" then "Copy to clipboard". If on Outlook, download the original email as .eml and copy it instead. Copy paste or drop that into the box below. Note that we cannot use this to phish you: we do not know your password, and we never get this email info because we have no server at all. We are actively searching for a less sketchy email.</Typography>
              </Box>

              <Column>
              <SubHeader>Input</SubHeader>
              {inputMethod || !import.meta.env.VITE_GOOGLE_CLIENT_ID ? null : (
                  <EmailInputMethod
                    highlighted={true}
                    onClickGoogle={() => {
                      try {
                        setIsFetchEmailLoading(true);
                        setInputMethod("GOOGLE");
                        googleLogIn();
                      } catch (e) {
                        console.log(e);
                        setIsFetchEmailLoading(false);
                      }
                    }}
                    onClickEMLFile={() => {
                      setInputMethod("EML_FILE");
                    }}
                  />
                )}
                {inputMethod ? (
                  <TextButton onClick={() => setInputMethod(null)}>
                    ←{"  "}Go Back
                  </TextButton>
                ) : null}
                {inputMethod === "GOOGLE" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                      padding: "1.25rem",
                    }}
                  >
                    {isFetchEmailLoading ? (
                      <div className="loader" />
                    ) : (
                      <>
                      <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
                      Select the "Password Reset Request" Email from Twitter!
                      </Typography>
                      {fetchedEmails.map((email, index) => (
                        <Box
                          sx={{
                            borderBottom: "1px solid lightgrey",
                            width: "100%",
                            padding: "0 1rem",
                            display: "flex",
                            justifyContent: "space-between",
                            cursor: 'pointer',
                            borderTop: index === 0 ? "1px solid white" : "none", // Conditional border top
                          }}
                          onClick={() => {
                            setEmailFull(email.decodedContents);
                          }}
                        >
                          <Typography 
                            sx={{   
                              overflow: 'hidden', 
                              padding: "0.7rem 0rem",                          
                              color:
                                  email.decodedContents === emailFull
                                    ? theme.palette.accent.main
                                    : theme.palette.secondary.main
                          }}>
                            {email.subject}
                          </Typography>
                          <Typography 
                            sx={{
                              flex:'end', 
                              marginRight:'0px', 
                              width:'100px', 
                              textAlign:'right',
                              overflow: 'hidden', 
                              padding: "0.7rem 0rem",                          
                              color:
                                  email.decodedContents === emailFull
                                    ? theme.palette.accent.main
                                    : theme.palette.secondary.main
                          }}>
                            {formatDateTime(email.internalDate)}
                          </Typography>
                        </Box>
                      ))}
                      </>
                    )}
                    
                  </div>
                ) : null}
                {inputMethod === "EML_FILE" ||
                !import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                  <>
                    {" "}
                    <DragAndDropTextBox onFileDrop={onFileDrop} highlighted={true}/>
                    <h3
                      style={{
                        textAlign: "center",
                        marginTop: "0rem",
                        marginBottom: "0rem",
                      }}
                    >
                      OR
                    </h3>
                    <LabeledTextArea
                      highlighted={true}
                      label="Full Email with Headers"
                      value={emailFull}
                      onChange={(e) => {
                        setEmailFull(e.currentTarget.value);
                      }}
                    />
                  </>
                ) : null}



              {displayMessage ===
                "Downloading compressed proving files... (this may take a few minutes)" && (
                <ProgressBar
                  width={downloadProgress * 10}
                  label={`${downloadProgress} / 10 items`}
                />
              )}
              <ProcessStatus status={status}>
                {status !== "not-started" ? (
                  <div>
                    Status:
                    <span data-testid={"status-" + status}>{status}</span>
                  </div>
                ) : (
                  <div data-testid={"status-" + status}></div>
                )}
                <TimerDisplay timers={stopwatch} />
              </ProcessStatus>
              </Column>
              </Box>          
              )}
          {/* --------- END OF: COPY & PASTE THE EMAIL DKIM SIG - STEP 1 --------- */}
          



          {/* --------- ADD ETHEREUM ADDRESS TO SECURE PROOF - STEP 2 --------- */}
          {activeStep ==2 && (
            <Box>
              <Box sx={{marginTop:'100px', marginBottom: '40px'}}>
                <Typography variant='h1' sx={{marginBottom:'20px'}}>ADD ETHEREUM ADDRESS TO SECURE PROOF</Typography>
                <Typography>Paste in your sending Ethereum address. This ensures that no one else can "steal" your proof for another account (frontrunning protection!). Click "Prove". Note it is completely client side and open source, and no server ever sees your private information.</Typography>
              </Box>

              <Column>
                <SubHeader>Input</SubHeader>
                  <>
                    <LabeledTextArea
                      disabled={true}
                      label="Full Email with Headers"
                      value={emailFull}
                      onChange={(e) => {
                        setEmailFull(e.currentTarget.value);
                      }}
                    />
                  </>
          
                <SingleLineInput
                  highlighted={true}
                  label="Ethereum Address"
                  value={ethereumAddress}
                  onChange={(e) => {
                    setEthereumAddress(e.currentTarget.value);
                    setExternalInputs({...externalInputs,address: e.target.value,});
                  }}
                />

                {displayMessage ===
                  "Downloading compressed proving files... (this may take a few minutes)" && (
                  <ProgressBar
                    width={downloadProgress * 10}
                    label={`${downloadProgress} / 10 items`}
                  />
                )}
                <ProcessStatus status={status}>
                  {status !== "not-started" ? (
                    <div>
                      Status:
                      <span data-testid={"status-" + status}>{status}</span>
                    </div>
                  ) : (
                    <div data-testid={"status-" + status}></div>
                  )}
                  <TimerDisplay timers={stopwatch} />
                </ProcessStatus>
              </Column>
            </Box>          
          )}
          {/* --------- END OF: ADD ETHEREUM ADDRESS TO SECURE PROOF - STEP 2 --------- */}






          {/* --------- GENERATE PROOF USING INPUTS - STEP 3 --------- */}
          {activeStep ==3 && (
          <Box>
            <Box sx={{marginTop:'100px', marginBottom: '40px'}}>
              <Typography variant='h1' sx={{marginBottom:'20px'}}>GENERATE PROOF USING INPUTS</Typography>
              <Typography>Click "Prove". Note it is completely client side and open source, and no server ever sees your private information.</Typography>
            </Box>

            <Column>
            <SubHeader>Input</SubHeader>
                <LabeledTextArea
                  disabled={true}
                  label="Full Email with Headers"
                  value={emailFull}
                  onChange={(e) => {
                    setEmailFull(e.currentTarget.value);
                  }}
                />
                <SingleLineInput
                  disabled={true}
                  label="Ethereum Address"
                  value={ethereumAddress}
                  onChange={(e) => {
                    setEthereumAddress(e.currentTarget.value);
                    setExternalInputs({...externalInputs, address: e.target.value,});
                  }}
                />
                <Button
                  highlighted={true}
                  data-testid="prove-button"
                  disabled={
                    displayMessage !== "Prove" ||
                    emailFull.length === 0 ||
                    ethereumAddress.length === 0 ||
                    status !== "proof-files-downloaded-successfully"  ||  isRemoteProofGenerationLoading
                  }
                  onClick={async () => {
                    let input: ITwitterCircuitInputs;
                    try {
                      setDisplayMessage("Generating proof...");
                      setStatus("generating-input");

                      input = await generateTwitterVerifierCircuitInputs(
                        Buffer.from(emailFull),
                        ethereumAddress
                      );

                      console.log("Generated input:", JSON.stringify(input));
                    } catch (e) {
                      console.log("Error generating input", e);
                      setDisplayMessage("Prove");
                      setStatus("error-bad-input");
                      return;
                    }

                    console.time("zk-gen");
                    recordTimeForActivity("startedProving");
                    setDisplayMessage(
                      "Starting proof generation (this will take 6-10 minutes & ~5GB RAM)"
                    );
                    setStatus("generating-proof");
                    console.log("Starting proof generation");
                    // alert("Generating proof, will fail due to input");


                    const { proof, publicSignals } = await generateProof(
                      input,
                      // @ts-ignore
                      import.meta.env.VITE_CIRCUIT_ARTIFACTS_URL,
                      CIRCUIT_NAME
                    );




                    //const proof = JSON.parse('{"pi_a": ["19201501460375869359786976350200749752225831881815567077814357716475109214225", "11505143118120261821370828666956392917988845645366364291926723724764197308214", "1"], "pi_b": [["17114997753466635923095897108905313066875545082621248342234075865495571603410", "7192405994185710518536526038522451195158265656066550519902313122056350381280"], ["13696222194662648890012762427265603087145644894565446235939768763001479304886", "2757027655603295785352548686090997179551660115030413843642436323047552012712"], ["1", "0"]], "pi_c": ["6168386124525054064559735110298802977718009746891233616490776755671099515304", "11077116868070103472532367637450067545191977757024528865783681032080180232316", "1"], "protocol": "groth16", "curve": "bn128"}');
                    //const publicSignals = JSON.parse('["0", "0", "0", "0", "0", "0", "0", "0", "32767059066617856", "30803244233155956", "0", "0", "0", "0", "27917065853693287", "28015", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "113659471951225", "0", "0", "1634582323953821262989958727173988295", "1938094444722442142315201757874145583", "375300260153333632727697921604599470", "1369658125109277828425429339149824874", "1589384595547333389911397650751436647", "1428144289938431173655248321840778928", "1919508490085653366961918211405731923", "2358009612379481320362782200045159837", "518833500408858308962881361452944175", "1163210548821508924802510293967109414", "1361351910698751746280135795885107181", "1445969488612593115566934629427756345", "2457340995040159831545380614838948388", "2612807374136932899648418365680887439", "16021263889082005631675788949457422", "299744519975649772895460843780023483", "3933359104846508935112096715593287", "556307310756571904145052207427031380052712977221"]');
                    console.log("Finished proof generation");
                    console.timeEnd("zk-gen");
                    recordTimeForActivity("finishedProving");

                    console.log("publicSignals", publicSignals);

                    // alert("Done generating proof");
                    setProof(JSON.stringify(proof));
                    // let kek = publicSignals.map((x: string) => BigInt(x));
                    // let soln = packedNBytesToString(kek.slice(0, 12));
                    // let soln2 = packedNBytesToString(kek.slice(12, 147));
                    // let soln3 = packedNBytesToString(kek.slice(147, 150));
                    // setPublicSignals(`From: ${soln}\nTo: ${soln2}\nUsername: ${soln3}`);
                    setPublicSignals(JSON.stringify(publicSignals));

                if (!input) {
                  setStatus("error-failed-to-prove");
                  return;
                }
                setLastAction("sign");
                setDisplayMessage("Finished computing ZK proof");
                setStatus("done");
                try {
                  (window as any).cJson = JSON.stringify(input);
                  console.log(
                    "wrote circuit input to window.cJson. Run copy(cJson)"
                  );
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              {displayMessage}
            </Button>
            <Button
              data-testid="remote-prove-button"
              onClick={handleGenerateProofRemotely}
              disabled={ areInputWorkersCreating || emailFull.length === 0 || isRemoteProofGenerationLoading || !inputWorkers["zk-email/proof-of-twitter-v2"]}
            >
              Generate Proof Remotely{" "}
              {isRemoteProofGenerationLoading || areInputWorkersCreating ? 
              (
                <div className="loader" style={{ marginLeft: "1rem" }} />
              ) : ( 
                ""
              )}
            </Button>

            {displayMessage ===
              "Downloading compressed proving files... (this may take a few minutes)" && (
              <ProgressBar
                width={downloadProgress * 10}
                label={`${downloadProgress} / 10 items`}
              />
            )}
            <ProcessStatus status={status}>
              {status !== "not-started" ? (
                <div>
                  Status:
                  <span data-testid={"status-" + status}>{status}</span>
                </div>
              ) : (
                <div data-testid={"status-" + status}></div>
              )}
              <TimerDisplay timers={stopwatch} />
              {/* {status === 'generating-proof' && <CounterDisplay>Elapsed Time: {counter}s</CounterDisplay>} */}
            </ProcessStatus>
            </Column>
            </Box>   
                  
          )}
          {/* --------- END OF: GENERATE PROOF USING INPUTS - STEP 3 --------- */}



          {/* --------- VERIFY & MINT ON CHAIN TWITTER BADGE - STEP 4 --------- */}
          {activeStep ==4 && (
            <Box>
              <Box sx={{marginTop:'100px', marginBottom: '40px'}}>
                <Typography variant='h1' sx={{marginBottom:'20px'}}>VERIFY & MINT ON CHAIN TWITTER BADGE</Typography>
                <Typography>Click "Verify" and then "Mint Twitter Badge On-Chain", and approve to mint the NFT badge that proves Twitter ownership! Note that it is 700K gas right now so only feasible on Sepolia, though we intend to reduce this soon.</Typography>
              </Box>


              <Column>
                <SubHeader>Output</SubHeader>
                {verificationMessage && (
                  <StatusTag statusMessage={verificationMessage} statusPassed={verificationPassed}/>
                )}
                <LabeledTextArea
                  label="Proof Output"
                  value={proof}
                  onChange={(e) => {
                    setProof(e.currentTarget.value);
                  }}
                />
                <LabeledTextArea
                  label="Public Info Sent On Chain"
                  value={publicSignals}
                  // secret
                  onChange={(e) => {
                    setPublicSignals(e.currentTarget.value);
                  }}
                />
                <Button
                  highlighted={verificationMessage!='Passed!'}
                  disabled={emailFull.trim().length === 0 || proof.length === 0}
                  onClick={async () => {
                    try {
                      setLastAction("verify");
                      let ok = true;
                      const res: boolean = await verifyProof(
                        JSON.parse(proof),
                        JSON.parse(publicSignals),
                        // @ts-ignore
                        import.meta.env.VITE_CIRCUIT_ARTIFACTS_URL,
                        CIRCUIT_NAME
                      );
                      console.log(res);
                      if (!res) throw Error("Verification failed!");
                      setVerificationMessage("Passed!");
                      setVerificationPassed(ok);
                    } catch (er: any) {
                      setVerificationMessage("Failed to verify " + er.toString());
                      setVerificationPassed(false);
                    }
                  }}
                >
                  Verify
                </Button>
                <Button
                  highlighted={verificationMessage === 'Passed!' || isSuccess}
                  // disabled={!verificationPassed || isLoading || isSuccess || !write}
                  disabled={ !verificationPassed || isPending || isSuccess || !writeContract}
                  onClick={async () => {
                    if (isSuccess) {
                      window.open(`https://sepolia.etherscan.io/tx/${data?.hash}`, "_blank");
                    } else {
                      setStatus("sending-on-chain");
                      writeContract({
                        // @ts-ignore
                        address: import.meta.env.VITE_CONTRACT_ADDRESS,
                        abi: abi,
                        functionName: "mint",
                        args: [
                        reformatProofForChain(proof),
                        publicSignals ? JSON.parse(publicSignals) : [],  
                        ],
                      });
                    }
                  }}
                  endIcon={isSuccess ? <ArrowOutwardIcon /> : null}
                >
                  {isSuccess
                    ? "SUCCESSFULLY SENT ON CHAIN"
                    : isPending
                    ? "Confirm in wallet"
                    : false
                    ? "Connect Wallet first, scroll to top!"
                    : verificationPassed
                    ? "Mint Twitter badge on-chain"
                    : "Verify first, before minting on-chain!"}
                </Button>

                <Button
                  disabled={!proofStatus[Object.keys(proofStatus)[0]]}
                  onClick={async () => {
                  try {
                    verifyRemoteProof(entry.id);
                  } catch (er: any) {
                    setVerificationMessage("Failed to verify " + er.toString());
                    setVerificationPassed(false);
                  }}}
                >
                  Verify Remote proof
                  {isRemoteProofVerificationLoading ? (
                    <div className="loader" style={{ marginLeft: "1rem" }} />
                  ) : (
                    ""
                  )}
                </Button>
                {isSuccess && (
                  <div>
                    Transaction:{" "}
                    <a href={"https://sepolia.etherscan.io/tx/" + data?.hash}>
                      {data?.hash}
                    </a>
                  </div>
                )}
              </Column>
            </Box>
          )}
          {/* --------- END OF: VERIFY & MINT ON CHAIN TWITTER BADGE - STEP 4 --------- */}
      
        </Stepper>
        </Box>
      </Grid>
      {/* --------- END OF: LEFT HAND SIDE OF SCREEN --------- */}





      {/* --------- RIGHT HAND SIDE OF SCREEN FOR INSTRUCTION VIDEO OR ACCOMPANING GRAPHICS  --------- */}
      <Grid item xs={12} md={6} sx={{ maxHeight: '100vh',     overflow: 'hidden', backgroundColor:'#C3C3C3' }}>
        <Video/>
      </Grid>
      {/* --------- END OF: RIGHT SIDE FOR INSTRUCTION VIDEO OR ACCOMPANING GRAPHICS  --------- */}

    </Grid>
  );
};







const ProcessStatus = styled.div<{ status: string }>`
  font-size: 8px;
  padding: 8px;
  border-radius: 8px;
`;

const TimerDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 8px;
`;

const TimerDisplay = ({ timers }: { timers: Record<string, number> }) => {
  return (
    <TimerDisplayContainer>
      {timers["startedDownloading"] && timers["finishedDownloading"] ? (
        <div>
          Zkey Download time:&nbsp;
          <span data-testid="download-time">
            {timers["finishedDownloading"] - timers["startedDownloading"]}
          </span>
          ms
        </div>
      ) : (
        <div></div>
      )}
      {timers["startedProving"] && timers["finishedProving"] ? (
        <div>
          Proof generation time:&nbsp;
          <span data-testid="proof-time">
            {timers["finishedProving"] - timers["startedProving"]}
          </span>
          ms
        </div>
      ) : (
        <div></div>
      )}
    </TimerDisplayContainer>
  );
};







const CounterDisplay = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: black;
`;

const Header = styled.span`
  font-weight: 600;
  margin-bottom: 1em;
  color: #000000;
  font-size: 2.25rem;
  line-height: 2.5rem;
  letter-spacing: -0.02em;
`;

const SubHeader = styled(Header)`
  font-size: 1.7em;
  margin-bottom: 16px;
  color: "#000000";
`;



const Column = styled(Col)`
  width: fit;
  gap: 1rem;
  align-self: flex-start;
  background: #FFFFFC;
  padding: 2rem;
  border-radius: 10px;
  border: 1px solid #C7C7C7;
`;



const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
`;

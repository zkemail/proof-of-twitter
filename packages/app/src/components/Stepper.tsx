// import React, { useState } from 'react';
// import { Stepper, Step, StepLabel, Button, Box } from '@mui/material';

// const steps = [
//   'Send Reset Email',
//   'Copy/Paste DKIM Sig',
//   'Add Address',
//   'Prove',
//   'Verify & Mint'
// ];

// const StepperComponent: React.FC = () => {
//   const [activeStep, setActiveStep] = useState<number>(0);

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleStep = (step: number) => () => {
//     setActiveStep(step);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Stepper activeStep={activeStep}>
//         {steps.map((label, index) => (
//           <Step key={label} onClick={handleStep(index)}>
//             <StepLabel>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>
//       <Box sx={{ mt: 2 }}>
//         {activeStep === steps.length ? (
//           <div>
//             <p>All steps completed</p>
//             <Button onClick={() => setActiveStep(0)}>Reset</Button>
//           </div>
//         ) : (
//           <div>
//             <div>
//               <Button
//                 disabled={activeStep === 0}
//                 onClick={handleBack}
//                 sx={{ mt: 1, mr: 1 }}
//               >
//                 Back
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 sx={{ mt: 1, mr: 1 }}
//               >
//                 {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//               </Button>
//             </div>
//           </div>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default StepperComponent;









// import React, { useState } from 'react';
// import { Stepper, Step, StepLabel, Button, Box, Typography } from '@mui/material';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// const steps = [
//   'Send Reset Email',
//   'Copy/Paste DKIM Sig',
//   'Add Address',
//   'Prove',
//   'Verify & Mint'
// ];

// const StepperComponent: React.FC = () => {
//   const [activeStep, setActiveStep] = useState<number>(0);

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleStep = (step: number) => () => {
//     setActiveStep(step);
//   };

//   return (
//     <Box sx={{ width: '100%' }}>
//       <Stepper activeStep={activeStep} alternativeLabel>
//         {steps.map((label, index) => (
//           <Step key={label} onClick={handleStep(index)} sx={{ cursor: 'pointer' }}>
//             <StepLabel>
//               <Typography variant="body1" component="span" sx={{ fontWeight: activeStep === index ? 'bold' : 'regular' }}>
//                 {label}
//               </Typography>
//             </StepLabel>
//             {index < steps.length - 1 && <ArrowForwardIosIcon sx={{ fontSize: 12, verticalAlign: 'middle', marginLeft: 1, marginRight: 1 }} />}
//           </Step>
//         ))}
//       </Stepper>
//       <Box sx={{ mt: 2 }}>
//         {activeStep === steps.length ? (
//           <div>
//             <p>All steps completed</p>
//             <Button onClick={() => setActiveStep(0)}>Reset</Button>
//           </div>
//         ) : (
//           <div>
//             <div>
//               <Button
//                 disabled={activeStep === 0}
//                 onClick={handleBack}
//                 sx={{ mt: 1, mr: 1 }}
//               >
//                 Back
//               </Button>
//               <Button
//                 variant="contained"
//                 onClick={handleNext}
//                 sx={{ mt: 1, mr: 1 }}
//               >
//                 {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
//               </Button>
//             </div>
//           </div>
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default StepperComponent;








// import React, { useState } from 'react';
// import { Box, Typography, IconButton } from '@mui/material';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// const steps = [
//   'Send Reset Email',
//   'Copy/Paste DKIM Sig',
//   'Add Address',
//   'Prove',
//   'Verify & Mint'
// ];

// const StepperComponent: React.FC = () => {
//   const [activeStep, setActiveStep] = useState<number>(0);

//   const handleStep = (step: number) => () => {
//     setActiveStep(step);
//   };

//   return (
//     <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
//       {steps.map((label, index) => (
//         <React.Fragment key={label}>
//           <Box
//             onClick={handleStep(index)}
//             sx={{
//               cursor: 'pointer',
//               display: 'flex',
//               alignItems: 'center'
//             }}
//           >
//             <Typography
//               variant="body1"
//               component="span"
//               sx={{
//                 fontWeight: activeStep === index ? 'bold' : 'regular',
//                 color: activeStep === index ? 'black' : 'gray',
//                 borderBottom: activeStep === index ? '2px solid black' : 'none',
//                 paddingBottom: '2px'
//               }}
//             >
//               {label}
//             </Typography>
//           </Box>
//           {index < steps.length - 1 && (
//             <ArrowForwardIosIcon sx={{ fontSize: 12, verticalAlign: 'middle', marginLeft: 1, marginRight: 1, color: 'gray' }} />
//           )}
//         </React.Fragment>
//       ))}
//     </Box>
//   );
// };

// export default StepperComponent;




// import React, { useState } from 'react';
// import { Box, Typography } from '@mui/material';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// const steps = [
//   'SEND RESET EMAIL',
//   'COPY/PASTE DKIM SIG',
//   'ADD ADDRESS',
//   'PROVE',
//   'VERIFY & MINT'
// ];

// const StepperComponent: React.FC = () => {
//   const [activeStep, setActiveStep] = useState<number>(0);

//   const handleStep = (step: number) => () => {
//     setActiveStep(step);
//   };

//   return (
//     <Box sx={{ width: '100%', position: 'relative', marginY: '50px'}}>
//       {/* Light grey bar */}
//       <Box
//         sx={{
//           position: 'absolute',
//           top: '100%',
//           left: 0,
//           right: 0,
//           height: '2px',
//           backgroundColor: '#e0e0e0',
//           zIndex: 1,
//           transform: 'translateY(-50%)'
//         }}
//       />

//       <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
//         {steps.map((label, index) => (
//           <React.Fragment key={label}>
//             <Box
//               onClick={handleStep(index)}
//               sx={{
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 position: 'relative',
//                 padding: '0 10px'
//               }}
//             >
//               <Typography
//                 variant="body1"
//                 component="span"
//                 sx={{
//                   fontWeight: activeStep === index ? 'bold' : 'regular',
//                   color: activeStep === index ? 'black' : 'gray',
//                   borderBottom: activeStep === index ? '2px solid black' : 'none',
//                   paddingBottom: '2px'
//                 }}
//               >
//                 {label}
//               </Typography>
//             </Box>
//             {index < steps.length - 1 && (
//               <ArrowForwardIosIcon sx={{ fontSize: 12, verticalAlign: 'middle', color: 'gray' }} />
//             )}
//           </React.Fragment>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default StepperComponent;












// import React, { ReactNode } from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// interface StepperComponentProps {
//   children: ReactNode;
//   steps: string[];
//   activeStep: number;
//   setActiveStep: (step: number) => void;
// }

// const StepperComponent: React.FC<StepperComponentProps> = ({
//   children,
//   steps,
//   activeStep,
//   setActiveStep
// }) => {
//   const handleStep = (step: number) => () => {
//     setActiveStep(step);
//   };

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   return (
//     <Box sx={{ width: '100%', position: 'relative', marginY: '50px' }}>
//       <Box />
//       {/* Light grey bar */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           position: 'relative',
//           zIndex: 2,
//           borderBottom: '1px solid #e0e0e0',
//         }}
//       >
//         {steps.map((label, index) => (
//           <React.Fragment key={label}>
//             <Box
//               onClick={handleStep(index)}
//               sx={{
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//                 position: 'relative',
//                 padding: '0 10px',
//               }}
//             >
//               <Typography
//                 variant="body1"
//                 component="span"
//                 sx={{
//                   fontWeight: activeStep === index ? 'bold' : 'regular',
//                   color: activeStep === index ? 'black' : 'gray',
//                   borderBottom: activeStep === index ? '2px solid black' : 'none',
//                   paddingBottom: '2px',
//                   fontSize: { xs: '9px', sm: '10px', md: '11px', lg: '12px' }
//                 }}
//               >
//                 {label}
//               </Typography>
//             </Box>
//             {index < steps.length - 1 && (
//               <ArrowForwardIosIcon sx={{ fontSize: 12, verticalAlign: 'middle', color: 'gray' }} />
//             )}
//           </React.Fragment>
//         ))}
//       </Box>

//       <Box sx={{ marginTop: '20px' }}>
//         {children}
//       </Box>

//       <Box sx={{ display: 'flex', width: '220px', justifyContent: 'space-between', marginTop: '20px' }}>
//         {activeStep !== 0 && (
//           <Button
//             variant="outlined"
//             onClick={handleBack}
//             sx={{
//               textTransform: 'none',
//               fontWeight: 'regular',
//               padding: '10px 35px',
//               border: '1px solid #1C1C1C',
//               marginY: '9px',
//               color: '#1C1C1C',
//               '&:hover':{
//                 backgroundColor: '#1C1C1C',
//                 color: '#ffffff'
//               },
//               '&.Mui-disabled': {
//                 backgroundColor: '#ffffff', // Change to desired disabled background color
//                 color: '#1C1C1C', // Change to desired disabled text color
//                 border: '1px solid #757575' // Change to desired disabled border color
//               }
//             }}
//           >
//             Back
//           </Button>
//         )}


//       {activeStep !== 4 && (
//         <Button
//           variant="contained"
//           onClick={handleNext}
//           disabled={activeStep === steps.length - 1}
//           sx={{
//             textTransform: 'none',
//             fontWeight: 'regular',
//             padding: '10px 35px',
//             backgroundColor: '#1C1C1C',
//             border: '1px solid #1C1C1C',
//             marginY: '9px',
//             color: '#ffffff',
//             '&.Mui-disabled': {
//               backgroundColor: '#ffffff', // Change to desired disabled background color
//               color: '#1C1C1C', // Change to desired disabled text color
//               border: '1px solid #757575', // Change to desired disabled border color
//             }
//           }}
//         >
//           Next
//         </Button>
//       )}
//       </Box>
//     </Box>
//   );
// };

// export default StepperComponent;






// import React, { useState, ReactNode } from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// interface StepperComponentProps {
//   children: ReactNode;
//   steps: string[];
//   activeStep: number;
//   setActiveStep: (step: number) => void;
// }

// const StepperComponent: React.FC<StepperComponentProps> = ({
//   children,
//   steps,
//   activeStep,
//   setActiveStep
// }) => {
//   const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(steps.length).fill(false));

//   const handleStep = (step: number) => () => {
//     if (step <= activeStep || completedSteps[step - 1]) {
//       setActiveStep(step);
//     }
//   };

//   const handleNext = () => {
//     if (activeStep < steps.length - 1 && completedSteps.slice(0, activeStep).every(completed => completed)) {
//       setCompletedSteps((prevCompletedSteps) => {
//         const newCompletedSteps = [...prevCompletedSteps];
//         newCompletedSteps[activeStep] = true;
//         return newCompletedSteps;
//       });
//       setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     }
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   return (
//     <Box sx={{ width: '100%', position: 'relative', marginY: '50px' }}>
//       <Box />
//       {/* Light grey bar */}
//       <Box
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           position: 'relative',
//           zIndex: 2,
//           borderBottom: '1px solid #e0e0e0',
//         }}
//       >
//         {steps.map((label, index) => {
//           const isStepDisabled = !(index <= activeStep || completedSteps[index - 1]);
//           return (
//             <React.Fragment key={label}>
//               <Box
//                 onClick={handleStep(index)}
//                 sx={{
//                   cursor: isStepDisabled ? 'not-allowed' : 'pointer',
//                   display: 'flex',
//                   alignItems: 'center',
//                   position: 'relative',
//                   padding: '0 10px',
//                 }}
//               >
//                 <Typography
//                   variant="body1"
//                   component="span"
//                   sx={{
//                     fontWeight: activeStep === index ? 'bold' : 'regular',
//                     color: activeStep === index ? 'black' : 'gray',
//                     borderBottom: activeStep === index ? '2px solid black' : 'none',
//                     paddingBottom: '2px',
//                     fontSize: { xs: '9px', sm: '10px', md: '11px', lg: '12px' }
//                   }}
//                 >
//                   {label}
//                 </Typography>
//               </Box>
//               {index < steps.length - 1 && (
//                 <ArrowForwardIosIcon sx={{ fontSize: 12, verticalAlign: 'middle', color: 'gray' }} />
//               )}
//             </React.Fragment>
//           );
//         })}
//       </Box>

//       <Box sx={{ marginTop: '20px' }}>
//         {children}
//       </Box>

//       <Box sx={{ display: 'flex', width: '220px', justifyContent: 'space-between', marginTop: '20px' }}>
//         {activeStep !== 0 && (
//           <Button
//             variant="outlined"
//             onClick={handleBack}
//             sx={{
//               textTransform: 'none',
//               fontWeight: 'regular',
//               padding: '10px 35px',
//               border: '1px solid #1C1C1C',
//               marginY: '9px',
//               color: '#1C1C1C',
//               '&:hover':{
//                 backgroundColor: '#1C1C1C',
//                 color: '#ffffff'
//               },
//               '&.Mui-disabled': {
//                 backgroundColor: '#ffffff', // Change to desired disabled background color
//                 color: '#1C1C1C', // Change to desired disabled text color
//                 border: '1px solid #757575' // Change to desired disabled border color
//               }
//             }}
//           >
//             Back
//           </Button>
//         )}


//       {activeStep !== steps.length - 1 && (
//         <Button
//           variant="contained"
//           onClick={handleNext}
//           disabled={!completedSteps.slice(0, activeStep).every(completed => completed)}
//           sx={{
//             textTransform: 'none',
//             fontWeight: 'regular',
//             padding: '10px 35px',
//             backgroundColor: '#1C1C1C',
//             border: '1px solid #1C1C1C',
//             marginY: '9px',
//             color: '#ffffff',
//             '&.Mui-disabled': {
//               backgroundColor: '#ffffff', // Change to desired disabled background color
//               color: '#1C1C1C', // Change to desired disabled text color
//               border: '1px solid #757575', // Change to desired disabled border color
//             }
//           }}
//         >
//           Next
//         </Button>
//       )}
//       </Box>
//     </Box>
//   );
// };

// export default StepperComponent;

import React, { ReactNode } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Define the types for the props
interface StepperComponentProps {
  children: ReactNode;
  steps: [string, 'completed' | 'uncompleted'][];
  activeStep: number;
  setActiveStep: (step: number) => void;
}

const StepperComponent: React.FC<StepperComponentProps> = ({
  children,
  steps,
  activeStep,
  setActiveStep
}) => {
  const theme = useTheme();

  const handleStep = (step: number) => () => {
    if (step <= activeStep || steps.slice(0, step).every(s => s[1] === 'completed')) {
      setActiveStep(step);
    }
  };

  const handleNext = () => {
    if (
      activeStep < steps.length - 1 &&
      steps.slice(0, activeStep + 1).every(step => step[1] === 'completed')
    ) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Box sx={{ width: '100%', position: 'relative', marginY: '50px' }}>
      <Box />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          // borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {steps.map((step, index) => {
          const isStepDisabled = !steps.slice(0, index).every(s => s[1] === 'completed');
          return (
            <React.Fragment key={step[0]}>
              <Box
                onClick={handleStep(index)}
                sx={{
                  cursor: isStepDisabled ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  padding: '0 10px',
                }}
              >
                <Typography
                  variant="body1"
                  component="span"
                  sx={{
                    fontWeight: activeStep === index ? 'bold' : 'regular',
                    color: activeStep === index ? theme.palette.accent.main : theme.palette.text.secondary,
                    borderBottom: activeStep === index ? `2px solid ${theme.palette.accent.main}` : 'none',
                    paddingBottom: '2px',
                    fontSize: { xxs: '5px', xs: '6px', sm: '10px', md: '8px', lg: '8px', xl: '12px' }
                  }}
                >
                  {step[0]}
                </Typography>
              </Box>
              {index < steps.length - 1 && (
                <ArrowForwardIosIcon sx={{ fontSize: { xs: 5, sm: 7, md: 12 }, verticalAlign: 'middle', color: theme.palette.text.secondary }} />
              )}
            </React.Fragment>
          );
        })}
      </Box>

      <Box sx={{ marginTop: '20px' }}>
        {children}
      </Box>

      <Box sx={{ display: 'flex', width: '220px', justifyContent: 'space-between', marginTop: '20px' }}>
        {activeStep !== 0 && (
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              textTransform: 'none',
              fontWeight: 'regular',
              padding: '10px 35px',
              border: `1px solid ${theme.palette.text.primary}`,
              marginY: '9px',
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.text.primary,
                color: theme.palette.background.paper
              },
              '&.Mui-disabled': {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.text.disabled}`
              }
            }}
          >
            Back
          </Button>
        )}

        {activeStep !== steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!steps.slice(0, activeStep + 1).every(step => step[1] === 'completed')}
            sx={{
              textTransform: 'none',
              fontWeight: 'regular',
              padding: '10px 35px',
              backgroundColor: theme.palette.text.primary,
              border: `1px solid ${theme.palette.text.primary}`,
              marginY: '9px',
              color: theme.palette.background.paper,
              '&.Mui-disabled': {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.text.disabled}`,
                cursor: 'not-allowed',
                pointerEvents: 'all !important'
              }
            }}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default StepperComponent;

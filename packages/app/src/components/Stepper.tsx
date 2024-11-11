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

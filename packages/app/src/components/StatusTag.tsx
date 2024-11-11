// StatusTag.tsx
import React from 'react';
import { Typography, Box } from '@mui/material';

interface StatusTagProps {
  statusMessage: string;
  statusPassed: boolean;
}

const StatusTag: React.FC<StatusTagProps> = ({ statusMessage, statusPassed }) => {
  return (
    <Box
      sx={{
        borderRadius: '100px',
        width:'fit-content',
        px: 4,
        py: 1,
        border: '1px solid',
        backgroundColor: statusPassed ? '#EDFFED' : '#FEF1F1',
        borderColor: statusPassed ? '#185A46' : '#C72C22',
        color: statusPassed ? '#185A46' : '#C72C22',
        display: 'inline-block',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:{xs:'10px', sm:'12px', md:'13px'  }
      }}
    >
        {statusMessage}
    </Box>
  );
};

export default StatusTag;

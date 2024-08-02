import React, { FC } from 'react';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Define the props types
interface AccordionProps {
  title: string;
  contents: string;
  alignment?: 'left' | 'right';
}

const CustomAccordion = styled(MuiAccordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '&:before': {
    display: 'none',
  },
  background: 'inherit',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  '& .MuiAccordionSummary-root': {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    '&:hover .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.secondary.main,
    },
  },
  '& .MuiAccordionSummary-content': {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    marginRight: theme.spacing(1),
    transition: 'transform 0.2s',
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(180deg)',
  },
  '& .MuiAccordionDetails-root': {
    padding: theme.spacing(2),
  },
}));

const Accordion: FC<AccordionProps> = ({ title, contents, alignment = 'left' }) => {
  return (
    <CustomAccordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel-content"
        id="panel-header"
        sx={{
          flexDirection: alignment === 'right' ? 'row-reverse' : 'row',
          justifyContent: alignment === 'right' ? 'space-between' : 'flex-start',
          '& .MuiAccordionSummary-expandIconWrapper': {
            order: alignment === 'right' ? 2 : 1,
            marginRight: alignment === 'right' ? 0 : 1,
            marginLeft: alignment === 'right' ? 1 : 0,
          },
          width: '100%',
        }}
      >
        <Typography
          color="black"
          fontWeight="500"
          sx={{
            fontSize: { xs: '12px', sm: '15px', md: '19px' },
            textAlign: alignment === 'right' ? 'right' : 'left',
            flexGrow: 1,
          }}
        >
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography
          sx={{
            paddingLeft: alignment === 'right' ? '0px' : '0px',
            paddingRight: alignment === 'right' ? '0px' : '0px',
            color: '#666363',
            fontSize: { xs: '11px', sm: '14px', md: '16px' },
            textAlign: alignment === 'right' ? 'right' : 'left',
          }}
        >
          {contents}
        </Typography>
      </AccordionDetails>
    </CustomAccordion>
  );
};

export default Accordion;
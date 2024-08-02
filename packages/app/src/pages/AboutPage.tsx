import React from 'react';
import Nav from '../components/Nav';
import { Container, Typography, Box, Grid, Stack, useTheme } from '@mui/material';
import { Button, OutlinedButton } from '../components/Button';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import Accordion from '../components/Accordion';
import { Link } from 'react-router-dom';
import { useMediaQuery } from "@mui/material";

import LockResetIcon from '@mui/icons-material/LockReset';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";

import Video from '../components/Video';

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.down('sm'));
  const isMd = useMediaQuery(theme.breakpoints.down('md'));

  const faqs = [
    {
      title: 'How do you selectively reveal content in an email ?',
      contents: 'We can hide any information or selectively reveal any text, wether that’s the sender, receiver, subject, body etc using Regex. Regex is short for regular expression, this term represents sequence of characters that forms a search pattern, commonly used for string matching within text.  It consists of a sequence of characters that define a search pattern, enabling complex searches, substitutions, and string manipulations. For example, in programming and text processing, regex can identify, extract, or replace specific text patterns, such as email addresses, dates, or phone numbers, by defining these patterns through a combination of literal characters and special symbols. In the context of ZK Email it is used to parse email headers and extract relevant information.'
    },
    {
      title: 'How can I do this anonymously',
      contents: 'ZK Email leverages the principles of Zero Knowledge proofs and serverless execution within the browser to provide a verifiable yet anonymous way to confirm an emails contents and recipents . Zero Knowledge proofs allow provers to prove that they know or possess certain information without revealing the information itself to a verifer. In ZK Email, this technology is used to verify user identity and email content without exposing sensitive data to a server or other users. The serverless architecture means that all proof generation is executed entirely within the user`s browser.'
    },
    {
      title: 'Why don’t I need to trust you?',
      contents: 'The DKIM email signitures do not contain information we can use to sign other emails, all our code is open source and being audited'
    },
    {
      title: 'How do you verify the email contents and recipents',
      contents: 'We use the existing DKIM Signiture, almost all emails are signed by the sending domain server using an algorithm called DKIM. It can be summarized as this rsa_sign(sha256(from:..., to:..., subject:..., <body hash>,...), private key). Every time an email is sent we can verify the sender, receiver, the subject, the body by checking if the corresponding public key of the email address applied on the DKIM signiture returns the sha256(from:..., to:..., subject:..., <body hash>,...) a hash of the from, to subject, email details which we can check by rehashing'
    },
  ];

  return (
    <Box sx={{backgroundColor:'#ffbfbf', background:'radial-gradient(70.71% 70.71% at 50% 50%, #FFF 19%, rgba(255, 255, 255, 0.00) 61%), linear-gradient(38deg, rgba(255, 255, 255, 0.00) 60%, rgba(255, 255, 255, 0.69) 100%), linear-gradient(45deg, #FFF 10%, rgba(255, 255, 255, 0.00) 23.5%), linear-gradient(36deg, #FFF 12.52%, rgba(255, 255, 255, 0.00) 76.72%), linear-gradient(214deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 220, 234, 0.40) 37.53%, rgba(255, 255, 255, 0.00) 71%), linear-gradient(212deg, rgba(255, 255, 255, 0.00) 15%, #E4F1FE 72.5%, rgba(255, 255, 255, 0.00) 91.5%)'}}>
      <Nav splitscreen={false}/>
      <Container>
        <Box sx={{ marginTop: '120px', marginBottom: '100px', paddingX: '20px' }}>

        <Link to="https://prove.email/" target="_blank">
            <Box
              display="flex"
              alignItems="center"
              sx={{
                borderRadius: "25.95px",
                border: "1px solid #CECFD2",
                width: "160px",
                marginX: "auto",
                marginBottom: "20px",
                backgroundColor: "#ffffff",
              }}
            >
              <DraftsOutlinedIcon
                sx={{
                  marginLeft: "15px",
                  marginRight: "9px",
                  padding: "4px",
                  color: "#000000",
                  fontSize: "16px",
                }}
              />
              <Typography variant='h5'
                sx={{ fontSize: "12px", fontWeight: 700, textAlign: "center" }}
              >
                ZKEmail Tech
              </Typography>
            </Box>
          </Link>
          <Typography variant="h2" sx={{ textAlign: 'center', marginBottom: '20px' }}>
            Welcome to Proof of Twitter, {' '}
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'inline' } }}>
              <br />
            </Box>
            a ZK Email Technology
          </Typography>

          <Typography variant="body1" sx={{ textAlign: 'center', marginX: 'auto', marginBottom: '30px', fontSize: { xs: '12px', md: '14px' } }}>
            Our ZK libraries will allow you to generate zero knowledge proofs proving
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'inline' } }}>
              <br />
            </Box>
            you received some email and mask out any private data,
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline', md: 'inline' } }}>
              <br />
            </Box>
            without trusting our server to keep your privacy.
          </Typography>

          <Box sx={{ display: 'flex', gap: { xs: '3px', sm: '10px' }, width: { xs: '240px', sm: '300px' }, marginX: 'auto' }}>
            <Button endIcon={<ArrowOutwardIcon />} href='/'  highlighted={true}>
              Try it out
            </Button>
            <OutlinedButton href='https://prove.email/blog/twitter' target='_blank'>
              Learn More
            </OutlinedButton>
          </Box>
        </Box>




        {/* STEPS ROW */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', height:'fit-content', gap: {xs:'12px', sm:'15px', md:'50px', }, marginX: 'auto', marginY: '80px', alignItems:'center'}}>
          <Box sx={{textAlign:'center'}}>
            <MailOutlineIcon sx={{fontSize:{xs:'12px', md:'40px',}}}/>
            <Typography sx={{fontSize:{xs:'10px', md:'15px' }}}>SEND RESET EMAIL</Typography>    
          </Box>
          <Box sx={{textAlign:'center'}}>
            <ContentPasteIcon sx={{fontSize:{xs:'12px', md:'40px' }}}/>
            <Typography sx={{fontSize:{xs:'10px', md:'15px' }}}>COPY/PASTE DKIM SIG</Typography> 
          </Box>
          <Box sx={{textAlign:'center'}}>
            <FingerprintIcon sx={{fontSize:{xs:'12px', md:'40px' }}}/>
            <Typography sx={{fontSize:{xs:'10px', md:'15px' }}}>ADD ADDRESS</Typography>
          </Box>
          <Box sx={{textAlign:'center'}}>
            <RefreshIcon sx={{fontSize:{xs:'12px', md:'40px' }}}/>
            <Typography sx={{fontSize:{xs:'10px', md:'15px' }}}>GENERATE PROOF</Typography>
          </Box>
          <Box sx={{textAlign:'center'}}>
            <CheckCircleOutlineIcon sx={{fontSize:{xs:'12px', md:'40px' }}}/>
            <Typography sx={{fontSize:{xs:'10px', md:'15px' }}}>VERIFY & MINT</Typography>
          </Box>
        </Box>
        



        {/* VIDEO */}
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginX: 'auto', overflow: 'hidden' }}>
          <Video />
        </Box>







        {/* FAQ ACCORDION */}
        {/* <Box sx={{'padding-[10%] py-[100px] my-[100px] z-50 bg-white w-full'}}> */}

        <Box sx={{paddingY:'100px', marginY: '20px', width:'100%', marginLeft:'20px'}}>
          <div className='min-h-[200px]'>
            <div className='relative '>
              <Typography paddingY='20px' variant='h1' sx={{ textAlign: 'left' }}>
                Frequently Asked Questions
              </Typography>
            </div>

            <Grid container>
              <Grid item xs={12} sm={4} sx={{ marginBottom: '50px' }}>
                <Typography variant='h5' paddingTop="10px" sx={{ fontSize: { xs: '12px', md: '15px' } }}>
                  Have a Question that isn’t answered?
                </Typography>
                <Stack spacing={2} direction="row" sx={{ paddingTop: "16px", width: '150px' }}>
                  <Button href='https://t.me/zkemail' target='_blank'> Drop Us a Line</Button>
                </Stack>
              </Grid>

              <Grid item xs={12} sm={10}  className="relative col-span-2 py-[30px] w-[100%]" style={{ width: '100%', margin: '0 auto', zIndex: '100', marginRight:'0px' }}>
                {faqs.map((faq, index) => (
                  <Accordion key={index} title={faq.title} contents={faq.contents} />
                ))}
              </Grid>
            </Grid>

          </div>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;

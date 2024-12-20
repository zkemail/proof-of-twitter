
import { Box, Typography, useTheme } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';

// Define the types for the props
interface CustomConnectButtonProps {
  splitscreen?: boolean;
}

interface NavProps {
  splitscreen?: boolean;
}

/* STYLED CONNECT WALLET BUTTON */
const CustomConnectButton: React.FC<CustomConnectButtonProps> = ({ splitscreen = false }) => {
  const theme = useTheme();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <Box
            onClick={() => {
              if (!ready) {
                openConnectModal();
              } else if (connected) {
                openAccountModal();
              } else {
                openConnectModal();
              }
            }}
            sx={{
              fontSize: { xs: '12px', md: '14px' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: !connected ? theme.palette.accent.main : '#1f1f1f',
              color: '#ffffff',
              padding: { xs: '7px 10px', sm: '10px 16px', md: splitscreen ? '8px 12px' : '10px 16px' },
              borderRadius: '12px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: !connected ? theme.palette.accent.main : '#333333',
                opacity: !connected ? '95%' : '100%'
              },
            }}
          >
            {(() => {
              if (!ready) {
                return 'Loading...';
              }
              if (!connected) {
                return 'Connect Wallet';
              }
              return (
                <Box display="flex" alignItems="center" sx={{ gap: { xs: '5px', sm: '8px' } }}>
                  <Typography variant="body2" sx={{ color: '#ffffff', fontSize: { xs: '7.5px', sm: '10px', md: splitscreen ? '11px' : '12px' } }}>
                    {account.displayBalance ? `${account.displayBalance} ` : ''}
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: '#3C3C3C',
                      padding: '4px 6px',
                      borderRadius: '7px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Box
                      component="img"
                      src={account.ensAvatar || 'https://i.pinimg.com/736x/da/54/e0/da54e029e0aa4f1df03f45e9feedb8b9.jpg'}  //temporary change this later
                      alt="Avatar"
                      sx={{
                        borderRadius: '50%',
                        width: { xs: '20px', sm: '24px' },
                        height: { xs: '20px', sm: '24px' },
                        objectFit: 'cover',
                      }}
                    />
                    <Typography variant="body2" sx={{ color: '#ffffff', paddingX: '3px', fontSize: { xs: '7.5px', sm: '10px', md: splitscreen ? '10px' : '12px', lg: '12px' } }}>
                      {account.displayName}
                    </Typography>
                  </Box>
                </Box>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};

/* THE NAV COMPONENT ITSELF THAT USED THE ABOVE CONNECT BUTTON */
const Nav: React.FC<NavProps> = ({ splitscreen = false }) => {
  return (
    <Box display='flex' justifyContent='space-between' alignItems='center' width='100%' sx={{ padding: '20px', paddingX: { xs: '14px', sm: '20px' }, backgroundColor: '#ffffff', borderBottom: '1px solid #D9D9D9', width: 'fit' }}>

      <Box display='flex' alignItems='center' sx={{paddingX: { xs: '5px', sm: '20px' }}}>
        <img src={'/logo.png'} alt="Image" height={25} width={25}/>
        <Link to={"/about"}>
          <Typography fontWeight='bold' sx={{ letterSpacing: -0.5, paddingX: { xs: '5px', sm: '10px' }, fontSize: { xs: '12px', md: '14px' } }}>PROOF OF TWITTER</Typography>
        </Link>
      </Box>


      <Box display='flex' justifyContent='flex-end' alignItems='center' sx={{ gap: { xxs: '0px', xs: '5px', sm: splitscreen ? '50px' : '50px' }, flexGrow: 1, width: 'fit' }}>
        <Link to="https://docs.zk.email/" target="_blank">
          <Typography sx={{ display: { xs: splitscreen ? 'none' : 'none', sm: 'block', md: splitscreen ? 'none' : 'block', lg: 'block' }, fontSize: { xs: '12px', md: '14px' } }}>Docs</Typography>
        </Link>
        <Link to="https://prove.email/blog/twitter" target="_blank">
          <Typography sx={{ display: { xs: splitscreen ? 'none' : 'none', sm: 'block', md: splitscreen ? 'none' : 'block', lg: 'block' }, fontSize: { xs: '12px', md: '14px' } }}>Explore</Typography>
        </Link>
        <CustomConnectButton splitscreen={splitscreen} />
      </Box>

    </Box>
  );
};

Nav.propTypes = {
  splitscreen: PropTypes.bool,
};

Nav.defaultProps = {
  splitscreen: false,
};

CustomConnectButton.propTypes = {
  splitscreen: PropTypes.bool,
};

CustomConnectButton.defaultProps = {
  splitscreen: false,
};

export default Nav;

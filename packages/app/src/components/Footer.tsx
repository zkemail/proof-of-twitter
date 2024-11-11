'use client';
import { useState } from 'react';
import { Box, Typography, Link } from "@mui/material";

type ImgNames = 'XLogo' | 'YoutubeLogo' | 'TelegramLogo' | 'GithubLogo';

const Footer = () => {
  const [hoveredImgs, setHoveredImgs] = useState<Record<ImgNames, boolean>>({
    XLogo: false,
    YoutubeLogo: false,
    TelegramLogo: false,
    GithubLogo: false,
  });

  const handleMouseEnter = (img: ImgNames) => {
    setHoveredImgs((prev) => ({ ...prev, [img]: true }));
  };

  const handleMouseLeave = (img: ImgNames) => {
    setHoveredImgs((prev) => ({ ...prev, [img]: false }));
  };

  return (
    <Box 
      component="footer" 
      width="100%" 
      borderTop="1px solid" 
      borderColor="grey.100" 
      py={2} 
      bgcolor="white"

    >
      <Box 
        maxWidth="lg" 
        mx="auto" 
        px={{xs:1, md:2}} 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
      >
        {/* Left Side - Links */}
        <Box display="flex" alignItems="center" gap={{xs:1, sm:2}}>
          <Typography>
          <Link 
            href="https://docs.prove.email/introduction" 
            target="_blank" 
            color="grey.900" 
            underline="hover"
          >
            Documentation
          </Link>
          </Typography>
          <Typography color="grey.500">•</Typography>
          <Typography>
          <Link 
            href="/privacy" 
            color="grey.900" 
            underline="hover"
            noWrap={true}
          >
            Privacy Policy
          </Link>
          </Typography>
        </Box>

        {/* Right Side - Social Icons */}
        <Box display="flex" alignItems="center" gap={2}>
          {[
            { name: 'XLogo', link: 'https://x.com/zkemail?lang=en', alt: 'twitter-logo', imgSrc: '/assets/XLogo.svg', hoveredImgSrc: '/assets/XLogoFilled.svg' },
            { name: 'YoutubeLogo', link: 'https://www.youtube.com/@sigsing', alt: 'youtube-logo', imgSrc: '/assets/YoutubeLogo.svg', hoveredImgSrc: '/assets/YoutubeLogoFilled.svg' },
            { name: 'TelegramLogo', link: 'https://t.me/zkemail', alt: 'telegram-logo', imgSrc: '/assets/TelegramLogo.svg', hoveredImgSrc: '/assets/TelegramLogoFilled.svg' },
            { name: 'GithubLogo', link: 'https://github.com/zkemail', alt: 'github-logo', imgSrc: '/assets/GithubLogo.svg', hoveredImgSrc: '/assets/GithubLogoFilled.svg' }
          ].map((icon) => (
            <Link 
              key={icon.name} 
              href={icon.link} 
              target="_blank"
            >
              <Box
                component="img"
                onMouseEnter={() => handleMouseEnter(icon.name as ImgNames)}
                onMouseLeave={() => handleMouseLeave(icon.name as ImgNames)}
                src={hoveredImgs[icon.name as ImgNames] ? icon.hoveredImgSrc : icon.imgSrc}
                alt={icon.alt}
                sx={{
                  height: {
                    xs: 15,  
                    sm: 17, 
                    md: 20,  
                    lg: 25, 
                    xl: 30,  
                  }
                }}
              />
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
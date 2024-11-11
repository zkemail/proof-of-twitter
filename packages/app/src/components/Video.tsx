/* LOCAL VIDEO VERSION BELOW */
import { Box } from '@mui/material';
import React, { memo } from 'react';

const Video = memo(() => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <video style={{ width: '100%', height: '100%' }} controls>
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
});

export default Video;

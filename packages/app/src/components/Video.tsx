/* LOCAL VIDEO VERSION BELOW */
import React from 'react';
import { Box } from '@mui/material';

const Video: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <video style={{ width: '100%', height: '100%' }} controls>
        <source src="path_to_your_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
}

export default Video;





/* YOUTUBE VIDEO VERSION BELOW */





// import React from 'react';
// import { Box } from '@mui/material';

// const Video: React.FC = () => {
//   return (
//     <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
//       <iframe
//         src="https://www.youtube.com/embed/GEWuGtsjATw"
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           border: 0,
//         }}
//         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         allowFullScreen
//         title="YouTube Video"
//       ></iframe>
//     </Box>
//   );
// }

// export default Video;
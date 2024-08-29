// import React from "react";
// import styled from 'styled-components';
// import { useDragAndDrop } from '../hooks/useDragAndDrop';

// const DragAndDropTextBoxWrapper = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	align-items: center;
// 	border: 2px dashed #ccc;
// 	padding: 20px;
// `;

// type Props = {
// 	onFileDrop: (file: File) => void;
// };

// const DragAndDropTextBox: React.FC<Props> = ({onFileDrop}) => {
//     const {
// 		dragging,
// 		handleDragEnter,
// 		handleDragLeave,
// 		handleDragOver,
// 		handleDrop,
// 		handleDragEnd,
// 	} = useDragAndDrop();

// 	return (
// 		<DragAndDropTextBoxWrapper
// 			onDragEnter={handleDragEnter}
// 			onDragLeave={handleDragLeave}
// 			onDragOver={handleDragOver}
// 			onDragEnd={handleDragEnd}
// 			onDrop={(e) => handleDrop(e, onFileDrop)}
// 		>
// 			{dragging ? (
// 				<div>Drop here</div>
// 			) : (
// 				<div>Drop .eml file here</div>
// 			)}
// 		</DragAndDropTextBoxWrapper>
// 	);
// };

// export default DragAndDropTextBox;




import React from "react";
import styled, { css, ThemeProvider } from 'styled-components';
import { useTheme } from "@mui/material/styles";
import { useDragAndDrop } from '../hooks/useDragAndDrop';
import { Typography } from "@mui/material";

const DragAndDropTextBoxWrapper = styled.div<{ highlighted: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	border: 2px dashed #ccc;
	padding: 20px;
	${({ highlighted, theme }) =>
    highlighted
      ? css`
          border-color: ${theme.palette.accent.main};
		  color: ${theme.palette.accent.main}
        `
      : ''}
`;

type Props = {
	onFileDrop: (file: File) => void;
	highlighted?: boolean;
};

const DragAndDropTextBox: React.FC<Props> = ({ onFileDrop, highlighted = false }) => {
	const theme = useTheme();
    const {
		dragging,
		handleDragEnter,
		handleDragLeave,
		handleDragOver,
		handleDrop,
		handleDragEnd,
	} = useDragAndDrop();

	return (
		<ThemeProvider theme={theme}>
			<DragAndDropTextBoxWrapper
				highlighted={highlighted}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onDrop={(e) => handleDrop(e, onFileDrop)}
			>
				{dragging ? (
					<div> Drop here</div>
				) : (
					<div>Drop .eml file here </div>
				)}
			</DragAndDropTextBoxWrapper>
		</ThemeProvider>
	);
};

export default DragAndDropTextBox;


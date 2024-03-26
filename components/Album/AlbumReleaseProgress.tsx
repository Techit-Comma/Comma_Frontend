import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const steps = [
    '음원 업로드',
    '앨범 표지 업로드'
];

const theme = createTheme({
    palette: {
        text: {
            primary: '#ffffff',
        },
    },
});

export default function HorizontalLinearAlternativeLabelStepper({ activeStep }) {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }} className="m-3">
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </ThemeProvider>
    );
}
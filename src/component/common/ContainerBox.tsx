import Box from '@mui/material/Box';

interface ContainerBoxProps{
    children: React.ReactNode;
}

export default function ContainerBox({children} : ContainerBoxProps) {
  return (
    <Box component="section" sx={{ p: 5, backgroundColor : "#F9F9F9", borderRadius: "16px" }}>
      {children}
    </Box>
  );
}
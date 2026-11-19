import Box from '@mui/material/Box';

interface ContainerBoxProps{
    children: React.ReactNode;
}

export default function ContainerBox({children} : ContainerBoxProps) {
  return (
    <Box
      component="section"
      className="sv-panel"
      sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#fffdf8" }}
    >
      {children}
    </Box>
  );
}

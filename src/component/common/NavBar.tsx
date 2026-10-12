"use client"

import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import CollectionsIcon from '@mui/icons-material/Collections';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch } from '@/redux/store';
import { signout } from '@/redux/slice/authSlice';

export default function NavBar() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(!isMobile);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: "Menu Management", icon: <MenuBookIcon />, path: "/" },
    { text: "Vacancies", icon: <FaceRetouchingNaturalIcon />, path: "/vacancies" },
    { text: "News", icon: <NewspaperIcon />, path: "/news" },
    { text: "Gallery", icon: <CollectionsIcon />, path: "/gallery" },
    { text: "Promotions", icon: <LocalOfferIcon />, path: "/promotions" },
    { text: "Website Settings", icon: <SettingsIcon />, path: "/site-settings" },
  ];

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const handleSignOut = () => {
    dispatch(signout());
    router.push("/login");
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <div>
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
          sx={{ 
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: theme.zIndex.drawer + 1,
            color: '#6b1d2a',
            backgroundColor: '#fffdf8',
            boxShadow: '0 4px 12px rgba(74, 18, 32, 0.12)',
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <Drawer 
        variant={isMobile ? 'temporary' : 'permanent'}
        open={open}
        onClose={toggleDrawer}
        hideBackdrop={!isMobile}
        sx={{
          width: { xs: 280, sm: 300 },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: 280, sm: 300 },
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #fffdf8 0%, #f8ede3 100%)',
            borderRight: '1px solid rgba(201, 162, 39, 0.35)',
            color: '#4a1220',
          },
          '& .MuiListItemButton-root': {
            mx: 1.5,
            my: 0.5,
            borderRadius: '12px',
            fontWeight: 500,
            '&:hover': { backgroundColor: '#fff1d6' },
            '&.Mui-selected': {
              background: 'linear-gradient(135deg, #e85d04, #c2410c)',
              color: '#fff8f0',
              boxShadow: '0 6px 14px rgba(194, 65, 12, 0.28)',
              '& .MuiListItemIcon-root': { color: '#fff8f0' },
            },
          },
          '& .MuiListItemIcon-root': { color: '#6b1d2a', minWidth: 40 },
          '& .MuiDivider-root': { borderColor: 'rgba(201, 162, 39, 0.35)', my: 1 },
        }}
      >
        {/* {DrawerList} */}
        <List>
            <ListItem style={{marginTop:20, marginBottom:20}}>
                <Image 
                    src="/images/logos/logo.png"
                    alt='logo'
                    width={300}
                    height={100}
                />
            </ListItem>

            <Divider />

            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  selected={pathname === item.path}
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}

            <Divider />

            <ListItem disablePadding>
              <ListItemButton onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </ListItem>
             
        </List>
      </Drawer>
    </div>
  );
}

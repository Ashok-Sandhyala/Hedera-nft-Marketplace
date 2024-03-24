import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import HBARLogo from '../assets/hbar-logo.svg';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { useEffect } from 'react';
import { useState } from 'react';
const pages = ['Collection', 'NFT', 'Dashboard'];
const settings = ['Mail : ' + sessionStorage.email, 'Account ID : ' + sessionStorage.accid, 'Profile', 'Logout'];

const ResponsiveAppBar = () => {
  const navigate = useNavigate();
  const { accountId, walletInterface } = useWalletInterface();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = useState(false);

  const userInitial = sessionStorage.email ? sessionStorage.email.charAt(0).toUpperCase() : '';

  

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDashboardClick = (index) => {
    switch (index) {
      case 0:
        navigate('/createcollection');
        break;
      case 1:
        navigate('/createnft');
        break;
      case 2:
        navigate('/main');
        break;
      default:
        break;
    }
    handleCloseNavMenu();
  };

  console.log("wid:"+sessionStorage.accid);
  const handleProfileClick = () => {
    navigate('/main');
    handleCloseUserMenu();
  };

  const handleAccountIDClick = () => {
    const url = `https://hashscan.io/testnet/account/${sessionStorage.accid}?app=false&p2=1&ph=1&pt=1`;
        window.location.href = url;
    handleCloseUserMenu();
  };

  const handleMailClick = () => {
    handleCloseUserMenu();
  };

  const handleLogoutClick = () => {
    if (accountId) {
      walletInterface.disconnect();
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('gmail');
      sessionStorage.removeItem('accid');
      sessionStorage.removeItem('Hederaid');
      navigate('/home');
    }
    
    handleCloseUserMenu();
  };

  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
      sessionStorage.mail = '';
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <img src={HBARLogo} alt="An upper case H with a line through the top" className="hbarLogoImg" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 5,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 500,
              fontSize: 25,
              letterSpacing: '.1 rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HEDERA
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem key={index} onClick={() => handleDashboardClick(index)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            HEDERA
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                onClick={() => handleDashboardClick(index)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {sessionStorage.email && sessionStorage.accid ? (
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  { userInitial ? (
                    <Avatar>{userInitial}</Avatar>
                  ) : (
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                  )}
                </IconButton>
              </Tooltip>
            ) : (
              <Button color="inherit" variant="contained" onClick={handleConnect}>
                Login
              </Button>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    if (index === 0) {
                      handleMailClick();
                    } else if (index === 1) {
                      handleAccountIDClick();
                    } else if (index === 2) {
                      handleProfileClick();
                    } else if (index === 3) {
                      handleLogoutClick();
                    } else {
                      handleCloseUserMenu();
                    }
                  }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;

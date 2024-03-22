import React, { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Button, Toolbar, Typography } from '@mui/material';
import HBARLogo from '../assets/hbar-logo.svg';
import { useWalletInterface } from '../services/wallets/useWalletInterface';
import { WalletSelectionDialog } from './WalletSelectionDialog';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const { accountId, walletInterface } = useWalletInterface();
  const nav = useNavigate()
  sessionStorage.accid = accountId ;
  const handleConnect = async () => {
    if (accountId) {
      walletInterface.disconnect();
      sessionStorage.mail= '';
    } else {
      nav('/login');
    }
  };

  useEffect(() => {
    if (accountId) {
      setOpen(false);
    }
  }, [accountId])

  return (
    <AppBar position='relative'>
      <Toolbar>
        <img src={HBARLogo} alt='An upper case H with a line through the top' className='hbarLogoImg' />
        <Typography variant="h6" color="white" pl={1} noWrap>
          HEDERA
        </Typography>
        {accountId ? (
        <Link to={'/main'}>
          <Button
            variant='contained'
            sx={{
              ml: '80%', 
              height : '30px' ,
              width : '90px' ,
              fontSize : '10px' ,
              '@media (min-width: 600px)': {
                ml: '150%', 
                height : '40px' ,
                width : '120px' ,
                fontSize : '12px' ,
              },
              '@media (min-width: 960px)': {
                ml: '340%',
                height : '45px' ,
                width : '260px' ,
                fontSize : '16px' ,
              },
            }}
          >
            Connected: {accountId}
          </Button>
        </Link>
      ) : (
        <b />
      )}
        <Button variant='contained' sx={{ ml: 'auto' }} onClick={handleConnect}>
          {accountId ? 'LOGOUT' : 'LOGIN'}
        </Button>
      </Toolbar>
      <WalletSelectionDialog open={open} onClose={() => setOpen(false)} />
    </AppBar>
  );
}

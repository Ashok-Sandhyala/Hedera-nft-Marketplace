import CssBaseline from '@mui/material/CssBaseline';
import { Box, ThemeProvider } from '@mui/material';
import { AllWalletsProvider } from './services/wallets/AllWalletsProvider';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Main from "./pages/main";
import Collection from "./pages/createcollection";
import Nft from "./pages/createnft";
import Nftdetails from './pages/nftdetails';
import FileUploadForm from './pages/mintnft';
import Viewnft from "./pages/viewnft";
import NavBar from "./components/Navbar";
import { theme } from './theme';
import "./App.css";
import Register from './pages/register';
import Login from './pages/login';
import ResponsiveAppBar from './pages/bar';
import ForgetPassword from './pages/forgetpassword';

function App() {
  return (
    <>
     <ThemeProvider theme={theme}>
    <AllWalletsProvider>
    <CssBaseline />
      <Box>
       <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/navbar" element={<NavBar/>} />
        <Route path="/main" element={<Main/>} />
        <Route path='/createcollection' element={<Collection/>}></Route>
        <Route path='/createnft/:aid/:colname/:coldes' element={<Nft/>}></Route>
        <Route path='/createnft' element={<Nft/>}></Route>
        <Route path='/viewnft/:aid/:colname' element={<Viewnft/>}></Route>
        <Route path='/nftdetails/:aid/:colname/:nft_Ref' element={<Nftdetails/>}></Route>
        <Route path='/deletenft/:nft_ref' ></Route>
        <Route path='/register' element={<Register/>} ></Route>
        <Route path='/login' element={<Login/>} ></Route>
        {/* <Route path='/mint' element={<FileUploadForm/>} ></Route> */}
        <Route path='/forgetpassword' element={<ForgetPassword/>}></Route>
        <Route path='/bar' element={<ResponsiveAppBar/>} ></Route>
      </Routes>  
      </Box>
      </AllWalletsProvider>
      </ThemeProvider>
      </>
  );
}

export default App;
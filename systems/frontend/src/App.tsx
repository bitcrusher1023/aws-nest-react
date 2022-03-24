import CssBaseline from '@mui/material/CssBaseline';

import GameLibraryPage from './GameLibraryPage/GameLibrary.page';
import GlobalContextProvider from './GlobalContext.provider';
import Layout from './Layout/Layout';

function App() {
  return (
    <>
      <CssBaseline />
      <GlobalContextProvider>
        <Layout>
          <GameLibraryPage />
        </Layout>
      </GlobalContextProvider>
    </>
  );
}

export default App;

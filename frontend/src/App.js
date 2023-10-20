import logo from './logo.svg';
// import client from "./server/apollo_config";
// import { ApolloProvider} from '@apollo/client';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import './App.css';

import {
  ConfigProvider,
  theme,
} from 'antd';
import { LOGIN } from "./server/constant";
// import SideBar from "./components/common/sidebar/SideBar";
import LoginPage from "./pages/login/Login";

import { useAuth } from './hooks/useAuth';
import enUSIntl from 'antd/lib/locale/en_US';

import PrivateRoute from './utils/PrivateRoute';
import PublicRoute from './utils/PublicRoute';
import { Routes, Route } from 'react-router-dom';
import RouteList from './routes/RouteLists';
import { PATHS } from './constants/routes';

if (process.env.NODE_ENV !== "production") {  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const login = localStorage.getItem(LOGIN);


// const AppLayout = ({ children }) => (
//   <Layout
//     style={{
//       height: "auto",
//     }}
//   >
//     {login === "true" ? <SideBar /> : <LoginPage />}
//   </Layout>
// );

function App({ children }) {
  const { darkMode, themeColor } = useAuth();

  return (
      <ConfigProvider
        locale={enUSIntl}
        theme={{
          algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: themeColor,
          },
        }}
      >
        <Routes className="App">
          {/** Protected Routes */}
          {/** Wrap all Route under ProtectedRoutes element */}
          <Route path="/" element={<PrivateRoute />}>
            {RouteList()}
          </Route>

          {/** Public Routes */}
          {/** Wrap all Route under PublicRoutes element */}
          <Route path="login" element={<PublicRoute />}>
            <Route path={PATHS.login} element={<LoginPage />} />
          </Route>
        </Routes>
      </ConfigProvider>
  );
}

export default App;

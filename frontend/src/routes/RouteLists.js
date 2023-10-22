import React, { useState, useEffect } from 'react';
import { Route, Navigate, NavLink, Outlet } from 'react-router-dom';

import { Layout, Menu, Row } from 'antd';
import {
  LogoutOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  TagOutlined,
  BellOutlined,
  ControlOutlined,
  PlayCircleOutlined,
  StarOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

import logo from '../logo.svg';
import { useAuth } from 'hooks/useAuth';

import UserListPage from "pages/user-management/list/User-List.index";
import UserProfilePage from "pages/user-management/list/[id]/User-Profile.index";
import UserEditPage from "pages/user-management/list/[id]/edit/User-Edit.index";

import EventListPage from "pages/events/Event-List.index";
import EventShopModePage from "pages/events/Event-Shop-Mode.index";
import EventCreatePage from "pages/events/create/Event-Create.index";
import EventEditPage from "pages/events/[id]/edit/Event-Edit.index";

import StageEffectPage from "pages/stage-effect/Stage-Effect.index";

import LeaderboardListPage from "pages/leaderboard/Leaderboard-List.index";
import GameHistoryListPage from "pages/game-history/Game-History-List.index";

import DashboardPage from "pages/DashboardPage";
import ShopsListPage from "pages/shops/list/Shops-List";
import ShopsDetailPage from "pages/shops/list/[merchantID]/Shops-Detail.index";
import ShopsEditPage from "pages/shops/list/[merchantID]/edit/Shops-Edit";
import ShopsCreatePage from "pages/shops/list/create/Shops-Create.index";

import NotFoundPage from './404';

import { useQuery } from "@apollo/client";
import { portalListShop } from "server/query";

const { Content, Sider } = Layout;

export default function RouteList() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const [excludeHQList, setExcludeHQList] = useState([]);
  
  const { loading, error, data, refetch } = useQuery(portalListShop);

  useEffect(() => {
    if (error) {
      // Handle the error, e.g., display an error message
      console.error("Error loading data:", error);
      return;
    }

    console.log("routelist")
    if (loading === false & data) {
      console.log("okkk")
      const filterHQShop = data.portalListShop.filter((e) => {
        return (
          e._id.toString() !== "628d1fc1b0dcf55520c00304" &&
          e._id.toString() !== "628d20b0b0dcf55520c00306"
        );
      });
      setExcludeHQList(filterHQShop);
    }
  }, [loading, data, error]);


  useEffect(() => {
    setSidebarWidth(collapsed ? 80 : 250);
  }, [collapsed]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    logout();
  };

  // TODO maybe can use usememo to set the document title
  if (user) {
    switch (user.role.type) {
      case 'admin':
        document.title = 'Dashboard';
        break;
      default:
        document.title = 'Dashboard';
    }
  } else {
    document.title = 'Dashboard';
  }

  const commonRoutes = () => (
    <>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route key="/index" path="/dashboard" element={<DashboardPage />} />
      <Route key="/dashboard" path="/dashboard" element={<DashboardPage />} />
      <Route path="/not-found" element={NotFoundPage()} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </>
  );
  // TODO need to find a way to generate route depend on menuItem object
  const handleAdminRoutes = (role) => (
    <Route path="/" element={<AppLayout />}>
        {commonRoutes()}
        <Route key="/users/list" path="/users/list" element={<UserListPage/>}/>
        <Route key="/users/list/:id" path="/users/list/:id" element={<UserProfilePage/>}/>
        <Route key="/users/list/:id/edit" path="/users/list/:id/edit" element={<UserEditPage/>}/>
        <Route key="/event/:shopId/:shopName/list" path="/event/:shopId/:shopName/list" element={<EventListPage/>}/>
        <Route key="/event/:shopId/:shopName/shopmode" path="/event/:shopId/:shopName/shopmode" element={<EventShopModePage/>}/>
        <Route key="/event/:shopId/:shopName/create" path="/event/:shopId/:shopName/create" element={<EventCreatePage/>}/>
        <Route key="/event/:shopId/:shopName/:eventId/edit" path="/event/:shopId/:shopName/:eventId/edit" element={<EventEditPage/>}/>
        <Route key="/stage-effect/:shopId/:shopName/list" path="/stage-effect/:shopId/:shopName/list" element={<StageEffectPage/>}/>
        <Route key="/shops/list" path="/shops/list" element={<ShopsListPage/>}/>
        <Route key="/shops/create" path="/shops/create" element={<ShopsCreatePage/>}/>
        <Route key="/shops/list/:shopID/:shopName/edit" path="/shops/list/:shopID/:shopName/edit" element={<ShopsEditPage/>}/>
        <Route key="/shops/list/:shopID/:shopName/userAttend" path="/shops/list/:shopID/:shopName/userAttend" element={<ShopsDetailPage/>}/>
        <Route key="/leaderboard/:shopId/:shopName" path="/leaderboard/:shopId/:shopName" element={<LeaderboardListPage/>}/>
        <Route key="/gameHistory/:shopId/:shopName" path="/gameHistory/:shopId/:shopName" element={<GameHistoryListPage/>}/>
        {/* <Route key="/testUpload" path="/testUpload" element={TestUploadPage}/> */}
    </Route>
  );

  const handleNoRole = () => (
    <Route path="/" element={<AppLayout />}>
      <Route path="/" element={<Navigate to="/not-found" />} />
      <Route path="/not-found" element={NotFoundPage()} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Route>
  );
  
  const defaultAll = [
    {
      key: '/logout',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]
    
  const menuItem = {
    admin: [
      {
        key: '/',
        label: (
          <NavLink to="/">
            Dashboard
          </NavLink>
        ),
        icon: <AppstoreOutlined />,
      },
      {
        key: '/users/list',
        label: (
          <NavLink to="/users/list">
            User Management
          </NavLink>
        ),
        icon: <TeamOutlined />,
      },
      {
        key: '/shops/list',
        label: (
          <NavLink to="/shops/list">
            Shop Management
          </NavLink>
        ),
        icon: <ShopOutlined />,
      },
      {
        label: 'Event',
        key: 'events',
        icon: <BellOutlined />,
        children: excludeHQList.length > 0
          ? excludeHQList.map((shop, i) => ({
              key: `/event${i}`,
              label: (
                <NavLink to={`/event/${shop._id}/${shop.name}/list`}>
                  {shop?.name}
                </NavLink>
              )
            })
          )
          : []
      },
      {
        label: 'Shop Mode',
        key: 'shopmode',
        icon: <ControlOutlined />,
        children: excludeHQList.length > 0
          ? excludeHQList.map((shop, i) => ({
              key: `/shopmode${i}`,
              label: (
                <NavLink to={`/event/${shop._id}/${shop.name}/shopmode`}>
                  {shop?.name}
                </NavLink>
              )
            })
          )
          : []
      },
      {
        label: 'Stage Effect',
        key: 'stageeffect',
        icon: <PlayCircleOutlined />,
        children: excludeHQList.length > 0
          ? excludeHQList.map((shop, i) => ({
              key: `/stage-effect${i}`,
              label: (
                <NavLink to={`/stage-effect/${shop._id}/${shop.name}/list`}>
                  {shop?.name}
                </NavLink>
              )
            })
          )
          : []
      },
      {
        label: 'Leaderboard',
        key: 'leaderboard',
        icon: <StarOutlined />,
        children: excludeHQList.length > 0
          ? excludeHQList.map((shop, i) => ({
              key: `/leaderboard${i}`,
              label: (
                <NavLink to={`/leaderboard/${shop._id}/${shop.name}`}>
                  {shop?.name}
                </NavLink>
              )
            })
          )
          : []
      },
      {
        label: 'Game History',
        key: 'gamehistory',
        icon: <TrophyOutlined />,
        children: excludeHQList.length > 0
          ? excludeHQList.map((shop, i) => ({
              key: `/gamehistory${i}`,
              label: (
                <NavLink to={`/gamehistory/${shop._id}/${shop.name}`}>
                  {shop?.name}
                </NavLink>
              )
            })
          )
          : []
      },
      ...defaultAll
    ],
  };

  const renderRoleMenuNew = () => {
      switch (user.role.type || null) {
        case 'admin': case 'merchant':
          return menuItem['admin'];
        default:
          return defaultAll;
      }
  }

  function AppLayout() {
    return (
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider
            width={sidebarWidth}
            collapsible
            collapsed={collapsed}
            onCollapse={handleCollapse}
            style={{ height: '100vh' }}
          >
            <Row align={"middle"}>
              <img className="logo" src={logo} alt="logo" style={{ width: sidebarWidth }} />
            </Row>
            <Menu
              mode="inline"
              items={renderRoleMenuNew()}
            />
          </Sider>
          <Layout>
            <Content className="content-layout">
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }

  const handleRolesRoutes = (roles) => {
    console.log("roles : ", roles)
    switch (roles) {
      case 'merchant':
      case 'admin':
        return handleAdminRoutes(roles);
      default:
        return handleNoRole();
    }
  };

  return handleRolesRoutes(user ? user.role.type : null);
}

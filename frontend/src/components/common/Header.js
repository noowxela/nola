import React from "react";
import { Row, Space, Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useAuth } from 'hooks/useAuth';

const HeaderRow = () => {
  const { logout } = useAuth();
  function logOutAccount() {
    localStorage.clear();
    logout();
  }

  return (
    <Row
        style={{
        justifyContent: "end",
        padding: "19px 24px",
        margin: "0px 0px 2px 2px",
        background: "white",
        boxShadow: "0px 1px 4px rgba(0, 21, 41, 0.12)",
        }}
    >
        <Space direction="horizontal" size="middle">
        <Button
            type="text"
            icon={<LogoutOutlined />}
            danger
            onClick={logOutAccount}
        >
            Log Out
        </Button>
        </Space>
    </Row>
  );
};

export default HeaderRow;

import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Typography, Form, Input, Button, Image, message } from "antd";
import { TOKEN, LOGIN } from "server/constant";
import { useAuth } from 'hooks/useAuth';

import { useMutation } from '@apollo/client';
import { DASHBOARDLOGINMUTATION } from "server/mutation";

import "./login.css";
// import "../../styles/base.css";

const LoginPage = () => {
  const { login } = useAuth();

  const { Header, Content } = Layout;
  const { Title, Text } = Typography;
  const navigate = useNavigate();

  const [
    DashboardLoginMutation,
    { data: loginData, loading: loginLoading, error: loginError },
  ] = useMutation(DASHBOARDLOGINMUTATION, {
    onCompleted(loginData) {
      console.log("token", loginData);
      localStorage.setItem(TOKEN, loginData.signInAdmin.accessToken);
      localStorage.setItem(LOGIN, "true");
      message.success("Login Successful");
      
      login({
        token: { },
        user: { name:"admin", role:{ type:"admin" } },
        permission: []
      });

      // window.location.reload(true);
    },
    onError(error) {
      console.log(error);
      message.error("Wrong Account or Password");
      
      // login({
      //   token: { },
      //   user: { name:"admin", role:{ type:"admin" } },
      //   permission: []
      // });
    },
  });

  const handleDashboardLogin = async (values) => {
    await DashboardLoginMutation({ variables: values });
  };

  return (
    <Layout>
      <Header className="header">
        {/* <Image width={64} src="/logo.svg" preview={false} /> */}
        <Text className="header-title">NOLA</Text>
      </Header>
      <Content>
        <div className="login-container">
          <Title level={2}>Login</Title>
          <Form
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              username: "",
              password: "",
            }}
            onFinish={(values) => {
              handleDashboardLogin(values);
            }}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your user id!",
                },
              ]}
            >
              <Input type="username" placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" className="login-button" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>
    </Layout>
  );
};

export default LoginPage;

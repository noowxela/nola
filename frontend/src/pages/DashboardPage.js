import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Space,
  Typography,
  Image,
  Button,
  Dropdown,
  Menu,
  Radio,
  message,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { DownOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { useQuery } from "@apollo/client";
import {
  CURRENTUSER,
  GETDASHBOARDSUMMARY,
  portalListShop,
} from "server/query";

import HeaderRow from "components/common/Header";


const { Text } = Typography;

const summaryValueStyle = {
  fontSize: "1.25rem",
  marginLeft: "5px",
};

const DashboardPage = () => {
  const [shopId, setShopId] = useState(null);
  const [surveyType, setSurveyType] = useState("food");
  const [dashboardShopList, setDashboardShopList] = useState([]);
  const [selectedShopDropdown, setSelectedShopDropdown] =
    useState("Select Shop");
  const [upcomingEventsData, setUpcomingEventsData] = useState([]);

  const {
    loading: currentUserLoading,
    error: currentUserError,
    data: currentUserData,
    refetch: currentUserRefetch,
  } = useQuery(CURRENTUSER);

  const {
    loading: summaryLoading,
    error: summaryError,
    data: summaryData,
    refetch: summaryRefetch,
  } = useQuery(GETDASHBOARDSUMMARY, {
    variables: { shopId: shopId },
  });

  const {
    loading: shopLoading,
    error: shopError,
    data: shopData,
    refetch: shopRefetch,
  } = useQuery(portalListShop);

  useEffect(() => {
    if (currentUserLoading === false) {
      console.log(currentUserData.user.role);
    }
  }, [currentUserLoading, currentUserData]);

  useEffect(() => {
    if (summaryLoading === false) {
      console.log(summaryData.getDashboardSummary);
    }
  }, [summaryLoading, summaryData]);

  useEffect(() => {
    if (shopLoading === false) {
      const filterHQShop = shopData.portalListShop.filter((e) => {
        return (
          e._id.toString() !== "xxxx" &&
          e._id.toString() !== "uyyyy"
        );
      });
      setDashboardShopList(filterHQShop);
    }
  }, [shopLoading, shopData]);

  const handleSelectShop = (shop) => {
    if (!shop) {
      setSelectedShopDropdown("All");
      setShopId(null);
    } else {
      setSelectedShopDropdown(shop.name);
      setShopId(shop._id);
    }
  };

  const onSelectSurveyType = (e) => {
    setSurveyType(e.target.value);
  };

  const menu = (
    <Menu>
      <Menu.Item key="All" onClick={() => handleSelectShop(null)}>
        All
      </Menu.Item>
      {dashboardShopList.length > 0
        ? dashboardShopList.map((shop, i) => (
            <Menu.Item
              key={`${shop._id}`}
              onClick={() => handleSelectShop(shop)}
            >
              {shop?.name}
            </Menu.Item>
          ))
        : null}
    </Menu>
  );

  return (
    <>
      <HeaderRow/>
      {currentUserData?.user.role === "admin" ? (
        <PageHeader
          title="Dashboard"
          style={{
            justifyContent: "end",
            padding: "15px 24px",
            background: "white",
            margin: "0px 0px 0px 2px",
            boxShadow: "0px 1px 4px rgba(0, 21, 41, 0.12)",
          }}
          extra={[
            <Dropdown overlay={menu}>
              <Button>
                <Space>
                  {selectedShopDropdown}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>,
          ]}
        />
      ) : (
        <PageHeader
          title="Dashboard"
          style={{
            justifyContent: "end",
            padding: "15px 24px",
            background: "white",
            margin: "0px 0px 0px 2px",
            boxShadow: "0px 1px 4px rgba(0, 21, 41, 0.12)",
          }}
        />
      )}

      <Row
        type="flex"
        // justify="space-around"
        align="top"
        gutter={8}
        style={{
          padding: "0 12px 12px 12px",
          margin: "25px 8px 0 8px",
        }}
      >
        <Col
          span={12}
          style={{
            // height: '100%',
            display: "inline-flex",
            flexDirection: "column",
            alignSelf: "stretch",
          }}
        >
          <Card style={{ width: "100%" }}>
            <div style={{ marginBottom: "20px" }}>
              <Text>Section 1</Text>
            </div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <Text type="secondary">Today's Guest</Text>
                <br />
                {/* <DollarOutlined /> */}
                <Text strong style={summaryValueStyle}>
                  {summaryData?.todayGuest|| 0}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Total Guest</Text>
                <br />
                {/* <DollarOutlined /> */}
                <Text strong style={summaryValueStyle}>
                  {summaryData?.totalGuest || 0}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Today's Customers</Text>
                <br />
                <Text strong style={summaryValueStyle}>
                  {summaryData?.todayCustomer || 0}
                </Text>
              </Col>
              <Col span={12}>
                <Text type="secondary">Total Customers</Text>
                <br />
                <Text strong style={summaryValueStyle}>
                  {summaryData?.totalCustomer || 0}
                </Text>
              </Col>
            </Row>
          </Card>
          <Card style={{ width: "100%", marginTop: "10px" }}>
            <div style={{ marginBottom: "20px" }}>
              <Text>Section 2</Text>
            </div>
          </Card>
        </Col>
        <Col
          span={12}
          style={{
            // height: '100%',
            display: "inline-flex",
            alignSelf: "stretch",
          }}
        >
          <Card style={{ height: "100%", width: "100%" }}>
            <div style={{ marginBottom: "20px" }}>
              <Text>Section 4</Text>
            </div>
            <Row gutter={[24, 16]}>
              {upcomingEventsData.length > 0 ? (
                upcomingEventsData.map((event) => (
                  <Col span={24}>
                    <Row gutter={24} type="flex" justify="space-between">
                      <Col>
                        <Text strong>{event.event_description}</Text>
                      </Col>
                      <Col>
                        <Space direction="vertical" size={2}>
                          <Text>
                            {dayjs(event.start_time).format("DD/MM/YYYY")},{" "}
                            {dayjs(event.start_time).format("hh:mm a")} -{" "}
                            {dayjs(event.end_time).format("hh:mm a")}
                          </Text>
                          <Text type="secondary">{event.shop.name}</Text>
                        </Space>
                      </Col>
                    </Row>
                  </Col>
                ))
              ) : (
                <Text strong>coming soon</Text>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
      <Row
        type="flex"
        // justify="space-around"
        align="top"
        gutter={8}
        style={{
          padding: "0 12px 12px 12px",
          margin: "0px 8px",
        }}
      >
        <Col
          span={12}
          style={{
            // height: '100%',
            display: "inline-flex",
            flexDirection: "column",
            alignSelf: "stretch",
          }}
        >
          <Card style={{ width: "100%", paddingBottom: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <Text>Section 3</Text>
            </div>
          </Card>
        </Col>
        <Col
          span={12}
          style={{
            // height: '100%',
            display: "inline-flex",
            alignSelf: "stretch",
          }}
        >
          <Card
            title="Section 5"
            extra={
              <Radio.Group
                onChange={onSelectSurveyType}
                defaultValue={surveyType}
              >
                <Radio.Button value="A">A</Radio.Button>
                <Radio.Button value="B">B</Radio.Button>
                <Radio.Button value="C">C</Radio.Button>
                <Radio.Button value="D">D</Radio.Button>
              </Radio.Group>
            }
            style={{ height: "100%", width: "100%" }}
          >
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;

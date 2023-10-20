import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import {
  Col,
  Divider,
  Row,
  Modal,
  Form,
  message,
  Select,
  Button,
  Card,
  Typography,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';

import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  userDetail,
  getShopDetail,
  CREATETRANSACTIONSEARCHUSER,
} from "server/query";
  import { TRIGGERSTAGEEFFECTMUTATION } from "server/mutation";

// import "styles/table.css";
// import "styles/base.css";
// import "styles/leaderboard.css";

const { Title } = Typography;
const { Option } = Select;
const { Meta } = Card;

export default function StageEffectPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[2];
  const shopName = pathArray[3];

  const [mode, setMode] = useState("event");
  const [username, setUsername] = useState("");
  const [type, setType] = useState("");
  const [effectType, setEffectType] = useState("");
  const [userList, setUserList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const {
    loading: shopLoading,
    error: shopError,
    data: shopData,
    refetch: shopRefetch,
  } = useQuery(getShopDetail, {
    variables: { id: shopId },
  });

  const [
    getUserDetail,
    {
      loading: userDetailLoading,
      error: userDetailError,
      data: userDetailData,
    },
  ] = useLazyQuery(userDetail);

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
    refetch: usersRefetch,
  } = useQuery(CREATETRANSACTIONSEARCHUSER, {
    variables: { username: username },
  });

  const [
    TriggerStageEffectMutation,
    {
      data: triggerStageEffectData,
      loading: triggerStageEffectLoading,
      error: triggerStageEffectError,
    },
  ] = useMutation(TRIGGERSTAGEEFFECTMUTATION, {
    onCompleted(data) {
      message.success("Stage Effect Triggered.");
      setIsModalVisible(false);
      console.log(data);
    },
    onError(error) {
      message.error(error);
      console.log(error);
      console.log("Stage Effect Not Triggered.");
    },
  });

  useEffect(() => {
    if (!shopLoading) {
      console.log("complete query shop detail", shopData.shopDetail);
      setMode(shopData.shopDetail.mode);
    }
  }, [shopLoading, shopData]);

  useEffect(() => {
    if (!usersLoading) {
      console.log(usersData);
      const tempList = usersData.listAllUser
        .filter((user) => user.username !== null)
        .map((history) => {
          return {
            id: history._id,
            wallet: history.wallet,
            username: history.username,
          };
        });
      setUserList(tempList);
    }
  }, [usersLoading, usersData, usersError]);

  const selectEffect = (e) => {
    console.log("clicked button", e);
    if (e === "birthday") {
      setType(e);
      setEffectType(e);
    } else if (e === "checkin") {
      setType(e);
      setEffectType("checkin-manual-portal-1");
    } else {
      setType("purchase");
      setEffectType(e);
    }

    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    console.log("handleSubmit");
    console.log("values.customer", values.customer);
    console.log("values", values);
    let vars = {};
    vars.id = shopId;
    vars.userId = values.customer;
    vars.type = type;
    vars.effectType = effectType;
    console.log(vars);
    TriggerStageEffectMutation({
      variables: vars,
    });
  };

  const onChangeUser = (val) => {
    console.log("on change user ", val);
    getUserDetail({ variables: { id: val } });
  };

  const onSearchUser = (val) => {
    console.log("on search user ", val);
  };

  const renderStageEffectCards = () => {
    return (
      <Row
        justify="space-around"
        align="center"
        style={{ width: "100%", minWidth: "1000px", paddingBottom: "24px" }}
      >
        <Col style={{ paddingTop: "2rem" }}>
          <Row
            justify="space-between"
            gutter={16}
            style={{ width: "100%", minWidth: "800px" }}
          >
            <Col span={10}>
              <Card
                style={{
                  width: 300,
                }}
                cover={
                  <img
                    alt="example"
                    src="/dummycard.png"
                    style={{
                      height: "200px",
                    }}
                  />
                }
                actions={[
                  <Button
                    block
                    large
                    onClick={() => {
                      selectEffect("birthday");
                    }}
                  >
                    Trigger
                  </Button>,
                ]}
              >
                <Meta
                  title="Birthday"
                  description="Show birthday effect on stage screen"
                />
              </Card>
            </Col>
            <Col span={10}>
              <Card
                style={{
                  width: 300,
                }}
                cover={
                  <img
                    alt="example"
                    src="/dummycard.png"
                    style={{ height: "200px" }}
                  />
                }
                actions={[
                  <Button
                    block
                    onClick={() => {
                      selectEffect("drink1");
                    }}
                  >
                    Trigger
                  </Button>,
                ]}
              >
                <Meta
                  title="Moet & Chandon"
                  description="Show Moet & Chandon effect on stage screen"
                />
              </Card>
            </Col>
          </Row>
          <Row
            justify="space-between"
            gutter={16}
            style={{ width: "100%", minWidth: "800px", marginTop: "2rem" }}
          >
            <Col span={10}>
              <Card
                style={{
                  width: 300,
                }}
                cover={
                  <img
                    alt="example"
                    src="/dummycard.png"
                    style={{
                      height: "200px",
                    }}
                  />
                }
                actions={[
                  <Button
                    block
                    large
                    onClick={() => {
                      selectEffect("drink2");
                    }}
                  >
                    Trigger
                  </Button>,
                ]}
              >
                <Meta
                  title="Dom Perignon"
                  description="Show Dom Perignon effect on stage screen"
                />
              </Card>
            </Col>
            <Col span={10}>
              <Card
                style={{
                  width: 300,
                }}
                cover={
                  <img
                    alt="example"
                    src="/dummycard.png"
                    style={{ height: "200px" }}
                  />
                }
                actions={[
                  <Button
                    block
                    onClick={() => {
                      selectEffect("checkin");
                    }}
                  >
                    Trigger
                  </Button>,
                ]}
              >
                <Meta
                  title="VIP Effect"
                  description="Show Welcome VIP effect on stage screen"
                />
              </Card>
            </Col>
          </Row>
          <Row
            justify="space-between"
            gutter={16}
            style={{ width: "100%", minWidth: "800px", marginTop: "2rem" }}
          >
            <Col span={10}>
              <Card
                style={{
                  width: 300,
                }}
                cover={
                  <img
                    alt="example"
                    src="/dummycard.png"
                    style={{
                      height: "200px",
                    }}
                  />
                }
                actions={[
                  <Button
                    block
                    large
                    onClick={() => {
                      selectEffect("drink3");
                    }}
                  >
                    Trigger
                  </Button>,
                ]}
              >
                <Meta
                  title="Gold Label"
                  description="Show Gold Label effect on stage screen"
                />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const renderEventNotOngoing = () => {
    if (!shopLoading) {
      return (
        <Row
          justify="space-around"
          align="center"
          style={{ width: "100%", minWidth: "1000px", paddingBottom: "24px" }}
        >
          <Col style={{ paddingTop: "2rem" }}>
            <Title level={2} style={{ textAlign: "center" }}>
              There's no event ongoing
            </Title>
          </Col>
        </Row>
      );
    } else {
      return <>Loading...</>;
    }
  };

  return (
    <>
      <div
        style={{
          padding: "11px 24px",
          background: "white",
          margin: "0px 0px 2px 2px",
          boxShadow: "0px 1px 4px rgba(0, 21, 41, 0.12)",
          overflowY: "hidden",
          overflowX: "hidden",
        }}
      >
        <Row justify="space-between" align="center">
          <Col span={8}>
            <PageHeader
              title={`Stage Effect - ${decodeURI(shopName)}`}
              style={{
                margin: "0",
                padding: "11px 0px",
                height: "50px",
                lineHeight: "50px",
              }}
              onBack={() => {
                navigate(`/event/${shopId}/${shopName}/list`);
              }}
            />
          </Col>
          <Col offset={3} span={3}>
            <Row justify="end"></Row>
          </Col>
        </Row>
      </div>
      <Divider style={{ marginTop: "0", marginBottom: "0" }} />
      <div
        style={{
          padding: "0px 24px",
          background: "white",
          margin: "0px 2px 0px 2px",
          boxShadow: "0px 1px 4px rgba(0, 21, 41, 0.12)",
          minHeight: "50vh",
          height: "auto",
        }}
      >
        {mode === "event" ? renderStageEffectCards() : renderEventNotOngoing()}
      </div>
      <Modal
        // title={"Switch Mode to " + mode + "?"}
        title={"Trigger Stage Effect"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="suspend"
            type="primary"
            onClick={form.submit}
            className="button-modal-alert"
          >
            Confirm
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Select Customer"
            name="customer"
            rules={[
              {
                required: true,
                message: "Please select a customer",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Enter Username"
              optionFilterProp="children"
              size="large"
              onChange={onChangeUser}
              onSearch={onSearchUser}
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                );
              }}
            >
              {!usersLoading &&
                userList.map((user) => {
                  return (
                    <Option key={user.id} value={user.id}>
                      {user.username}
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

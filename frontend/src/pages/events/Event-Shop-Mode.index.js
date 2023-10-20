import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {
  Col,
  Divider,
  Row,
  Modal,
  Tabs,
  Statistic,
  Button,
  Card,
  Typography,
  message,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { useQuery, useMutation } from "@apollo/client";
import { listShopEvents, getShopDetail } from "server/query";
import {
  UpdateShopMode,
  CreateGameSession,
  TriggerShopMode,
} from "server/mutation";
import dayjs from "dayjs";

// import "styles/table.css";
// import "styles/base.css";
// import "styles/leaderboard.css";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { Meta } = Card;

export default function EventShopModePage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[2];
  const shopName = pathArray[3];

  const [mode, setMode] = useState("event");
  const [shopRestImage, setShopRestImage] = useState("");
  const [shop, setShop] = useState({});
  const [currUpcoming, setCurrUpcoming] = useState({
    ongoing_event: "",
    next_event: "",
  });
  const [eventLists, setEventList] = useState([
    {
      id: "",
      eventDescription: "",
      startTime: "",
      endTime: "",
      eventPerformers: "",
      imageUrl: "",
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isForceChangeModalVisible, setIsForceChangeModalVisible] =
    useState(false);
  const {
    loading: eventsLoading,
    error: eventsError,
    data: eventsData,
    refetch: eventsRefetch,
  } = useQuery(listShopEvents, {
    variables: { shopId: shopId },
  });

  const {
    loading: shopLoading,
    error: shopError,
    data: shopData,
    refetch: shopRefetch,
  } = useQuery(getShopDetail, {
    variables: { id: shopId },
  });

  const [
    UpdateShopModeMutation,
    {
      data: updateShopData,
      loading: updateShopLoading,
      error: updateShopError,
    },
  ] = useMutation(UpdateShopMode, {
    onCompleted(data) {
      console.log("complete update shop data", data.updateShop);
      setShop(data.updateShop);
      getLatestEvents(data.updateShop);
      console.log("1");
      console.log("updated shop mode abc", data.updateShop.mode);
      console.log("2");
      if (data.updateShop.mode === "rest") {
        message.success(`Successfully Changed Shop Mode to Rest`);
      }

      if (data.updateShop.mode === "event") {
        message.success(
          `Successfully Changed Shop Mode to - Event - ${data.updateShop.event[0].event_description}`
        );
      }

      if (data.updateShop.mode === "game") {
        if (data.updateShop.game_type === "game1") {
          message.success(
            `Successfully Changed Shop Mode to - Game - 赛马争霸`
          );
        }
        if (data.updateShop.game_type === "game2") {
          message.success(
            `Successfully Changed Shop Mode to - Game - 蟒蛇大作战`
          );
        }
      }

      if (
        data.updateShop.mode === "game" &&
        (data.updateShop.next_event_mode === null ||
          data.updateShop.next_event_mode === "game")
      ) {
        CreateGameSessionMutation({
          variables: { shopId: shopId, gameType: selectedEvent },
        });
      }
    },
    onError(error) {
      message.error(error);
    },
  });

  const [
    TriggerShopModeMutation,
    {
      data: triggerShopData,
      loading: triggerShopLoading,
      error: triggerShopError,
    },
  ] = useMutation(TriggerShopMode, {
    onCompleted(data) {
      console.log("comeplete trigger shop data", data);
      setShop(data.triggerShopMode);
      getLatestEvents(data.triggerShopMode);
      if (data.triggerShopMode.mode === "event") {
        message.success(
          `Successfully Changed Shop Mode to - ${currUpcoming.ongoing_event}`
        );
      }
      if (
        data.triggerShopMode.mode === "game" &&
        (data.triggerShopMode.next_event_mode === null ||
          data.triggerShopMode.next_event_mode === "game")
      ) {
        CreateGameSessionMutation({
          variables: { shopId: shopId, gameType: selectedEvent },
        });
      }
    },
    onError(error) {
      console.log("error", error.message.toString());
      message.error(error.message.toString());
    },
  });

  const [
    CreateGameSessionMutation,
    {
      data: createGameData,
      loading: createGameLoading,
      error: createGameError,
    },
  ] = useMutation(CreateGameSession, {
    onCompleted(data) {
      message.success("Successfully Created New Game Session");
      console.log(data);
      console.log("created game session");
    },
    onError(error) {
      message.error(error);
      console.log(error);
      console.log("game session not created");
    },
  });

  useEffect(() => {
    if (!eventsLoading) {
      const tempList = eventsData.listAllEvents.map((history) => {
        return {
          id: history._id,
          eventDescription: history.event_description,
          startTime: history.start_time,
          endTime: history.end_time,
          eventPerformers: history.eventPerformers,
          imageUrl: history.image_url,
          linkExt: history.image_url.split(".").pop(),
        };
      });
      const firstThree = tempList.slice(0, 3);
      console.log("firstThree", firstThree);
      setEventList(firstThree);
    }
  }, [eventsLoading, eventsError, eventsData]);

  useEffect(() => {
    if (!shopLoading) {
      console.log("complete query shop detail", shopData);
      setShopRestImage(shopData.shopDetail.rest_image_url);
      setShop(shopData.shopDetail);
      let upcoming = {};

      if (!shopData.shopDetail.next_event_mode) {
        upcoming.next_event = "No Next Event Queued";
      }

      if (shopData.shopDetail.mode === "rest") {
        upcoming.ongoing_event = "Rest";
      }

      if (shopData.shopDetail.mode === "event") {
        upcoming.ongoing_event = `Event - ${shopData.shopDetail.event[0].event_description}`;
      }

      if (shopData.shopDetail.mode === "game") {
        if (shopData.shopDetail.game_type === "game1") {
          upcoming.ongoing_event = "Game - 赛马争霸";
        }
        if (shopData.shopDetail.game_type === "game2") {
          upcoming.ongoing_event = "Game - 蟒蛇大作战";
        }
      }

      if (shopData.shopDetail.next_event_mode) {
        if (shopData.shopDetail.next_event_mode === "game") {
          if (shopData.shopDetail.next_event_game_type === "game1") {
            upcoming.next_event = "Game - 赛马争霸";
          }
          if (shopData.shopDetail.next_event_game_type === "game2") {
            upcoming.next_event = "Game - 蟒蛇大作战";
          }
        }
        if (shopData.shopDetail.next_event_mode === "rest") {
          upcoming.next_event = "Rest";
        }
        if (shopData.shopDetail.next_event_mode === "event") {
          console.log(shopData.shopDetail.event[0].event_description);
          upcoming.next_event = `Event - ${shopData.shopDetail.next_event[0].event_description}`;
        }
      }
      console.log("upcoming", upcoming);
      setCurrUpcoming(upcoming);
      console.log("current shop", shop);
      console.log("current and upcoming", currUpcoming);
    }
  }, [shopLoading, eventsError, eventsData]);

  const handleModeChange = (activeKey) => {
    switch (activeKey) {
      case "1":
        setMode("event");
        renderEventPageContent();
        break;
      case "2":
        renderGamePageContent();
        setMode("game");
        break;
      case "3":
        renderRestPageContent();
        setMode("rest");
        break;
      default:
        break;
    }
  };

  const selectEvent = (e) => {
    console.log("clicked button", shop.mode);
    setSelectedEvent(e);
    if (shop.mode !== "game") {
      setIsModalVisible(true);
    } else {
      setIsForceChangeModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleForceChangeModalCancel = () => {
    setIsForceChangeModalVisible(false);
  };

  const handleOk = () => {
    console.log("modal ok button", selectedEvent);
    if (mode === "event") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData.id = shopId;
      updateShopData.gameType = null;
      updateShopData.eventId = selectedEvent.id;
      updateShopData.eventImageUrl = selectedEvent.imageUrl;
      console.log("before mutation", updateShopData);
      TriggerShopModeMutation({ variables: updateShopData });
      setIsModalVisible(false);
      return;
    }
    if (mode === "game") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData.id = shopId;
      updateShopData.gameType = selectedEvent;
      TriggerShopModeMutation({ variables: updateShopData });
      setIsModalVisible(false);
      return;
    }
    if (mode === "rest") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData.id = shopId;
      updateShopData.gameType = null;
      TriggerShopModeMutation({ variables: updateShopData });
      setIsModalVisible(false);
      return;
    }
    setIsModalVisible(false);
  };

  const handleForceChangeModalOk = () => {
    console.log("modal ok button", selectedEvent);
    if (mode === "event") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData._id = shopId;
      updateShopData.eventId = selectedEvent.id;
      updateShopData.eventImageUrl = selectedEvent.imageUrl;
      updateShopData.gameType = null;
      updateShopData.next_event_id = null;
      updateShopData.next_event_mode = null;
      updateShopData.next_event_game_type = null;
      console.log("updateShopData mutation", updateShopData);
      UpdateShopModeMutation({ variables: updateShopData });
      console.log("before mutation", updateShopData);
      setIsForceChangeModalVisible(false);
      return;
    }
    if (mode === "game") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData._id = shopId;
      updateShopData.gameType = selectedEvent;
      updateShopData.next_event_id = null;
      updateShopData.next_event_mode = null;
      updateShopData.next_event_game_type = null;
      console.log("updateShopData mutation", updateShopData);
      UpdateShopModeMutation({ variables: updateShopData });
      // TriggerShopModeMutation({ variables: updateShopData });
      setIsForceChangeModalVisible(false);
      return;
    }
    if (mode === "rest") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData._id = shopId;
      updateShopData.gameType = null;
      updateShopData.next_event_id = null;
      updateShopData.next_event_mode = null;
      updateShopData.next_event_game_type = null;
      console.log("updateShopData mutation", updateShopData);
      UpdateShopModeMutation({ variables: updateShopData });
      // TriggerShopModeMutation({ variables: updateShopData });
      setIsForceChangeModalVisible(false);
      return;
    }
    setIsForceChangeModalVisible(false);
  };

  const handleForceChangeModalAddToQueue = () => {
    console.log("modal ok button", selectedEvent);
    if (mode === "event") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData.id = shopId;
      updateShopData.eventId = selectedEvent.id;
      updateShopData.eventImageUrl = selectedEvent.imageUrl;
      // UpdateShopModeMutation({ variables: updateShopData });
      console.log("before mutation", updateShopData);
      TriggerShopModeMutation({ variables: updateShopData });
      setIsForceChangeModalVisible(false);
      return;
    }
    if (mode === "game") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData.id = shopId;
      updateShopData.gameType = selectedEvent;
      // UpdateShopModeMutation({ variables: updateShopData });
      TriggerShopModeMutation({ variables: updateShopData });
      setIsForceChangeModalVisible(false);
      return;
    }
    if (mode === "rest") {
      const updateShopData = {};
      updateShopData.mode = mode;
      updateShopData.id = shopId;
      // UpdateShopModeMutation({ variables: updateShopData });
      TriggerShopModeMutation({ variables: updateShopData });
      setIsForceChangeModalVisible(false);
      return;
    }
    setIsForceChangeModalVisible(false);
  };

  const getLatestEvents = (updatedShop) => {
    let upcoming = {};

    if (!updatedShop.next_event_mode) {
      upcoming.next_event = "No Next Event Queued";
    }

    if (updatedShop.mode === "rest") {
      upcoming.ongoing_event = "Rest";
    }

    if (updatedShop.mode === "event") {
      upcoming.ongoing_event = `Event - ${updatedShop.event[0].event_description}`;
    }

    if (updatedShop.mode === "game") {
      if (updatedShop.game_type === "game1") {
        upcoming.ongoing_event = "Game - 赛马争霸";
      }
      if (updatedShop.game_type === "game2") {
        upcoming.ongoing_event = "Game - 蟒蛇大作战";
      }
    }

    if (updatedShop.next_event_mode) {
      if (updatedShop.next_event_mode === "game") {
        if (updatedShop.next_event_game_type === "game1") {
          upcoming.next_event = "Game - 赛马争霸";
        }
        if (updatedShop.next_event_game_type === "game2") {
          upcoming.next_event = "Game - 蟒蛇大作战";
        }
      }
      if (updatedShop.next_event_mode === "rest") {
        upcoming.next_event = "Rest";
      }
      if (updatedShop.next_event_mode === "event") {
        console.log(updatedShop.event[0].event_description);
        upcoming.next_event = `Event - ${updatedShop.next_event[0].event_description}`;
      }
    }
    setCurrUpcoming(upcoming);
  };

  const renderCurrentAndUpcomingEvent = () => {
    if (!shopLoading) {
      return (
        <Row
          justify="space-around"
          align="center"
          style={{ width: "100%", minWidth: "1000px", paddingTop: "1rem" }}
        >
          <Col span={6}>
            <Statistic
              title="Current Mode:"
              value={currUpcoming.ongoing_event}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Upcoming Event:"
              value={currUpcoming.next_event}
            />
          </Col>
        </Row>
      );
    } else {
      return <>Loading...</>;
    }
  };

  const renderEventPageContent = () => {
    if (!eventsLoading) {
      return (
        <Row
          justify="space-around"
          align="center"
          style={{ width: "100%", minWidth: "1000px", paddingBottom: "24px" }}
        >
          <Col style={{ paddingTop: "2rem" }}>
            {/* <Title level={2} style={{ textAlign: "center" }}>
              TODAY'S EVENT
            </Title> */}
            <Row
              justify="space-between"
              gutter={16}
              style={{ width: "100%", minWidth: "800px" }}
            >
              {eventLists.map((e) => {
                return (
                  <Col span={8}>
                    <Card
                      style={{ width: 300 }}
                      cover={
                        e.linkExt === "mp4" ||
                        e.linkExt === "m4v" ||
                        e.linkExt === "webm" ||
                        e.linkExt === "mov" ||
                        e.linkExt === "ogg" ? (
                          <video
                            src={e.imageUrl}
                            style={{ height: "200px" }}
                          ></video>
                        ) : (
                          <img
                            alt="example"
                            src={e.imageUrl}
                            style={{ height: "200px" }}
                          />
                        )
                      }
                      actions={[
                        <Button
                          block
                          onClick={() => {
                            selectEvent(e);
                          }}
                        >
                          Start Event
                        </Button>,
                      ]}
                    >
                      <Meta
                        title={e.eventDescription}
                        description={dayjs(e.startTime).format(
                          "DD/MM/YYYY hh:mm a"
                        )}
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      );
    } else {
      return <>Loading...</>;
    }
  };

  const renderGamePageContent = () => {
    return (
      <Row
        justify="space-around"
        align="center"
        style={{ width: "100%", minWidth: "1000px", paddingBottom: "24px" }}
      >
        <Col style={{ paddingTop: "2rem" }}>
          {/* <Title level={2} style={{ textAlign: "center" }}>
            GAME ON
          </Title> */}
          <Row
            justify="space-between"
            gutter={16}
            style={{ width: "100%", minWidth: "800px" }}
          >
            <Col span={10}>
              <Card
                style={{
                  width: 300,
                  backgroundColor: "#FFFBE6",
                  borderColor: "#FAAD14",
                }}
                cover={
                  <img
                    alt="example"
                    src="/horse-game.jpeg"
                    style={{
                      height: "200px",
                    }}
                  />
                }
                actions={[
                  <Button
                    block
                    large
                    style={{
                      color: "white",
                      backgroundColor: "#FFC53D",
                    }}
                    onClick={() => {
                      selectEvent("game1");
                    }}
                  >
                    Start Game
                  </Button>,
                ]}
              >
                <Meta title="赛马争霸" description="Players: 3 - 8" />
              </Card>
            </Col>
            <Col span={10}>
              <Card
                style={{
                  width: 300,
                  backgroundColor: "#F6FFED",
                  borderColor: "#52C41A",
                }}
                cover={
                  <img
                    alt="example"
                    src="/snake-game.jpeg"
                    style={{ height: "200px" }}
                  />
                }
                actions={[
                  <Button
                    block
                    style={{
                      color: "white",
                      backgroundColor: "#73D13D",
                    }}
                    onClick={() => {
                      selectEvent("game2");
                    }}
                  >
                    Start Game
                  </Button>,
                ]}
              >
                <Meta title="蟒蛇大作战" description="Players: 2 - 4" />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const renderRestPageContent = () => {
    return (
      <Row
        justify="space-around"
        align="center"
        style={{ width: "100%", minWidth: "1000px", paddingBottom: "24px" }}
      >
        <Col style={{ paddingTop: "2rem" }}>
          {/* <Title level={2} style={{ textAlign: "center" }}>
            REST MODE
          </Title> */}
          <Row
            justify="space-around"
            align="center"
            style={{ width: "100%", minWidth: "800px" }}
          >
            <Col span={8}>
              <Card
                style={{ width: 300 }}
                cover={
                  <img
                    alt="example"
                    src={shopRestImage}
                    style={{ height: "200px" }}
                  />
                }
                actions={[
                  <Button
                    block
                    onClick={() => {
                      selectEvent("rest");
                    }}
                  >
                    Rest Mode
                  </Button>,
                ]}
              >
                <Meta title="Switch To Rest Mode" />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    );
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
              title={`Events - ${decodeURI(shopName)}`}
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
            {/* <Title
              level={4}
              style={{ marginBottom: "0", height: "50px", lineHeight: "50px" }}
            >
              Events - {decodeURI(shopName)}
            </Title> */}
          </Col>
          <Col span={3} sm={{ span: 6 }} md={{ span: 8 }}>
            <Tabs
              defaultActiveKey="1"
              centered
              onChange={handleModeChange}
              style={{ width: "100%" }}
            >
              <TabPane tab="Event Mode" key="1" />
              {/* TODO: HIDE FOR XYG LIVE */}
              {shopId === "620cdb750d51ac5054f45272" ? (
                <></>
              ) : (
                <TabPane tab="Game Mode" key="2" />
              )}
              {/* <TabPane tab="Game Mode" key="2" /> */}
              <TabPane tab="Rest Mode" key="3" />
            </Tabs>
          </Col>
          <Col offset={3} span={3}>
            <Row justify="end">
              {/* <Tooltip title="Create Event">
                <Button
                  shape="circle"
                  icon={<PlusCircleOutlined />}
                  size="large"
                  onClick={() =>
                    navigate(`/event/${shopId}/${shopName}/create`)
                  }
                  style={{ marginRight: "10%" }}
                />
              </Tooltip> */}
            </Row>
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
        {!shopLoading && renderCurrentAndUpcomingEvent()}
        {mode === "event" && renderEventPageContent()}
        {mode === "game" && renderGamePageContent()}
        {mode === "rest" && renderRestPageContent()}
      </div>
      <Modal
        // title={"Switch Mode to " + mode + "?"}
        title={"Switch Shop Mode"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="suspend"
            type="primary"
            onClick={handleOk}
            className="button-modal-alert"
          >
            Confirm
          </Button>,
        ]}
      >
        {`Switch Mode to ${mode} ?`}
      </Modal>
      {/* Force Change Modal  */}
      <Modal
        // title={"Switch Mode to " + mode + "?"}
        title={"Game is on-going"}
        visible={isForceChangeModalVisible}
        onCancel={handleForceChangeModalCancel}
        footer={[
          <Button key="cancel" onClick={handleForceChangeModalCancel}>
            Cancel
          </Button>,
          <Button
            key="handleForceChangeModalAddToQueue"
            type="primary"
            onClick={handleForceChangeModalAddToQueue}
            className="button-modal-alert"
          >
            Add to Queue
          </Button>,
          <Button
            key="handleForceChangeModalOk"
            type="primary"
            onClick={handleForceChangeModalOk}
            className="button-modal-alert"
          >
            Force Switch
          </Button>,
        ]}
      >
        {`Switch Mode to ${mode} ?`}
      </Modal>
    </>
  );
}

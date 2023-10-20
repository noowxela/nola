import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import {
  Col,
  Divider,
  Image,
  Row,
  Table,
  Tabs,
  Radio,
  Typography,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';

import { useMutation } from "@apollo/client";
import { GetLeaderboardRankings } from "server/mutation";

const { TabPane } = Tabs;
const { Title } = Typography;
export default function UserListPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[2];
  const shopName = pathArray[3];

  const [type, setType] = useState("female");
  const [period, setPeriod] = useState("weekly");
  const [isSearch, setIsSearch] = useState(false);
  const [leaderboardRankings, setLeaderboardRankings] = useState([]);

  const [GetLeaderboardRankingsMutation, { loading, error }] = useMutation(
    GetLeaderboardRankings,
    {
      onCompleted(data) {
        setLeaderboardRankings([]);
        if (data.getLeaderboardRankings.rankingDetail) {
          const rankingDetail = data.getLeaderboardRankings.rankingDetail;
          for (var i = 0; i < rankingDetail.length; i++) {
            rankingDetail[i].ranking = i + 1;
          }
          console.log("ranking detail", rankingDetail);
          setLeaderboardRankings(rankingDetail);
        } else {
          console.log(data.errors);
        }
      },
      onError() {
        setLeaderboardRankings([]);
        console.log(error);
      },
    }
  );

  useEffect(() => {
    if (!shopId || !type || !period) {
      return;
    }

    GetLeaderboardRankingsMutation({
      variables: {
        shopId: shopId,
        type: type,
        period: period,
      },
    });
  }, [shopId, type, period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const handleTypeChange = (activeKey) => {
    // TODO need check the backend logic 
    console.log(activeKey);
    switch (activeKey) {
      case "1":
        setType("fastest");
        break;
      case "2":
        setType("persistent");
        break;
      case "3":
        setType("Unbreakablu");
        break;
      default:
        break;
    }
  };

  const columns = [
    {
      title: "Ranking",
      dataIndex: "ranking",
      key: "ranking",
    },
    // {
    //   title: "User ID",
    //   dataIndex: ["user", "_id"],
    //   key: "id",
    // },
    {
      title: "Name",
      dataIndex: ["user", "username"],
      key: "userName",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => {
        console.log("coins", text);
        return (
          <div style={{ width: "100px" }}>
            <Image
              width={25}
              src="/coin.svg"
              preview={false}
              style={{ paddingBottom: "6px" }}
            />{" "}
            {(Math.round(text * 100) / 100).toFixed(2)}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        style={{
          justifyContent: "end",
          padding: "0px 24px",
          background: "white",
          margin: "0px 0px 0px 2px",
          boxShadow: "0px 1px 4px rgba(0, 21, 41, 0.12)",
        }}
      >
        <Row gutter={24} align="center" style={{ width: "100%" }}>
          <Col span={7} style={{ margin: "10px 0px 10px 0px" }}>
            <Title level={4}>Leaderboard - {decodeURI(shopName)}</Title>
          </Col>
          <Col span={10}>
            <Tabs
              defaultActiveKey="1"
              centered
              onChange={handleTypeChange}
              style={{ width: "80%" }}
            >
              <TabPane tab="Fastest" key="1" />
              <TabPane tab="Persistent" key="2" />
              <TabPane tab="Unbreakable" key="3" />
            </Tabs>
          </Col>
          <Col offset={2} span={5} sm={{ span: 7, offset: 0 }}>
            <Radio.Group
              className="header-btn"
              value={period}
              onChange={handlePeriodChange}
              buttonStyle="solid"
              style={{ marginTop: "10px" }}
            >
              <Radio.Button value="daily">Daily</Radio.Button>
              <Radio.Button value="weekly">Weekly</Radio.Button>
              <Radio.Button value="monthly">Monthly</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>
      </PageHeader>
      <Divider style={{ marginTop: "0", marginBottom: "0" }} />
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={leaderboardRankings}
          pagination={{
            showQuickJumper: true,
          }}
        />
      </div>
    </div>
  );
}

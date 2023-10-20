import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { Table, DatePicker } from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { SearchOutlined } from "@ant-design/icons";


import { useQuery } from "@apollo/client";
import { listAllGameHistory } from "server/query";

// import "styles/table.css";
// import "styles/base.css";
const { RangePicker } = DatePicker;

export default function GameHistoryPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[2];
  const shopName = pathArray[3];

  const [gameHistoryLists, setGameHistoryList] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const { loading, error, data, refetch } = useQuery(listAllGameHistory, {
    variables: { shopId: shopId },
  });

  useEffect(() => {
    if (!loading) {
      const tempList = data.listAllGameHistory.map((history) => {
        return {
          id: history._id,
          key: history._id,
          gameName: history.game_type,
          participants: history.playerId.length,
          winnerId: history.winnerId || "No Winner",
          winnerName: history.winner ? history.winner.username : "No Winner",
          createdAt: history.createdAt,
        };
      });
      setGameHistoryList(tempList);
    }
  }, [loading, error, data]);

  const handleDateChange = (dates, dateStrings) => {
    console.log("dates", dates);
    console.log("date1", dateStrings[0]);
    console.log("date2", dateStrings[1]);
    if (!dates) {
      refetch({
        shopId: shopId,
        startDate: null,
        endDate: null,
      });
    } else {
      refetch({
        shopId: shopId,
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    }
  };

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Game",
      dataIndex: "gameName",
      key: "gameName",
      render: (text, record, index) => {
        if (text === "game1") {
          return <>赛马争霸</>;
        }
        if (text === "game2") {
          return <>蟒蛇大作战</>;
        }
        return <>Unknown Game</>;
      },
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants",
    },
    {
      title: "Winners",
      key: "winnerName",
      dataIndex: "winnerName",
    },
    {
      title: "Game Started At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, record, text) => (
        <p>{new Date(record.createdAt).toLocaleString()}</p>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={"Game History"}
        className="basic-pageheader"
        extra={[
          <RangePicker
            onChange={handleDateChange}
            key="gameHistoryListDatePicker"
          />,
        ]}
      />
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={gameHistoryLists}
          pagination={{
            showQuickJumper: true,
          }}
        />
      </div>
    </div>
  );
}

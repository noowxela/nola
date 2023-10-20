import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLocation } from "react-router-dom";

import {
  Avatar,
  Button,
  Divider,
  Table,
  Modal,
  Spin,
  Tooltip,
  Image,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { EditOutlined, DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
// import { Line } from "@ant-design/plots";

import { useQuery } from "@apollo/client";
import { userDetail, USERTRANSACTIONQUERY } from "server/query";

import StatusComponent from 'components/common/Status';
// import tempData from "pages/user-management/list/[id]/tempData.json";
// import lineTempData from "pages/user-management/list/[id]/lineTempData.json";
// import "styles/table.css";
// import "styles/base.css";
// import "styles/customer.css";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const userID = pathArray[3];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [totalSpending, setTotalSpending] = useState([]);
  const [userData, setUserData] = useState({});
  const [pagination, setPagination] = useState({
    position: ["bottomRight"],
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });

  const lineChartConfig = {
    // data: lineTempData,
    data: totalSpending,
    padding: "auto",
    xField: "period",
    yField: "total_spending",
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
  };

  const {
    loading: transactionLoading,
    error: transactionError,
    data: transactionData,
    refetch: transactionRefetch,
  } = useQuery(USERTRANSACTIONQUERY, {
    variables: { userId: userID },
  });

  useEffect(() => {
    if (transactionLoading === false) {
      console.log("raw data from query", transactionData.listAllTransaction);
      rerenderListView(transactionData.listAllTransaction);
    }
  }, [transactionLoading, transactionData]);

  const { loading, error, data, refetch } = useQuery(userDetail, {
    variables: { id: userID },
  });

  useEffect(() => {
    if (loading === false) {
      console.log("user detail data", data.userDetail);
      console.log("spending per month", data.userDetail.spendingPerMonth);
      setTotalSpending(data.userDetail.spendingPerMonth);
      // reformatTotalSpending(data.userDetail.spendingPerMonth);
      setUserData(data.userDetail);
    }
  }, [loading, data]);

  // if (loading) return "Loading...";
  // if (error) return `Error! ${error.message}`;
  // const userData = data.userDetail;
  // console.log("userData", userData);

  // if (transactionLoading) return "Loading...";
  // if (transactionError) return `Error! ${transactionError.message}`;
  // const userTransactionList = transactionData.listAllTransaction;
  // console.log("userTransactionList", userTransactionList);
  // console.log("tempdata", tempData);

  function rerenderListView(items) {
    var list = [];
    for (var i = 0; i < items.length; i++) {
      if (items[i].customer.username) {
        list.push({
          id: items[i]._id,
          key: items[i]._id,
          invoiceId: items[i].invoiceId,
          customerName: items[i].customer.username || "User Inactivated",
          coin_amount: items[i].coin_amount,
          description: items[i].description,
          status: items[i].status,
          type: items[i].type,
          createdAt: items[i].createdAt,
        });
      }
    }
    setTransactionList(list);
    setPagination({
      ...pagination,
      total: list.length,
    });
  }

  // function reformatTotalSpending(items) {
  //   var list = [];
  //   items.map((e) => {
  //     list.push({
  //       period: e._id.year + "-" + e._id.month,
  //       total: e.total_spending,
  //     });
  //   });
  //   setTotalSpending(list);
  // }

  // const columns = [
  //   {
  //     title: "Invoice ID",
  //     dataIndex: "id",
  //     key: "id",
  //   },
  //   {
  //     title: "Description",
  //     dataIndex: "description",
  //     key: "description",
  //   },
  //   {
  //     title: "Status",
  //     dataIndex: "status",
  //     key: "status",
  //     render: (text) => (
  //       <div>
  //         <StatusComponent status={text} />
  //       </div>
  //     ),
  //   },
  //   {
  //     title: "Amount",
  //     key: "amount",
  //     dataIndex: "amount",
  //     render: (text) => <div>RM {text.toFixed(2)}</div>,
  //   },
  //   {
  //     title: "Type",
  //     dataIndex: "type",
  //     key: "type",
  //   },
  //   {
  //     title: "Created At",
  //     key: "createdAt",
  //     dataIndex: "createdAt",
  //     render: (text) => (
  //       <div>{dayjs(text).format("DD-MM-YYYY hh:mm:ss a")}</div>
  //     ),
  //   },
  // ];

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Invoice ID",
      dataIndex: "invoiceId",
      key: "invoiceId",
    },
    {
      title: "Customer Name",
      key: "customerName",
      dataIndex: "customerName",
    },
    {
      title: "Amount",
      dataIndex: "coin_amount",
      key: "coin_amount",
      sorter: (a, b) => a.coin_amount - b.coin_amount,
      render: (text) => <div style={{ width: "100px" }}>{text}</div>,
    },
    {
      title: "Transaction Type",
      key: "type",
      dataIndex: "type",
      filters: [
        {
          text: "reload",
          value: "reload",
        },
        {
          text: "receive",
          value: "receive",
        },
        {
          text: "spend",
          value: "spend",
        },
        {
          text: "cashout",
          value: "cashout",
        },
      ],
      filterMode: "tree",
      onFilter: (value, record) => record.type.includes(value),
      render: (text, row) => {
        if (text === "reload") {
          return (
            <div>
              <StatusComponent status={"Reload"} />
            </div>
          );
        }
        if (text === "receive") {
          return (
            <div>
              <StatusComponent status={"Receive"} />
            </div>
          );
        }
        if (text === "spend") {
          return (
            <div>
              <StatusComponent status={"Gift"} />
            </div>
          );
        }
        if (text === "cashout") {
          return (
            <div>
              <StatusComponent status={"Cashout"} />
            </div>
          );
        }
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <div>{text ?? "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Success",
          value: "Approved",
        },
        {
          text: "Failed",
          value: "Failed",
        },
      ],
      filterMode: "tree",
      onFilter: (value, record) => record.status.includes(value),
      render: (text) => {
        if (text === "Approved") {
          return (
            <div>
              <StatusComponent status={"Success"} />
            </div>
          );
        }
        if (text === "Failed") {
          return (
            <div>
              <StatusComponent status={"Failed"} />
            </div>
          );
        }
      },
    },
    {
      title: "Created At",
      key: "createdAt",
      dataIndex: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (text) => <div>{dayjs(text).format("DD/MM/YYYY hh:mm a")}</div>,
    },
  ];

  const displayGeneralUserInfo = () => {
    return (
      <div className="flex-row customer-basic-info-container">
        {displayUserInfo()}
        {displayUserInfoAmount()}
      </div>
    );
  };

  const displayUserInfo = () => {
    return (
      <div className="flex-row" style={{ flexGrow: 1, alignItems: "center" }}>
        <Avatar size={75} src={userData.avatar_url} />
        {/* <Avatar size={75} /> */}
        <div className="flex-column">
          <div className="customer-bolded-text" style={{ fontSize: "24px" }}>
            {`@${userData.username}`}
          </div>
          <div className="flex-row">
            <div className="customer-bolded-text">
              <DollarOutlined />
              {(Math.round(userData.wallet * 100) / 100).toFixed(2)}
              {/* {userData.wallet} */}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayUserInfoAmount = () => {
    return (
      <div className="flex-row" style={{ height: "fit-content" }}>
        <div className="flex-column">
          <div className="customer-fade-text">Followers</div>
          <div>{`${userData.followers}`}</div>
        </div>
        <div className="flex-column customer-divider">
          <div className="customer-fade-text">Following</div>
          <div>{`${userData.followings}`}</div>
        </div>
        <div className="flex-column customer-divider">
          <div className="customer-fade-text">Gift Received</div>
          <div>{`${userData.gifts}`}</div>
        </div>
        <div className="flex-column customer-divider">
          <div className="customer-fade-text">Total Spent</div>
          <div>
            <DollarOutlined />
            {`${userData.totalSpending}`}{" "}
          </div>
        </div>
      </div>
    );
  };

  const displayFullInfo = () => {
    return (
      <div>
        <div className="customer-bolded-text">Total Spent</div>
        {/* <div style={{ marginTop: "2vh" }}>{moneySpentGraph()}</div> */}
        <Divider />
        {displayBillingRecord()}
      </div>
    );
  };

  // const moneySpentGraph = () => {
  //   return <Line {...lineChartConfig} />;
  // };

  const displayBillingRecord = () => {
    return (
      <>
        <div className="flex-row">
          <div className="customer-bolded-text">Transaction Record</div>
          <div className="customer-fade-text">
            {transactionList.length} transactions
          </div>
        </div>

        <Table
          style={{ marginTop: "2vh" }}
          columns={columns}
          dataSource={transactionList}
          pagination={{
            showSizeChanger: false,
            pageSize: 5,
            size: "small",
          }}
        />
      </>
    );
  };

  const displayTopBar = () => {
    return (
      <PageHeader
        title={"User Profile"}
        onBack={() => {
          navigate("/users/list");
        }}
        className="basic-pageheader"
        extra={[
          <Tooltip title="Edit User">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              size="large"
              onClick={() => navigate(`/users/list/${userID}/edit`)}
            />
          </Tooltip>,
        ]}
      />
    );
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Spin spinning={loading}>
        {displayTopBar()}
        {displayGeneralUserInfo()}
        <div className="customer-full-info-container">{displayFullInfo()}</div>
        <Modal
          title="Suspend Account"
          visible={isModalVisible}
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
              Suspend
            </Button>,
          ]}
        >
          <p>
            The customer will be removed and no longer can access THISSSS platform.
          </p>
        </Modal>
      </Spin>
    </div>
  );
}

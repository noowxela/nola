import { useState } from "react";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import {  } from "react-router-dom";

import { Avatar, Breadcrumb, Button, Divider, Input, Table, Modal } from "antd";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import "styles/table.css";
import "styles/base.css";
import "styles/customer.css";

import StatusComponent from "components/common/Status";
import tempData from "pages/user-management/list/[id]/tempData.json";

export default function EventProfilePage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const userID = pathArray[3];

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Provider",
      dataIndex: "provider",
      key: "provider",
    },
    {
      title: "Store ID",
      dataIndex: "storeID",
      key: "storeID",
    },
    {
      title: "Store Name",
      dataIndex: "storeName",
      key: "storeName",
    },
    {
      title: "Payment Plan",
      key: "paymentPlan",
      dataIndex: "paymentPlan",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <div>
          <StatusComponent status={text} />
        </div>
      ),
    },
    {
      title: "Date",
      key: "date",
      dataIndex: "date",
      render: (text) => (
        <div>{dayjs(text).format("DD-MM-YYYY hh:mm:ss a")}</div>
      ),
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
      render: (text) => <div>RM {text.toFixed(2)}</div>,
    },
  ];

  const [userData, setUserData] = useState({
    fullName: "Ali Bin Abu",
    mykadNumber: "940222-13-5077",
    customerID: "032123",
    phone: "6014132312",
    userType: "MEMBER",
    email: "ali@gmail.com",
    address: "Aurora Place, Bukit Jalil",
    status: "Active",
    creationDate: new Date(),
    randomNumber: 1500,
    cashback: 0,
    unpaidBalance: 450,
    availableSpendingLimit: 1050,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        <Avatar size={75} />
        <div className="flex-column">
          <div className="customer-bolded-text" style={{ fontSize: "24px" }}>
            {userData.fullName}
          </div>
          <div className="flex-row">
            <div className="customer-bolded-text">
              <InboxOutlined /> RM {userData.randomNumber.toFixed(2)}
            </div>
            <div className="customer-fade-text customer-border-bottom-text">
              {userData.userType}
            </div>
          </div>
          <div className="customer-fade-text">
            Pay Now, Pay in 2, Pay in 3, Pay in 6
          </div>
        </div>
      </div>
    );
  };

  const displayUserInfoAmount = () => {
    return (
      <div className="flex-row" style={{ height: "fit-content" }}>
        <div className="flex-column">
          <div className="customer-fade-text">Cashback</div>
          <div>RM{userData.cashback}</div>
        </div>
        <div className="flex-column customer-divider">
          <div className="customer-fade-text">Unpaid Balance</div>
          <div>RM{userData.unpaidBalance}</div>
        </div>
        <div className="flex-column customer-divider">
          <div className="customer-fade-text">Available Spending Limit</div>
          <div>RM{userData.availableSpendingLimit}</div>
        </div>
      </div>
    );
  };

  const displayFullInfo = () => {
    return (
      <div>
        <div className="customer-bolded-text">Basic Info</div>
        <div style={{ marginTop: "2vh" }}>{displayBasicInfo()}</div>
        <Divider />
        <div className="customer-bolded-text">Documents</div>
        <div className="customer-grid-four-column" style={{ marginTop: "2vh" }}>
          {displayDocuments()}
        </div>
        <Divider />
        {displayBillingRecord()}
      </div>
    );
  };

  const displayBasicInfo = () => {
    return (
      <div className="customer-grid-three-column">
        {displayBasicInfoFirstRow()}
        {displayBasicInfoSecondRow()}
        {displayBasicInfoThirdRow()}
      </div>
    );
  };

  const displayBasicInfoFirstRow = () => {
    return (
      <>
        <div className="flex-row">
          <div>Full Name (as per MyKad):</div>
          <div className="customer-fade-text">{userData.fullName}</div>
        </div>
        <div className="flex-row">
          <div>Phone:</div>
          <div className="customer-fade-text">{userData.phone}</div>
        </div>
        <div className="flex-row" style={{ alignItems: "center" }}>
          <div>Status:</div>
          <div className="customer-fade-text">
            <StatusComponent status={userData.status} />
          </div>
          <div className="customer-fade-text customer-border-bottom-text">
            Notify Customer
          </div>
        </div>
      </>
    );
  };

  const displayBasicInfoSecondRow = () => {
    return (
      <>
        <div>
          <div className="flex-row">
            <div>MyKad Number:</div>
            <div className="customer-fade-text">{userData.mykadNumber}</div>
          </div>
        </div>
        <div className="flex-row">
          <div>Email:</div>
          <div className="customer-fade-text">{userData.email}</div>
        </div>
        <div className="flex-row" style={{ alignItems: "center" }}>
          <div>Account Creation Date:</div>
          <div className="customer-fade-text">
            {dayjs().format("DD-MM-YYYY hh:mm:ss a")}
          </div>
        </div>
      </>
    );
  };

  const displayBasicInfoThirdRow = () => {
    return (
      <>
        <div>
          <div className="flex-row">
            <div>Customer ID:</div>
            <div className="customer-fade-text">{userData.customerID}</div>
          </div>
        </div>
        <div className="flex-row">
          <div>Address:</div>
          <div className="customer-fade-text">{userData.address}</div>
        </div>
      </>
    );
  };

  const displayDocuments = () => {
    const listOfDocumentComponents = [];

    for (let index = 0; index < 4; index++) {
      listOfDocumentComponents.push(
        <>
          <div>MyKAD</div>
          <div className="customer-fade-text">
            {dayjs().format("DD/MM/YYYY hh:mm:ss a")}
          </div>
          <div className="customer-fade-text">IC Front and Back</div>
          <div className="flex-row" style={{ alignItems: "center" }}>
            <a>View</a>
            <DownloadOutlined />
          </div>
        </>
      );
    }
    return listOfDocumentComponents;
  };

  const displayBillingRecord = () => {
    return (
      <>
        <div className="flex-row">
          <div className="customer-bolded-text">Transaction Billing Record</div>
          <div className="customer-fade-text">
            {tempData.length} transactions
          </div>
        </div>
        <div style={{ width: "20vw", marginTop: "2vh" }}>
          <Input.Search />
        </div>
        <Table
          style={{ marginTop: "2vh" }}
          columns={columns}
          dataSource={tempData}
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
      <div
        className="flex-row breadcrumb-container"
        style={{ alignItems: "center" }}
      >
        <div style={{ flexGrow: 1 }}>
          <Breadcrumb>
            <Breadcrumb.Item>Customers</Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to={`/customers/list`}>List of Customers</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{userID}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className="flex-row">
          <Button danger style={{ background: "#FFF1F0" }} onClick={showModal}>
            <CloseCircleOutlined /> Suspend Account
          </Button>
          <Button>
            <DeleteOutlined /> Delete
          </Button>
          <Button
            type="primary"
            onClick={() => {
              navigate(`/customers/list/${userID}/edit`);
            }}
          >
            <EditOutlined /> Edit Info
          </Button>
        </div>
      </div>
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
      {displayTopBar()}
      <Divider />
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
          The customer will be removed and no longer can access Mobypay
          platform.
        </p>
      </Modal>
    </div>
  );
}

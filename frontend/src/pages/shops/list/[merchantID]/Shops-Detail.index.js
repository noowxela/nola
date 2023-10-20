import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Button,
  Image,
  Typography,
  Input,
  Table,
  Form,
  DatePicker,
  Modal,
  message,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { SearchOutlined } from "@ant-design/icons";
import Moment from "moment";

import { useQuery, useMutation } from "@apollo/client";
import { LISTSHOPCUSTOMERQUERY } from "server/query";
import { REDEEMFIRSTTIMEGIFTMUTATION } from "server/mutation";

import StatusComponent from "components/common/Status";
// import "styles/table.css";
// import "styles/base.css";
// import "styles/customer.css";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function ShopCustomerListPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[3];
  const shopName = pathArray[4];
  const [userList, setUserList] = useState([]);
  const [redeemUserID, setRedeemUserID] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchColumn, setSearchColumn] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [shopCustomerVariables, setShopCustomerVariables] = useState({
    shopId: shopId,
    username: "",
    startDate: null,
    endDate: null,
  });

  const [pagination, setPagination] = useState({
    position: ["bottomRight"],
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });

  // const { loading, error, data, refetch } = useQuery(listAllUser);
  const {
    loading: shopCustomerLoading,
    error: shopCustomerError,
    data: shopCustomerData,
    refetch: shopCustomerRefetch,
  } = useQuery(LISTSHOPCUSTOMERQUERY, {
    variables: shopCustomerVariables,
  });

  const [RedeemGiftMutation] = useMutation(REDEEMFIRSTTIMEGIFTMUTATION, {
    onCompleted(data) {
      console.log("data ", data);
      if (data.updateUserByAdmin.error == null) {
        mutationSuccess("Gift redeemed.");
      } else {
        mutationFail(data.updateUserByAdmin.error);
      }
    },
  });

  function mutationSuccess(text) {
    message.success(text);
    setIsModalVisible(false);
    shopCustomerRefetch();
  }

  function mutationFail(text) {
    message.error(text);
    setIsModalVisible(false);
  }

  const [form] = Form.useForm();

  useEffect(() => {
    if (shopCustomerLoading === false) {
      console.log("shopcustomer", shopCustomerData);
      rerenderListView(shopCustomerData.listShopCustomer);
    }
  }, [shopCustomerLoading, shopCustomerData]);

  function rerenderListView(items) {
    var list = [];
    for (var i = 0; i < items.length; i++) {
      list.push({
        userID: items[i].user._id,
        key: items[i].user._id,
        customerName: items[i].user.username,
        phoneNumber: items[i].user.phone_number,
        gender: items[i].user.gender,
        birthday: items[i].user.date_of_birth,
        averageSpending: items[i].user.averageSpending,
        status: items[i].user.status,
        isWelcomeGiftRedeemed: items[i].user.isWelcomeGiftRedeemed || false,
        checkedInAt: items[i].createdAt,
      });
    }
    console.log("list", list);
    setUserList(list);
    setPagination({
      ...pagination,
      total: list.length,
    });
  }

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      // clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            setSearchInput(node);
          }}
          placeholder={"Search"}
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput, 100);
      }
    },
    render: (text) => (searchColumn === dataIndex ? text : text),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchColumn(dataIndex);
  };

  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalVisible(false);
  };

  const showModal = (userID) => {
    console.log("showModal");
    console.log("id", userID);
    setRedeemUserID(userID);
    setIsModalVisible(true);
  };

  const confirmRedeem = (userID) =>
    new Promise((resolve) => {
      console.log("confirmRedeem");
      console.log("id", userID);
      RedeemGiftMutation({
        variables: {
          id: userID,
          isWelcomeGiftRedeemed: true,
        },
      });
      resolve();
    });

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      ...getColumnSearchProps("customerName"),
    },
    {
      title: "Phone Number",
      key: "phoneNumber",
      dataIndex: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Date of Birth",
      key: "birthday",
      dataIndex: "birthday",
      filters: [
        {
          text: "Jan",
          value: "01",
        },
        {
          text: "Feb",
          value: "02",
        },
        {
          text: "Mar",
          value: "03",
        },
        {
          text: "Apr",
          value: "04",
        },
        {
          text: "May",
          value: "05",
        },
        {
          text: "Jun",
          value: "06",
        },
        {
          text: "Jul",
          value: "07",
        },
        {
          text: "Aug",
          value: "08",
        },
        {
          text: "Sep",
          value: "09",
        },
        {
          text: "Oct",
          value: "10",
        },
        {
          text: "Nov",
          value: "11",
        },
        {
          text: "Dec",
          value: "12",
        },
      ],
      filterMode: "tree",
      onFilter: (value, record) => {
        const splitDoB = record.birthday.split("-");
        return splitDoB[1].includes(value);
      },
      render: (text, row) => Moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Gender",
      key: "gender",
      dataIndex: "gender",
      render: (text) => {
        if (text === "male") {
          return (
            <div>
              <StatusComponent status={"Male"} />
            </div>
          );
        }
        if (text === "female") {
          return (
            <div>
              <StatusComponent status={"Female"} />
            </div>
          );
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "new",
          value: "new",
        },
        {
          text: "active",
          value: "active",
        },
        {
          text: "inactive",
          value: "inactive",
        },
        {
          text: "deactivated",
          value: "deactivated",
        },
      ],
      filterMode: "tree",
      onFilter: (value, record) => record.status === value,
      render: (text, row) => {
        if (text === "new") {
          return (
            <div>
              <StatusComponent status={"New"} />
            </div>
          );
        }
        if (text === "active") {
          return (
            <div>
              <StatusComponent status={"Active"} />
            </div>
          );
        }
        if (text === "inactive") {
          return (
            <div>
              <StatusComponent status={"Inactive"} />
            </div>
          );
        }
        if (text === "deactivated") {
          return (
            <div>
              <StatusComponent status={"Deactivated"} />
            </div>
          );
        }
      },
    },
    {
      title: "Avg Spending",
      dataIndex: "averageSpending",
      key: "averageSpending",
      sorter: (a, b) => a.averageSpending - b.averageSpending,
      render: (text) => {
        console.log("revenue", text);
        return (
          <div style={{ width: "100px" }}>
            <Image
              width={25}
              src="/coin.svg"
              preview={false}
              style={{ paddingBottom: "6px" }}
            />{" "}
            {/* {(Math.round(text * 100) / 100).toFixed(2)} */}
            {text}
          </div>
        );
      },
    },
    {
      title: "Last Checked In",
      dataIndex: "checkedInAt",
      key: "checkedInAt",
      render: (text, row) => Moment(text).format("DD-MM-YYYY h:mm:ss a"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        console.log("record", record);
        console.log(record.isWelcomeGiftRedeemed);
        return (
          <div className="flex-row">
            <Button type="link">
              <Link to={`/users/list/${record.userID}`}>View</Link>
            </Button>
            <Button
              type="primary"
              disabled={record.isWelcomeGiftRedeemed}
              onClick={() => showModal(record.userID)}
            >
              Redeem
            </Button>
            {/* <Button type="link">
            <Link to={`/users/list/${record.userID}/edit`}>Edit</Link>
          </Button> */}
            {/* <Button danger type="link">
            Delete
          </Button> */}
          </div>
        );
      },
    },
  ];

  const displayUsersInShop = () => {
    return (
      <div className="table-container">
        <Table
          style={{ marginTop: "1vh" }}
          columns={columns}
          dataSource={userList}
          pagination={{
            showSizeChanger: false,
            pageSize: 20,
            size: "small",
          }}
        />
      </div>
    );
  };

  const handleDateChange = (dates, dateStrings) => {
    console.log("dates", dates);
    console.log("date1", dateStrings[0]);
    console.log("date2", dateStrings[1]);
    if (!dates) {
      shopCustomerRefetch({
        shopId: shopId,
        username: "",
        startDate: null,
        endDate: null,
      });
    } else {
      shopCustomerRefetch({
        shopId: shopId,
        username: "",
        startDate: dateStrings[0],
        endDate: dateStrings[1],
      });
    }
  };

  const displayTopBar = () => {
    return (
      <PageHeader
        title={
          <Title level={4} style={{ marginBottom: "0" }}>
            Customer List - {decodeURI(shopName)}
          </Title>
        }
        className="basic-pageheader"
        onBack={() => {
          navigate(`/shops/list`);
        }}
        extra={[
          <RangePicker onChange={handleDateChange} />,
        ]}
      />
    );
  };

  return (
    <div>
      {displayTopBar()}
      {displayUsersInShop()}
      <Modal
        title="Redeem Welcome Gift"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => confirmRedeem(redeemUserID)}
        cancelText="Cancel"
        okText="Confirm"
        // footer={[
        //   // <Button key="cancel" onClick={handleCancel}>
        //   //   Cancel
        //   // </Button>,
        //   // <Button key="delete" type="primary" onClick={comfirmDelete} className="button-modal-alert">
        //   //   Delete
        //   // </Button>,
        // ]}
      >
        <p>Confirm to redeem welcome gift for this user?</p>
      </Modal>
    </div>
  );
}

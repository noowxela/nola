import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  Button,
  Image,
  Modal,
  Table,
  Tooltip,
  message,
  Input,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import {
  PlusCircleOutlined,
  SearchOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import Moment from "moment";

import { useQuery, useMutation } from "@apollo/client";
import { listAllUser } from "server/query";
import { ArchiveUser } from "server/mutation"
;
import StatusComponent from "components/common/Status";
// import "styles/base.css";
// import "styles/table.css";

export default function UsersListPage() {
  const navigate = useNavigate();
  const [userList, setUserList] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [searchColumn, setSearchColumn] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pagination, setPagination] = useState({
    position: ["bottomRight"],
    total: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });

  const { loading, error, data, refetch } = useQuery(listAllUser, {
    variables: { isAdmin: true },
  });

  const [ArchiveUserMutation] = useMutation(ArchiveUser, {
    onCompleted(data) {
      console.log("data ", data);
      if (data.archiveUser.error == null) {
        mutationSuccess("User archived.");
      } else {
        mutationFail(data.archiveUser.error);
      }
    },
  });

  useEffect(() => {
    if (loading === false) {
      rerenderListView(data.listAllUser);
    }
  }, [loading, data]);

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
        {/* <Space>
          <Button
            type="primary"
            danger
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 200 }}
          >
            Reset
          </Button>
        </Space> */}
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

  //todo: continue fix
  // const handleReset = (clearFilters) => {
  //   setSearchText("");
  //   clearFilters();
  // };

  const columns = [
    // {
    //   title: "Customer ID",
    //   dataIndex: "userID",
    //   key: "userID",
    //   render: (text) => <Link to={`/users/list/${text}`}>{text}</Link>,
    // },
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
        console.log("filter value", value);
        console.log("filter record", record);
        console.log("filter record birthday", record.birthday);
        const splitDoB = record.birthday.split("-");
        return splitDoB[1].includes(value);
      },
      render: (text, row) => Moment(text).format("DD-MM-YYYY"),
    },
    {
      title: "Gender",
      key: "gender",
      dataIndex: "gender",
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
            <DollarOutlined />
            {" "}
            {/* {(Math.round(text * 100) / 100).toFixed(2)} */}
            {text}
          </div>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => Moment(a.createdAt).unix() - Moment(b.createdAt).unix(),
      render: (text, row) => Moment(text).format("DD-MM-YYYY h:mm:ss a"),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 200,
      render: (text, record) => (
        <div className="flex-row">
          <Button type="link">
            <Link to={`/users/list/${record.userID}`}>View</Link>
          </Button>
          <Button type="link">
            <Link to={`/users/list/${record.userID}/edit`}>Edit</Link>
          </Button>
          {/* <Popconfirm
            title="Sure to delete? pop"
            onConfirm={() => comfirmDelete(record.userID)}
            onCancel={handleDeletePopconfirmCancel}
            onVisibleChange={() => console.log("visible change")}
          >
            <Button danger type="link">
              pop Delete
            </Button>
          </Popconfirm> */}
          <Button danger type="link" onClick={() => showModal(record.userID)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // const handleDeletePopconfirmCancel = () => {
  //   console.log("Clicked cancel button");
  // };

  const showModal = (userID) => {
    console.log("showModal");
    console.log("id", userID);
    setDeleteUserId(userID);
    setIsModalVisible(true);
  };

  // async function comfirmDelete(shopID) {
  //   console.log("comfirmDelete")
  //   console.log("id",shopID)
  //   await ArchiveShopMutation({ variables: {
  //     _id:shopID,
  //   }})
  //   await resolve(s)
  // }

  const comfirmDelete = (userID) =>
    new Promise((resolve) => {
      console.log("comfirmDelete");
      console.log("id", userID);
      ArchiveUserMutation({
        variables: {
          id: userID,
        },
      });
      resolve();
    });

  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalVisible(false);
  };

  /* Handle table pagination */
  const handleTablePage = (page) => {
    console.log(page);
    setPagination({
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    });
  };

  function rerenderListView(items) {
    let list = [];

    for (var i = 0; i < items.length; i++) {
      list.push({
        userID: items[i]._id,
        key: items[i]._id,
        customerName: items[i].username,
        phoneNumber: items[i].phone_number,
        gender: items[i].gender,
        birthday: items[i].date_of_birth,
        averageSpending: items[i].averageSpending,
        status: items[i].status,
        createdAt: items[i].createdAt,
      });
    }

    console.log("list", list);
    setUserList(list);
    setPagination({
      ...pagination,
      total: list.length,
    });
  }

  function mutationSuccess(text) {
    message.success(text);
    setIsModalVisible(false);
    // setCreateModalVisible(false);
    // setStatusModal('create')
    // setTaskTitle('')
    // setTaskDescription('')
    // setSelectedAgent([])
    // setSelectedGroup([])
    refetch();
  }

  function mutationFail(text) {
    message.error(text);
    setIsModalVisible(false);
    // setCreateModalVisible(false);
    // setStatusModal('create')
    // setTaskTitle('')
    // setTaskDescription('')
    // setSelectedAgent([])
    // setSelectedGroup([])
  }

  return (
    <div>
      {/* <div className="breadcrumb-container">
        <Breadcrumb>
          <Breadcrumb.Item>Shop Management</Breadcrumb.Item>
          <Breadcrumb.Item>List of Shops</Breadcrumb.Item>
        </Breadcrumb>
      </div> */}

      {/* <div className="page-header-container"> */}
      <PageHeader
        title={"Users Management"}
        className="basic-pageheader"
        // style={{
        //   justifyContent: "end",
        //   padding: "17px 24px",
        //   background: "white",
        //   margin: "0px 2px 10px 2px",
        //   boxShadow: "0px 1px 4px rgba(0, 21, 41, 0.12)",
        // }}
        extra={[
          <Tooltip title="Create User">
            <Button
              shape="circle"
              icon={<PlusCircleOutlined />}
              size="large"
              onClick={() => navigate("/users/create")}
            />
          </Tooltip>,
          // <Tooltip title="Export">
          //   <Button
          //     shape="circle"
          //     size="large"
          //     icon={<ExportOutlined size="large" />}
          //   />
          // </Tooltip>,
        ]}
      />
      <div className="table-container">
        <Table
          scroll={{ x: "auto" }}
          // rowSelection={{
          //   type: "checkbox",
          // }}
          columns={columns}
          dataSource={userList}
          onChange={(page) => {
            handleTablePage(page);
          }}
          pagination={pagination}
        />
      </div>

      <Modal
        title="Delete User ???"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => comfirmDelete(deleteUserId)}
        cancelText="Cancel"
        okText="Confirm Delete"
        // footer={[
        //   // <Button key="cancel" onClick={handleCancel}>
        //   //   Cancel
        //   // </Button>,
        //   // <Button key="delete" type="primary" onClick={comfirmDelete} className="button-modal-alert">
        //   //   Delete
        //   // </Button>,
        // ]}
      >
        <p>You will not be able to recover the information.</p>
      </Modal>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  Button,
  Modal,
  Table,
  message,
  Tooltip,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { DollarOutlined,PlusCircleOutlined } from "@ant-design/icons";

import HeaderRow from "components/common/Header";
import moment from "moment";

import { useQuery, useMutation } from "@apollo/client";
import { portalListShop } from "server/query";
import { ArchiveShop } from "server/mutation";
// import "styles/base.css";
// import "styles/table.css";

export default function ShopsListPage() {
  const navigate = useNavigate();
  const [shopList, setShopList] = useState([]);
  const [deleteShopId, setDeleteShopId] = useState(null);
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

  const { loading, error, data, refetch } = useQuery(portalListShop);

  const [ArchiveShopMutation] = useMutation(ArchiveShop, {
    onCompleted(data) {
      console.log("data ", data);
      if (data.archiveShop.error == null) {
        mutationSuccess("Shop archived.");
      } else {
        mutationFail(data.archiveShop.error);
      }
    },
  });

  useEffect(() => {
    if (loading === false) {
      rerenderListView(data.portalListShop);
    }
  }, [loading, data]);

  const columns = [
    // {
    //   title: "Shop ID",
    //   dataIndex: "shopID",
    //   key: "shopID",
    //   render: (text, record) => (
    //     <Link to={`/shops/list/${text}/${record.name}`}>{text}</Link>
    //   ),
    // },
    {
      title: "Shop Name",
      dataIndex: "name",
      key: "name",
      filters: [
        {
          text: "agent a",
          value: "agent a",
        },
        {
          text: "agent b",
          value: "agent b",
        },
      ],
      filterMode: "tree",
      // filterSearch: true,
      onFilter: (value, record) => record.name.includes(value),
      // render: (text, row) => <>{row["name"]}</>,
      render: (text, row) => <>{text}</>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text, row) => <>{text}</>,
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => <>{text}</>,
    },
    {
      title: "Revenue",
      dataIndex: "revenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
      render: (text) => {
        console.log("revenue", text);
        return (
          <>
            <DollarOutlined />
            {" "}
            {(Math.round(text * 100) / 100).toFixed(0)}
          </>
        );
      },
    },
    {
      title: "Coins",
      dataIndex: "coins",
      key: "coins",
      sorter: (a, b) => a.coins - b.coins,
      render: (text, record) => {
        console.log("coins", text);
        return (
          <>
            <DollarOutlined />
            {" "}
            {(Math.round(text * 100) / 100).toFixed(0)}
          </>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      render: (text, row) => moment(text).format("DD-MM-YYYY h:mm:ss a"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <div className="flex-row">
          <Button type="link">
            <Link to={`/shops/list/${record.shopID}/${record.name}/userAttend`}>
              View Customers
            </Link>
          </Button>
          <Button type="link">
            <Link to={`/shops/list/${record.shopID}/${record.name}/edit`}>
              Edit
            </Link>
          </Button>
          <Button danger type="link" onClick={() => showModal(record.shopID)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // const handleDeletePopconfirmCancel = () => {
  //   console.log("Clicked cancel button");
  // };

  const showModal = (shopID) => {
    console.log("showModal");
    console.log("id", shopID);
    setDeleteShopId(shopID);
    setIsModalVisible(true);
  };

  const comfirmDelete = (shopID) =>
    new Promise((resolve) => {
      console.log("comfirmDelete");
      console.log("id", shopID);
      ArchiveShopMutation({
        variables: {
          _id: shopID,
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
    // console.log('data', items)
    var list = [];
    for (var i = 0; i < items.length; i++) {
      list.push({
        shopID: items[i]._id,
        key: items[i]._id,
        name: items[i].name,
        location: items[i].location,
        phone_number: items[i].phone_number,
        revenue: items[i].revenue,
        coins: items[i].coins,
        createdAt: items[i].createdAt,
      });
    }
    setShopList(list);
    setPagination({
      ...pagination,
      total: list.length,
    });
  }

  function mutationSuccess(text) {
    message.success(text);
    setIsModalVisible(false);
    refetch();
  }

  function mutationFail(text) {
    message.error(text);
    setIsModalVisible(false);
  }

  return (
    <div>
      <HeaderRow/>
      <PageHeader
        title={`Shop Management}`}
        className="basic-pageheader"
        extra={[
          <Tooltip title="create shop">
            <Button
              shape="circle"
              icon={<PlusCircleOutlined />}
              size="large"
              onClick={() =>
                navigate(`/shops/create`)
              }
            />
          </Tooltip>
        ]}
      />
      <div className="table-container">
        <Table
          scroll={{ x: "auto" }}
          rowSelection={{
            type: "checkbox",
          }}
          columns={columns}
          dataSource={shopList}
          onChange={(page) => {
            handleTablePage(page);
          }}
          pagination={pagination}
        />
      </div>

      <Modal
        title="You are going to ARCHIVE this SHOP. Are you sure?"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => comfirmDelete(deleteShopId)}
        cancelText="Cancel"
        okText="Confirm"
      >
        <p>You will not be able to recover the information.</p>
      </Modal>
    </div>
  );
}

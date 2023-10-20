
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Link, useLocation  } from "react-router-dom";
import {
  Table,
  Tooltip,
  Button,
  Row,
  Col,
  DatePicker,
  Modal,
  message,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";

import { useQuery, useMutation } from "@apollo/client";
import { listShopEvents } from "server/query";
import { ARCHIVEEVENTMUTATION } from "server/mutation";
import dayjs from "dayjs";

// import "styles/table.css";
// import "styles/base.css";
const { RangePicker } = DatePicker;

export default function EventListPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[2];
  const shopName = pathArray[3];
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [eventLists, setEventLists] = useState([]);

  const {
    loading: eventLoading,
    error: eventError,
    data: eventData,
    refetch: eventRefetch,
  } = useQuery(listShopEvents, {
    variables: { shopId: shopId },
  });

  const [ArchiveEventMutation] = useMutation(ARCHIVEEVENTMUTATION, {
    onCompleted(data) {
      console.log("data ", data);
      if (data.archiveEvent.error == null) {
        mutationSuccess("Event deleted.");
      } else {
        mutationFail(data.archiveEvent.error);
      }
    },
  });

  function mutationSuccess(text) {
    message.success(text);
    setIsModalVisible(false);
    eventRefetch();
  }

  function mutationFail(text) {
    message.error(text);
    setIsModalVisible(false);
  }

  useEffect(() => {
    if (!eventLoading) {
      console.log("event lists", eventData.listAllEvents);
      const tempList = eventData.listAllEvents.map((history) => {
        return {
          id: history._id,
          key: history._id,
          eventDescription: history.event_description,
          eventPerformer:
            history.giftReceivedAmount[0].user.username || "No Performer",
          startTime: history.start_time,
          endTime: history.end_time,
        };
      });
      setEventLists(tempList);
    }
  }, [eventLoading, eventData]);

  const showModal = (eventId) => {
    console.log("showModal");
    console.log("id", eventId);
    setDeleteEventId(eventId);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    console.log("handleCancel");
    setIsModalVisible(false);
  };

  const comfirmDelete = (eventID) =>
    new Promise((resolve) => {
      console.log("comfirmDelete");
      console.log("id", eventID);
      ArchiveEventMutation({
        variables: {
          id: eventID,
        },
      });
      resolve();
    });

  const columns = [
    {
      title: "Event Name",
      dataIndex: "eventDescription",
      key: "eventDescription",
    },
    {
      title: "Performer Name",
      dataIndex: "eventPerformer",
      key: "eventPerformer",
    },
    {
      title: "Start Time",
      key: "startTime",
      dataIndex: "startTime",
      render: (text) => <div>{dayjs(text).format("DD/MM/YYYY hh:mm a")}</div>,
    },
    {
      title: "End Time",
      key: "endTime",
      dataIndex: "endTime",
      render: (text) => <div>{dayjs(text).format("DD/MM/YYYY hh:mm a")}</div>,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (text, record) => (
        <div className="flex-row">
          <Button type="link">
            <Link
              to={`/event/${shopId}/${decodeURI(shopName)}/${record.id}/edit`}
            >
              Edit
            </Link>
          </Button>
          <Button danger type="link" onClick={() => showModal(record.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Event List - ${decodeURI(shopName)}`}
        className="basic-pageheader"
        extra={[
          <Tooltip title="create event">
            <Button
              shape="circle"
              icon={<PlusCircleOutlined />}
              size="large"
              onClick={() =>
                navigate(`/event/${shopId}/${decodeURI(shopName)}/create`)
              }
            />
          </Tooltip>,
          <Tooltip title="manage events">
            <Button
              shape="circle"
              icon={<SettingOutlined />}
              size="large"
              onClick={() =>
                navigate(`/event/${shopId}/${decodeURI(shopName)}/shopmode`)
              }
            />
          </Tooltip>,
        ]}
      />
      <div className="table-container">
        <Table
          columns={columns}
          dataSource={eventLists}
          pagination={{
            showQuickJumper: true,
          }}
        />
      </div>
      <Modal
        title="You are going to DELETE this Event. Are you sure?"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => comfirmDelete(deleteEventId)}
        cancelText="Cancel"
        okText="Confirm"
      >
        <p>You will not be able to recover the information.</p>
      </Modal>
    </div>
  );
}

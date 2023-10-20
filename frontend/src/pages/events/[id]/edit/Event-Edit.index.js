
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  message,
  Image,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import {
  CheckOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useQuery, useMutation } from "@apollo/client";
import { CREATETRANSACTIONSEARCHUSER, EVENTDETAILQUERY } from "server/query";
import { UPDATEEVENTMUTATION } from "server/mutation";

import moment from "moment";
// import "styles/base.css";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 4,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 7,
    },
  },
};
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 7,
      offset: 4,
    },
  },
};

const { Option } = Select;
const { Dragger } = Upload;

export default function EventEditPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[2];
  const shopName = pathArray[3];
  const eventID = pathArray[4];
  const [eventForm] = Form.useForm();
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [linkExt, setLinkExt] = useState("");
  const [fileList, setFileList] = useState([]);
  const [eventDetailData, setEventDetailData] = useState({});

  const {
    loading: eventLoading,
    error: eventError,
    data: eventData,
    refetch: eventRefetch,
  } = useQuery(EVENTDETAILQUERY, {
    variables: { id: eventID },
  });

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
    refetch: usersRefetch,
  } = useQuery(CREATETRANSACTIONSEARCHUSER, {
    variables: { username: username },
  });

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

  useEffect(() => {
    if (eventLoading === false) {
      console.log("eventData.eventDetail", eventData.eventDetail);
      setEventDetailData(eventData.eventDetail);
      setStartDate(eventData.eventDetail.start_time);
      setEndDate(eventData.eventDetail.end_time);
      setLinkExt(eventData.eventDetail.image_url.split(".").pop());
      onFill(eventData.eventDetail);
    }
  }, [eventLoading, eventData]);

  const onFill = (data) => {
    console.log("onFill");
    console.log(data);
    eventForm.setFieldsValue({
      eventDescription: data.event_description,
      startTime: moment(data.start_time, "YYYY-MM-DD"),
      endTime: moment(data.end_time, "YYYY-MM-DD"),
      eventPerformers: data.event_performer,
    });
  };

  const [
    UpdateEventMutation,
    {
      data: updateEventData,
      loading: updateEventLoading,
      error: updateEventError,
    },
  ] = useMutation(UPDATEEVENTMUTATION, {
    onCompleted(data) {
      message.success("Successfully Edited Event");
      console.log("edited event");
      navigate(`/event/${shopId}/${shopName}/list`);
      //   window.location.reload(true);
    },
    onError(error) {
      message.error(error.message.toString());
      console.log("error", error.message.toString());
      console.log("event not updated");
    },
  });

  const onSelectStartDate = (date, dateString) => {
    console.log("selected date", date);
    setStartDate(date);
  };

  const onSelectEndDate = (date, dateString) => {
    setEndDate(date);
  };

  const onFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];
    console.log("formFieldName ", formFieldName);
  };

  const onFinish = (values) => {
    console.log("valuesssssssssssssssss, ", values);
    console.log("eventForm, ", eventForm);
    let updateVars = eventForm.getFieldsValue([
      "eventDescription",
      "eventPerformers",
    ]);
    updateVars.id = eventData.eventDetail._id;
    updateVars.startTime = startDate;
    updateVars.endTime = endDate;
    updateVars.shopId = shopId;
    updateVars.eventImage = fileList[0] || null;
    console.log("updateVars, ", updateVars);
    UpdateEventMutation({
      variables: {
        id: updateVars.id,
        eventDescription:
          updateVars.eventDescription != null
            ? updateVars.eventDescription
            : "",
        eventPerformer:
          updateVars.eventPerformers != null ? updateVars.eventPerformers : [],
        startTime: updateVars.startTime != null ? updateVars.startTime : "",
        endTime: updateVars.endTime != null ? updateVars.endTime : "",
        shopId: updateVars.shopId != null ? updateVars.shopId : "",
        eventImage:
          updateVars.eventImage != null ? updateVars.eventImage : null,
      },
    });
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const eventImageProps = {
    name: "file",
    listType: "picture",
    // multiple: true,
    action: "http://localhost:8000/graphql",
    // customRequest: uploadImage,
    onChange(info) {
      console.log("info: ", info);
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div>
      <PageHeader
        title={`Edit Event - ${decodeURI(shopName)}`}
        className="basic-pageheader"
        onBack={() => {
          navigate(`/event/${shopId}/${shopName}/list`);
        }}
      />
      <div className="form-container">
        <Form
          id="eventForm"
          form={eventForm}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 12,
          }}
          initialValues={{ eventPerformers: [null] }}
          onFinish={onFinish}
          onValuesChange={onFormValuesChange}
        >
          <Form.Item label="Event Name" name="eventDescription">
            <Input size="large" placeholder="Enter event's name" />
          </Form.Item>
          <Form.Item
            label="Event Start Time"
            name="startTime"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 7,
            }}
          >
            <DatePicker showTime size="large" onChange={onSelectStartDate} />
          </Form.Item>
          <Form.Item
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 7,
            }}
            label="Event End Time"
            name="endTime"
          >
            <DatePicker showTime size="large" onChange={onSelectEndDate} />
          </Form.Item>
          <Form.List
            name="eventPerformers"
            rules={[
              {
                validator: async (_, names) => {
                  if (!names || names.length < 1) {
                    return Promise.reject(new Error("At least 1 passengers"));
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0
                      ? formItemLayout
                      : formItemLayoutWithOutLabel)}
                    label={index === 0 ? "Performers" : ""}
                    required={false}
                    key={field.key}
                  >
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message:
                            "Please select performer or delete this field.",
                        },
                      ]}
                      noStyle
                    >
                      <Select
                        showSearch
                        placeholder="Enter Username"
                        optionFilterProp="children"
                        style={{
                          width: "70%",
                        }}
                        size="large"
                        filterOption={(input, option) => {
                          return (
                            option.children
                              .toLowerCase()
                              .indexOf(input.toLowerCase()) >= 0
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
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                      />
                    ) : null}
                  </Form.Item>
                ))}
                <Form.Item
                  labelCol={{
                    span: 4,
                  }}
                  wrapperCol={{
                    span: 7,
                    offset: 4,
                  }}
                >
                  {fields.length < 6 ? (
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      size="large"
                      style={{
                        width: "100%",
                      }}
                      icon={<PlusOutlined />}
                    >
                      Add Performer
                    </Button>
                  ) : null}

                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item
            label="Upload"
            name="dragger"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            // noStyle
          >
            {/* <Input size="large" placeholder="Drag and drop file(s) or Browse" />
            need add a recommended file size and type on all the upload section
            , request from client */}
            <Dragger name="files" {...eventImageProps}>
              {/* <Dragger name="files" listType="picture"> */}
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Form.Item>
          <Form.Item label="Current Background Image" name="gallery">
            <>
              {linkExt === "mp4" ||
              linkExt === "m4v" ||
              linkExt === "webm" ||
              linkExt === "mov" ||
              linkExt === "ogg" ? (
                <video
                  src={eventDetailData.image_url}
                  style={{ height: "300px" }}
                ></video>
              ) : (
                <Image
                  width={300}
                  src={eventDetailData.image_url || ""}
                  preview={false}
                  style={{ margin: "10px" }}
                />
              )}
            </>
          </Form.Item>
          {/* </Form.Item> */}

          <Divider />
          <Form.Item style={{ textAlign: "end" }} wrapperCol={{ span: 24 }}>
            <Button
              onClick={() => {
                navigate(`/event/${shopId}/${shopName}/list`);
              }}
            >
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Update <CheckOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

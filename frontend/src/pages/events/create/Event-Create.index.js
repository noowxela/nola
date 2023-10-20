
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
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';

import {
  CheckOutlined,
  InboxOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useQuery, useMutation } from "@apollo/client";
import { CREATETRANSACTIONSEARCHUSER } from "server/query";
import { CREATEEVENTMUTATION } from "server/mutation";

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

export default function EventCreatePage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopId = pathArray[2];
  const shopName = pathArray[3];

  const [eventForm] = Form.useForm();
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileList, setFileList] = useState([]);

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

  const onSelectStartDate = (date, dateString) => {
    console.log("selected date", date);
    setStartDate(date);
  };

  const onSelectEndDate = (date, dateString) => {
    setEndDate(date);
  };

  const [
    CreateEventMutation,
    {
      data: createEventData,
      loading: createEventLoading,
      error: createEventError,
    },
  ] = useMutation(CREATEEVENTMUTATION, {
    onCompleted(data) {
      message.success("Successfully Created Event");
      console.log("created event");
      navigate(`/event/${shopId}/${shopName}/list`);
      window.location.reload(true);
    },
    onError(error) {
      message.error(error.message.toString());
      console.log("error", error.message.toString());
      console.log("event not created");
    },
  });

  const onFinish = async (values) => {
    console.log("valuesssssssssssssssss, ", values);
    // console.log("file123", fileList[0]);

    let formData = {};
    formData.eventDescription = values.eventDescription;
    formData.startTime = startDate;
    formData.endTime = endDate;
    formData.eventPerformer = values.eventPerformers;
    formData.shopId = shopId;
    formData.eventImage = fileList[0];
    console.log("formData", formData);
    CreateEventMutation({
      variables: formData,
    });
  };

  const onFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];
    console.log("formFieldName ", formFieldName);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const promotionImageProps = {
    name: "file",
    listType: "picture",
    accept: "video/*,image/*",
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
        title={`Create Event - ${decodeURI(shopName)}`}
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
          {/* <Form.Item
            label="Select Performer"
            name="eventPerformer"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 7,
            }}
          >
            <Select
              showSearch
              placeholder="Enter Username"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) => {
                return (
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
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
          </Form.Item> */}
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
            <Dragger name="files" {...promotionImageProps}>
              {/* <Dragger name="files" listType="picture"> */}
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
            </Dragger>
          </Form.Item>
          {/* </Form.Item> */}

          <Divider />
          <Form.Item style={{ textAlign: "end" }} wrapperCol={{ span: 24 }}>
            <Button>Cancel</Button>
            <Button htmlType="submit" type="primary">
              Create <CheckOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  message,
  Form,
  Select,
  Image,
  Checkbox,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { CheckOutlined } from "@ant-design/icons";

import { useQuery, useMutation } from "@apollo/client";
import { userDetail } from "server/query";
import { CHANGEUSERTIERMUTATION } from "server/mutation";

const { Option } = Select;

export default function CustomerEditPage() {
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const userID = pathArray[3];
  const [userForm] = Form.useForm();
  const [userData, setUserData] = useState(false);
  const [freezeTier, setFreezeTier] = useState(false);
  const [remainGallery, setRemainGallery] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const { loading, error, data, refetch } = useQuery(userDetail, {
    variables: { id: userID },
  });

  useEffect(() => {
    if (loading === false) {
      console.log("edit user data", data);
      setUserData(data.userDetail);
      onFill(data.userDetail);
    }
  }, [loading, data]);

  const onFill = (data) => {
    console.log("onFill");
    console.log(data);
    userForm.setFieldsValue({
      avatar_url: data.avatar_url,
      role: data.role,
      tier: data.tier,
      spendingTier: data.spending_tier,
    });
    setFreezeTier(data.freeze_tier);
    setRemainGallery(data.gallery);
    setAvatarUrl(data.avatar_url);
  };
  // console.log("edit user data", data);
  // if (error) return `Error! ${error.message}`;
  // const userData = data.userDetail;
  // console.log("edit userData", userData);

  const [
    ChangeUserTierMutation,
    {
      data: changeUserTierData,
      loading: changeUserTierLoading,
      error: changeUserTierError,
    },
  ] = useMutation(CHANGEUSERTIERMUTATION, {
    onCompleted(data) {
      message.success("Successfully Changed User Tier");
      console.log("user tier changed");
      navigate(`/users/list/${userID}`);
    },
    onError(error) {
      message.error(error.message.toString());
      console.log("error", error.message.toString());
      console.log("user update failed");
    },
  });

  // const onChange = (e) => {
  //   console.log(`checked = ${e.target.checked}`);
  // };

  const onChangeAvatar = (e) => {
    console.log("avatara checked = ", e.target.checked);
    if (e.target.checked) {
      setAvatarUrl(null);
    } else {
      setAvatarUrl(userData.avatar_url);
    }
  };
  const onChangeFreezeTier = (e) => {
    setFreezeTier(e.target.checked);
  };
  const onChangeGallery = (checkedValues) => {
    console.log("userData = ", userData.gallery);
    console.log("gallery checked = ", checkedValues);
    let difference = userData.gallery.filter((x) => !checkedValues.includes(x));
    console.log("difference = ", difference);
    setRemainGallery(difference);
  };

  const handleOk = () => {
    let data = userForm.getFieldsValue(["tier", "spendingTier", "role"]);
    data.id = userID;
    data.avatarUrl = avatarUrl;
    data.gallery = remainGallery;
    data.freezeTier = freezeTier;
    console.log("data2, ", data);
    ChangeUserTierMutation({
      variables: data,
    });
  };
  if (loading) return "Loading...";
  return (
    <div>
      <PageHeader
        title={`Edit User - @${userData.username || ""}`}
        className="basic-pageheader"
        onBack={() => {
          navigate(`/users/list/${userID}`);
        }}
      />
      <div className="form-container">
        <Form
          initialValues={{
            avatar_url: userData.avatar_url,
          }}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 12,
          }}
          form={userForm}
          name="userForm"
        >
          {data.userDetail.avatar_url ? (
            <Form.Item label="Avatar (Check to delete)" name="avatar_url">
              <Checkbox onChange={onChangeAvatar} style={{ padding: "15px" }}>
                <Image
                  width={100}
                  src={userData.avatar_url}
                  preview={false}
                  style={{ margin: "10px" }}
                />
              </Checkbox>
            </Form.Item>
          ) : null}

          {data.userDetail.gallery.length !== 0 ? (
            <Form.Item label="Gallery Image (Check to delete)" name="gallery">
              <Checkbox.Group onChange={onChangeGallery}>
                {data.userDetail.gallery.map((gallery, index) => {
                  // console.log("gallery", gallery);
                  return (
                    <Checkbox
                      value={gallery}
                      style={{ padding: "15px" }}
                      key={gallery}
                    >
                      <Image
                        width={100}
                        src={gallery}
                        preview={false}
                        style={{ margin: "10px" }}
                        key={gallery}
                      />
                    </Checkbox>
                  );
                })}
              </Checkbox.Group>
            </Form.Item>
          ) : null}
          <Form.Item
            label="User Role"
            name="role"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
          >
            <Select
              placeholder="Select Role"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="admin">Admin</Option>
              <Option value="manager">Shop Manager</Option>
              <Option value="customer">Customer</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="User Tier"
            name="tier"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
          >
            <Select
              placeholder="Select Tier"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="tier1">Tier 1</Option>
              <Option value="tier2">Tier 2</Option>
              <Option value="tier3">Tier 3</Option>
              <Option value="tier4">Tier 4</Option>
              <Option value="tier5">Tier 5</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="User Spending Tier"
            name="spendingTier"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 12,
            }}
          >
            {/* <Input size="large" placeholder="Select Transaction Type" /> */}
            <Select
              placeholder="Select Tier"
              optionFilterProp="children"
              size="large"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="tier1">Tier 1</Option>
              <Option value="tier2">Tier 2</Option>
              <Option value="tier3">Tier 3</Option>
              <Option value="tier4">Tier 4</Option>
              <Option value="tier5">Tier 5</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Freeze Tier ?" name="freezeTier">
            <Checkbox
              defaultChecked={freezeTier}
              onChange={onChangeFreezeTier}
              style={{ padding: "15px" }}
            ></Checkbox>
          </Form.Item>

          <Form.Item style={{ textAlign: "end" }} wrapperCol={{ span: 24 }}>
            <Button htmlType="submit" type="primary" onClick={handleOk}>
              <CheckOutlined /> Save User
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

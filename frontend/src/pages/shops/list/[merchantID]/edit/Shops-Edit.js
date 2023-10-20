import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  DatePicker,
  Form,
  InputNumber,
  Input,
  Select,
  message,
} from "antd";
import { PageHeader } from '@ant-design/pro-layout';
import { CheckOutlined } from "@ant-design/icons";
import moment from "moment";

import { useQuery, useMutation } from "@apollo/client";
import { shopDetail } from "server/query";
import { EditShop } from "server/mutation";

const { Option } = Select;

export default function ShopsEditPage() {
  const [shopform] = Form.useForm();
  const fields = [
    {
      name: "shopID",
      label: "Shop ID",
      type: "text",
    },
    {
      name: "name",
      label: "Shop Name",
      type: "text",
    },
    {
      name: "location",
      label: "Location",
      type: "text",
    },
    {
      name: "phone_number",
      label: "phone_number",
      type: "text",
    },
    {
      name: "game_type",
      label: "game_type",
      type: "text",
    },
    {
      name: "mode",
      label: "mode",
      type: "text",
    },
    {
      name: "revenue",
      label: "revenue",
      type: "number",
    },
    {
      name: "createdAt",
      label: "createdAt",
      type: "text",
    },
  ];
  const navigate = useNavigate();
  const location = useLocation()
  const pathArray = location.pathname.split("/");
  const shopID = pathArray[3];
  const shopName = pathArray[4];
  const [shopDetailData, setShopDetail] = useState({});
  const { loading, error, data, refetch } = useQuery(shopDetail, {
    variables: { _id: shopID },
  });

  useEffect(() => {
    if (loading === false) {
      setShopDetail(data.shopDetail);
      onFill(data.shopDetail);
    }
  }, [loading, data]);

  const onFill = (data) => {
    console.log("onFill");
    console.log(data);
    shopform.setFieldsValue({
      shopID: data._id,
      name: data.name,
      location: data.location,
      phone_number: data.phone_number,
      revenue: data.revenue,
      createdAt: data.createdAt,
      mode: data.mode,
      game_type: data.game_type,
      rest_banner: data.rest_banner,
    });
  };

  const [EditShopMutation] = useMutation(EditShop, {
    onCompleted(data) {
      console.log("data ", data);
      if (data.updateShop.error == null) {
        mutationSuccess("Shop updated.");
      } else {
        mutationFail(data.updateShop.error);
      }
    },
  });

  const handleOk = () => {
    // if (statusModal === 'create') {
    //     CreateNewAgent({ variables: { name: name, phoneNumber: mobile, email: email, password: password, agentLead: agentLeadId } })

    // }
    // if (statusModal === 'edit') {

    console.log("shopform, ", shopform);
    console.log("shopform, ", shopform.getFieldValue("mode"));
    console.log("shopform, ", shopform.game_type);
    let data = shopform.getFieldsValue([
      "shopID",
      "name",
      "location",
      "phone_number",
      "revenue",
      "mode",
      "game_type",
    ]);
    console.log("data, ", data);
    EditShopMutation({
      variables: {
        _id: shopID,
        name: data.name != null ? data.name : "",
        location: data.location != null ? data.location : "",
        phone_number: data.phone_number != null ? data.phone_number : "",
        mode: data.mode != null ? data.mode : "",
        game_type: data.game_type != null ? data.game_type : "",
        revenue: data.revenue != null ? data.revenue : "",
      },
    });
    // }
  };

  function mutationSuccess(text) {
    message.success(text);
    refetch();
  }

  function mutationFail(text) {
    message.error(text);
  }

  function onFormValuesChange(changedValues) {
    console.log("onFormValuesChange");

    // const formFieldName = Object.keys(changedValues)[0];
    // switch (formFieldName) {
    //     case "carBrand":
    //         form.setFieldsValue({ carModel: undefined, carModelVariant: undefined });
    //         break;
    //     case "carModel":
    //         form.setFieldsValue({ carModelVariant: undefined });
    //         break;
    // }
  }

  function getInputType(field) {
    switch (field.type) {
      case "text":
        return <Input placeholder={field.label} />;

      case "number":
        return <InputNumber style={{ width: "100%" }} />;

      case "select":
        return <Input placeholder={field.label} />;

      case "date":
        // return <DatePicker disabled={publishNow} showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss"), format: "HH:mm" }} />;
        return (
          <DatePicker
            showTime={{
              defaultValue: moment("00:00:00", "HH:mm:ss"),
              format: "HH:mm",
            }}
          />
        );

      default:
        return <Input placeholder={field.label} />;
    }
  }

  async function onFinish(values) {
    console.log("onFinish");
  }

  return (
    <div>
      <PageHeader
        title={shopDetailData.name}
        className="basic-pageheader"
        onBack={() => {
          navigate(`/shops/list/`);
        }}
      />
      <div className="form-container">
        <Form
          initialValues={{
            shopID: shopID,
            // createdAt: dayjs().format("DD-MM-YYYY hh:mm:ss a")
          }}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 12,
          }}
          form={shopform}
          name="shopform"
        >
          <Form.Item label="Shop ID" name="shopID">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Shop Name" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="location" name="location">
            <Input />
          </Form.Item>
          <Form.Item label="phone_number" name="phone_number">
            <Input />
          </Form.Item>
          <Form.Item label="game_type" name="game_type">
            <Input />
          </Form.Item>
          <Form.Item label="mode" name="mode">
            <Input />
          </Form.Item>
          <Form.Item label="revenue" name="revenue">
            <Input disabled />
          </Form.Item>
          <Form.Item label="createdAt" name="createdAt">
            <Input disabled />
          </Form.Item>

          <Form.Item style={{ textAlign: "end" }} wrapperCol={{ span: 24 }}>
            <Button key="submit" type="primary" onClick={handleOk}>
              <CheckOutlined /> Save Shop Details
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

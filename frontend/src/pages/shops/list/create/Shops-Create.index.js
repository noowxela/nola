import { Link, useNavigate  } from "react-router-dom"
import { Button, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select, message } from "antd"
import { PageHeader } from '@ant-design/pro-layout';
import { CheckOutlined } from "@ant-design/icons"


import { useMutation } from "@apollo/client";
import { createShop } from "server/mutation";
import moment from "moment";

export default function ReferralCreatePage() {
  const navigate  = useNavigate ()
  const [shopForm] = Form.useForm();

  const fields = [{
    name: "shopName",
    label: "SHOP NAME",
    type: "text",
  }, {
    name: "location",
    label: "Location",
    type: "text",
  }, {
    name: "phone_number",
    label: "phone_number",
    type: "text",
  }, {
    name: "addressLine1",
    label: "addressLine1",
    type: "text",
  }, {
    name: "state",
    label: "state",
    type: "text",
  }, {
    name: "postcode",
    label: "postcode",
    type: "int",
  }, {
    name: "district",
    label: "district",
    type: "text",
  }];

  const [CreateShopMutation] = useMutation(createShop, {
    onCompleted(data) {
      console.log("data ", data)
      // if (data.createShop) {
      if (data.createShop.error == null ) {
        mutationSuccess('Shop created.')
      } else {
        mutationFail(data.createShop.error)
      }
    }
  })
  
  function mutationSuccess(text){
    message.success(text);
      navigate('/shops/list');
  }

  function mutationFail(text){
    message.error(text);
  }

  function onFormValuesChange(changedValues) {
    const formFieldName = Object.keys(changedValues)[0];

    console.log("formFieldName ", formFieldName)
    // switch (formFieldName) {
    //     case "carBrand":
    //         form.setFieldsValue({ carModel: undefined, carModelVariant: undefined });
    //         break;
    //     case "carModel":
    //         form.setFieldsValue({ carModelVariant: undefined });
    //         break;
    // }
  }

  async function onFinish(values) {
    console.log("values, ", values)
    console.log("shopForm, ", shopForm)
    let data = shopForm.getFieldsValue(["shopName","location","phone_number","addressLine1","state","postcode","district"])
    console.log("data, ", data)
    CreateShopMutation({ variables: { 
      name: data.shopName != null ? data.shopName : "", 
      location: data.location != null ? data.location : "", 
      phone_number: data.phone_number != null ? data.phone_number : "",
      addressLine1: data.addressLine1 != null ? data.addressLine1 : "",
      state: data.state != null ? data.state : "",
      postcode: data.postcode != null ? parseInt(data.postcode) : 0,
      district: data.district != null ? data.district : "",
    }})
  }
  
  function getInputType(field) {
    switch (field.type) {
      case "text":
        return <Input placeholder={field.label} />;
      case "int":
        return <Input type="number" placeholder={field.label} />;
      case "number":
        return <InputNumber style={{ width: '100%' }} />;
      case "select":
        return <Input placeholder={field.label} />;
      case "date":
        return <DatePicker showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss"), format: "HH:mm" }} />;
      default:
        return <Input placeholder={field.label} />;
    };
  }

  return (
    <div>
      {/* <div className="breadcrumb-container">
        <Breadcrumb>
          <Breadcrumb.Item>
            Shop Management
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/shops/list`}>List of Shops</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Create shop
          </Breadcrumb.Item>
        </Breadcrumb>
      </div> */}
      <div className="page-header-container">
        <PageHeader
          title={"Create Shop"}
          onBack={() => {
            navigate('/shops/list');
          }}
        />
      </div>
      <Divider />
      <div className="form-container">
        <Form id="shopForm" form={shopForm} onFinish={onFinish} onValuesChange={onFormValuesChange}>

        {/* <Form
          initialValues={{
            // createdAt: dayjs().format("DD-MM-YYYY hh:mm:ss a")
          }}
          labelCol={{
            span: 4
          }}
          wrapperCol={{
            span: 12
          }}
        > */}
          {/* <Form.Item
            label="SHOP NAME"
            name="shopName"
          >
            <Input size="large" placeholder="Type Here"  />
          </Form.Item>
          <Form.Item
            label="LOCATION"
            name="location"
          >
            <Input size="large" placeholder="Choose Here"  />
          </Form.Item>
          <Form.Item
            label="Phone"
            name="phone"
          >
            <Input size="large" placeholder="1234556789"  />
          </Form.Item>
          
          <Divider/>
          <Form.Item style={{ textAlign: 'end' }} wrapperCol={{ span: 24 }}>
            <Button >
              Cancel
            </Button>
            <Button htmlType="submit" type="primary">
              Create <CheckOutlined />
            </Button>

          </Form.Item> */}
           <Row span={24} justify="space-between">
              {fields.map(field =>
                  <Col span={11}>
                      <Form.Item name={field.name} label={field.label} labelCol={{ span: 24 }}>
                          {getInputType(field)}
                      </Form.Item>
                  </Col>
              )}
              <Col span={24}>
                <Form.Item style={{ textAlign: 'end' }} wrapperCol={{ span: 24 }}>
                  {/* <Button key="submit" type="primary" onClick={handleOk} > */}
                  <Link to={`/shops/list`}>
                    <Button >
                      Cancel
                    </Button>
                  </Link>
                    {/* <CheckOutlined /> Cancel */}
                  <Button key="submit" type="primary"  onClick={onFinish} >
                    <CheckOutlined /> Create
                  </Button>
                </Form.Item>
              </Col>
          </Row>
        </Form>
      </div>
    </div>
  )
}
import React, { useEffect, useState } from 'react';
import { Table, message, Button } from 'antd';
import axios from 'axios';

const RequestSupport = () => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSupportRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/request-support/get-support-request`);
      if (response.data.success) {
        setSupportRequests(response.data.data);
      } else {
        message.error('Lổi fetch yêu cầu hổ trợ');
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  // Define table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'request_support_id',
      key: 'request_support_id',
    },
    {
      title: 'Nguời yêu cầu',
      dataIndex: ['UserAccount', 'full_name'],
      key: 'UserAccount.full_name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
        title: 'Thao tác',
        key: 'action',
        render: (text, record) => (
          <Button
            type='primary'
          >
            Xử lý yêu cầu
          </Button>
        ),
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20, fontSize: 20 }}>Danh sách yêu cầu hổ trợ</h2>
      <Table
        dataSource={supportRequests}
        columns={columns}
        rowKey="request_support_id"
        loading={loading}
        bordered
      />
    </div>
  );
};

export default RequestSupport;
import React from 'react';
import Layout from 'components/layout/Layout';
import LoginForm from 'components/forms/LoginForm';

export default function LoginPage() {
  return (
    <Layout title="login" header={false} footer={false} center>
      <LoginForm />
    </Layout>
  );
}

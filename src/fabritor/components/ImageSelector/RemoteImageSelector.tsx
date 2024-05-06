import { useState } from 'react';
import { Button, Input, Popover, Space } from 'antd';

export default function RemoteImageSelector (props) {
  const { onChange, ...rest } = props;
  const [url, setUrl] = useState('');

  const handleClick = () => {
    if (url) {
      onChange?.(url);
    }
  }

  return (
    <Popover
      content={
        <Space.Compact>
          <Input value={url} onChange={(e) => { setUrl(e.target.value) }} style={{ width: 260 }} />
          <Button onClick={handleClick}>Confirmar</Button>
        </Space.Compact>
      }
      title="Por favor insira a url:"
      trigger="click"
    >
      <Button type="primary" size="large" {...rest}>
        Adicionar de uma url
      </Button>
    </Popover>
  );
}
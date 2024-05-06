import { Button, Form, Input, InputNumber, QRCode, Radio, Collapse, Flex } from 'antd';
import AppSubPanel from './AppSubPanel';
import ColorSetter from '@/fabritor/UI/setter/ColorSetter/Solid';
import { useContext, useEffect, useRef, useState } from 'react';
import { createImage } from '@/editor/objects/image';
import { GloablStateContext } from '@/context';

const { Item: FormItem } = Form;

export default function QRCodePanel (props) {
  const { back } = props;
  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [QRCodeConfig, setQRCodeConfig] = useState({ value: 'fabritor' });
  const qrRef = useRef<HTMLDivElement>(null);
  const { editor } = useContext(GloablStateContext);

  const handleValuesChange = (values) => {
    setQRCodeConfig({
      ...QRCodeConfig,
      ...values
    });
  }

  const add2Canvas = () => {
    if (!QRCodeConfig.value || !qrRef.current) return;
    const canvasEl = qrRef.current.querySelector('canvas');
    if (!canvasEl) return;
    const img = new Image();
    img.onload = () => {
      createImage({
        imageSource: img,
        canvas: editor.canvas
      });
    }
    img.src = canvasEl.toDataURL();
  }

  useEffect(() => {
    form.setFieldsValue({
      value: 'fabritor',
      size: 160
    });
    form2.setFieldsValue({
      color: '#000000',
      bgColor: '#00000000',
      iconSize: 40,
      errorLevel: 'M'
    });
  }, []);

  return (
    <AppSubPanel title="Código QR" back={back}>
      <Form
        form={form}
        onValuesChange={handleValuesChange}
      >
        <FormItem name="value" label="Texto">
          <Input />
        </FormItem>
        <FormItem name="size" label="Tamanho (pixels)">
          <InputNumber />
        </FormItem>
      </Form>
      <Collapse
        items={[
          {
            key: '1',
            label: 'Outras configurações',
            children: (
              <Form
                form={form2}
                onValuesChange={handleValuesChange}
              >
                <FormItem name="color" label="cor">
                  <ColorSetter />
                </FormItem>
                <FormItem name="bgColor" label="Cor de fundo">
                  <ColorSetter />
                </FormItem>
                <FormItem name="errorLevel" label="Nível de correção de erros">
                  <Radio.Group options={['L', 'M', 'Q', 'H']} />
                </FormItem>
                <FormItem name="icon" label="Imagem integrada">
                  <Input placeholder="Imagem integrada" />
                </FormItem>
                <FormItem name="iconSize" label="Tamanho imagem">
                  <InputNumber />
                </FormItem>
              </Form>
            )
          }
        ]}
      />
      {
        QRCodeConfig.value ?
        <Flex vertical align="center" gap={10} style={{ marginTop: 16 }} ref={qrRef}> 
          <QRCode
            type="canvas"
            {...QRCodeConfig}
            style={{ maxWidth: 200 }}
          />
          <Button type="primary" onClick={add2Canvas}>Gerar QR Code</Button>
        </Flex> : null
      }
    </AppSubPanel>
  )
}
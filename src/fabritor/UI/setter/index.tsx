import { useContext } from 'react';
import { Divider, Layout, Typography } from 'antd';
import { GloablStateContext } from '@/context';
import { SKETCH_ID } from '@/utils/constants';
import SketchSetter from './SketchSetter';
import TextSetter from './TextSetter';
import IconSetter from './IconSetter';
import ImageSetter from './ImageSetter';
import { LineSetter, ShapeSetter } from './ShapeSetter';
import { CenterV } from '@/fabritor/components/Center';
import CommonSetter from './CommonSetter';
import GroupSetter from './GroupSetter';
import PathSetter from './PathSetter';
import RoughSetter from './RoughSetter';
import { SETTER_WIDTH } from '@/config';

const { Sider } = Layout;
const { Title } = Typography;

const siderStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#fff',
  borderLeft: '1px solid #e8e8e8'
};

export default function Setter () {
  const { object, isReady } = useContext(GloablStateContext);
  const objectType = object?.get?.('type') || '';
  console.log('objectType', objectType, object);

  const getRenderSetter = () => {
    if (!isReady) return null;
    if (!object || object.id === SKETCH_ID) return <SketchSetter />;
    
    // Verifica se o objeto tem data e tipo personalizado dentro de data
    const objectType = object.data && object.data.objectType ? object.data.objectType : object.type;

    switch (objectType) {
      case 'icon':
        return <IconSetter />;
      case 'textbox':
      case 'f-text':
        return <TextSetter />;
      case 'rect':
      case 'circle':
      case 'triangle':
      case 'polygon':
      case 'ellipse':  
        return <ShapeSetter />;
      case 'f-line':
      case 'f-arrow':
      case 'f-tri-arrow':
        return <LineSetter />;
      case 'f-image':
        return <ImageSetter />;
      case 'path':
        // Verificar subtipos específicos dentro de path
        if (object.data && object.data.sub_type === 'rough') {
          return <RoughSetter />
        }
        return <PathSetter />;
      case 'group':
        // Similar ao path, verificar subtipos para grupos
        if (object.data && object.data.sub_type === 'rough') {
          return <RoughSetter />
        }
        return <GroupSetter />;
      case 'activeSelection':
        return <GroupSetter />;
      default:
        return null;
    }
}


  const renderSetter = () => {
    const Setter = getRenderSetter();
    if (Setter) {
      return (
        <>
        {Setter}
        <Divider />
        </>
      )
    }
    return null;
  }

  const getSetterTitle = () => {
    if (!isReady) return null;
    if (!object || object.id === SKETCH_ID) return '画布';
    switch (objectType) {
      case 'textbox':
      case 'f-text':
        return '文字';
      case 'rect':
      case 'circle':
      case 'triangle':
      case 'polygon':
      case 'ellipse':  
        return '形状';
      case 'line':
      case 'f-line':
      case 'f-arrow':
      case 'f-tri-arrow':
        return '线条';
      case 'f-image':
        return '图片';
      case 'image':
        return '配置'
      case 'path':
        if (object?.sub_type) {
          if (object?.sub_type === 'rough') {
            return '手绘风格';
          }
          return '形状';
        }
        return '画笔'
      case 'group':
        if (object?.sub_type === 'rough') {
          return '手绘风格';
        }
        return '组合';
      case 'activeSelection':
        return '组合';
      default:
        return '画布';
    }
  }

  const renderSetterTitle = () => {
    const title = getSetterTitle();
    if (!title) {
      return null;
    }
    return (
      <CenterV style={{ borderBottom: '1px solid #e8e8e8', paddingLeft: 16 }}>
        <Title level={5}>
          {getSetterTitle()}
        </Title>
      </CenterV>
    )
  }

  return (
    <Sider
      style={siderStyle}
      width={SETTER_WIDTH}
      className="fabritor-sider"
    >
      {renderSetterTitle()}
      <div
        style={{ padding: 16 }}
      >
        {renderSetter()}
        <CommonSetter />
      </div>
    </Sider>
  )
}
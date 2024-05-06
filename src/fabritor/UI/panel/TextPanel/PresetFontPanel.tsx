import { Flex, Card } from 'antd';
import Title from '@/fabritor/components/Title';

const PRESET_FONT_LIST = [
  {
    label: <div style={{ fontSize: 30, fontFamily: 'SmileySans', fontWeight: 'bold' }}>Adicionar título</div>,
    key: 'title',
    config: {
      fontFamily: 'SmileySans',
      fontWeight: 'bold',
      fontSize: 120,
      text: 'Adicionar Título',
      top: 100
    }
  },
  {
    label: <div style={{ fontSize: 24, fontFamily: 'AlibabaPuHuiTi' }}>Adicionar legenda</div>,
    key: 'sub-title',
    config: {
      fontFamily: 'AlibabaPuHuiTi',
      fontWeight: 'bold',
      fontSize: 100,
      text: 'Adicionar legenda',
      top: 400
    }
  },
  {
    label: <div style={{ fontSize: 16, fontFamily: 'SourceHanSerif' }}>Adicione um texto</div>,
    key: 'content',
    config: {
      fontFamily: 'SourceHanSerif',
      fontSize: 80,
      text: 'Adicione um texto'
    }
  },
  {
    label: <div style={{ fontSize: 26, fontFamily: '霞鹜文楷', color: '#ffffff' , WebkitTextStroke: '1px rgb(255, 87, 87)' }}>Borda de texto</div>,
    key: 'content',
    config: {
      fontFamily: '霞鹜文楷',
      fontSize: 100,
      text: 'Borda de texto',
      fill: '#ffffff',
      stroke: '#ff5757',
      strokeWidth: 12
    }
  }
]

export default function PresetFontPanel (props) {
  const { addTextBox } = props;

  const handleClick = (item) => {
    addTextBox?.(item.config);
  }

  return (
    <Flex vertical gap={8} style={{ marginTop: 16 }}>
     
      {
        PRESET_FONT_LIST.map(item => (
          <Card
            key={item.key}
            hoverable
            onClick={() => { handleClick(item) }}
            bodyStyle={{
              padding: '12px 30px'
            }}
          >
            {item.label}
          </Card>
        ))
      }
    </Flex>
  );
}
import { useContext, useEffect, useRef } from 'react';
import { Button, Dropdown, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { downloadFile, base64ToBlob } from '@/utils';
import { GloablStateContext } from '@/context';
import LocalFileSelector from '@/fabritor/components/LocalFileSelector';
import { CenterV } from '@/fabritor/components/Center';
import { SETTER_WIDTH } from '@/config';
import { createClient } from '@supabase/supabase-js';

// Supabase Config
const supabaseUrl = 'https://uihyccnkgvvhkdvfuqsn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpaHljY25rZ3Z2aGtkdmZ1cXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIwOTg3OTAsImV4cCI6MjAyNzY3NDc5MH0.gSw8ake7dtFnjRU9roZoBUwAiVRVaCuEfAjRkJhHLvw'; // Substitua 'SUA_ANON_KEY_AQUI' pela sua chave anon do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const items: MenuProps['items'] = [
  {
    key: 'json',
    label: 'Baixar Modelo'
  },
  {
    key: 'publish',
    label: 'Salvar'
  }
];

export default function Export() {
  const { editor, setReady, setActiveObject } = useContext(GloablStateContext);
  const localFileSelectorRef = useRef<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTemplate();
    }, 2000); // Executa fetchTemplate após 2 segundos
  
    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [location.search, editor]);

  const fetchTemplate = async () => {
    const queryParams = new URLSearchParams(location.search);
    const docId = queryParams.get('t');
    if (docId) {
      const { data, error } = await supabase
        .from('template')
        .select('url')
        .eq('id', docId)
        .single();

      if (error) {
        message.error('Erro ao carregar o template: ' + error.message);
      } else if (data) {
        fetch(data.url)
          .then(response => {
            if (!response.ok) {
              throw new Error('Falha ao carregar o template');
            }
            return response.text();
          })
          .then(jsonStr => {
            loadEditorWithJSON(jsonStr);
          })
          .catch(err => message.error('Erro ao carregar o template: ' + err.message));
      }
    } else {
      message.error('Documento não encontrado');
    }
  };

  const loadEditorWithJSON = (jsonStr) => {
    if (editor) {
      setReady(false);
      editor.loadFromJSON(jsonStr, true);
      editor.fhistory.reset();
      setReady(true);
      setActiveObject(null);
      editor.fireCustomModifiedEvent();
    } else {
      message.error("Editor não está disponível.");
    }
  };

  const selectJsonFile = () => {
    localFileSelectorRef.current?.start?.();
  };

  const handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const json = evt.target?.result as string;
      loadEditorWithJSON(json);
    };
    reader.readAsText(file);
  };

  const handleClick = async ({ key }) => {
    const { sketch } = editor;
    const name = encodeURIComponent(sketch.fabritor_desc);
    switch (key) {
      case 'publish':
  const publishImage = editor.export2Img({ format: 'jpg' });
  const blob = await base64ToBlob(publishImage, 'image/jpeg');
  
  let formData = new FormData();
  formData.append('file', blob, `${name}.jpg`);

  // Upload do arquivo para o bucket 'imgs' no Supabase Storage
  const uploadUrl = `${supabaseUrl}/storage/v1/object/imgs/public/${name}.jpg`;
  let uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'apikey': supabaseAnonKey
    },
    body: formData
  });

  if (!uploadResponse.ok) {
    const uploadError = await uploadResponse.json();
    message.error('Erro ao publicar 1: ' + uploadError.message);
    return;
  }

  // Extrair URL pública do arquivo após upload
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/imgs/public/${name}.jpg`;

  // Inserir a URL pública no banco de dados 'criativo'
  const insertUrl = `${supabaseUrl}/rest/v1/criativo`;
  let insertResponse = await fetch(insertUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'apikey': supabaseAnonKey
    },
    body: JSON.stringify([{ url: publicUrl }])
  });

  if (!insertResponse.ok) {
    const dbError = await insertResponse.json();
    message.error('Erro ao publicar: ' + dbError.message);
  } else {
    message.success('Publicado com sucesso');
    window.parent.postMessage({
      type: 'editorPublish',
      data: {
          url: publicUrl,
          docId: name  // Usando o nome como identificador se necessário
      }
    }, 'https://your-specific-domain.com'); // Use specific domain in production for security
  }
  break;
      default:
        break;
    }
  };

  return (
    <CenterV
      justify="flex-end"
      gap={16} // Certifique-se de que o componente CenterV aceita estas props diretamente.
      style={{
        width: SETTER_WIDTH,
        paddingRight: 16
      }}
    >
      <Button onClick={selectJsonFile}>
        Importar
      </Button>
      <Dropdown 
        menu={{ items, onClick: handleClick }} // Verifique se a propriedade 'menu' é suportada desta maneira pelo componente Dropdown.
        arrow={{ pointAtCenter: true }}
        placement="bottom"
      >
        <Button type="primary" icon={<ExportOutlined />}>Exportar</Button>
      </Dropdown>
      <LocalFileSelector accept="application/json" ref={localFileSelectorRef} onChange={handleFileChange} />
    </CenterV>
  );
}

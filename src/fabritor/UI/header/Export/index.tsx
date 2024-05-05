import { useContext, useEffect, useRef } from 'react';
import { Button, Dropdown, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { downloadFile, base64ToBlob } from '@/utils';
import { GloablStateContext } from '@/context';
import LocalFileSelector from '@/fabritor/components/LocalFileSelector';
import { CenterV } from '@/fabritor/components/Center';
import { SETTER_WIDTH } from '@/config';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';



// Firebase Config (Substitua com sua configuração)
const firebaseConfig = {
  apiKey: 'AIzaSyCOFnMiSFUQTc0AS9Bp4BiExVvvv9Lcdl0',
  authDomain: 'editor-promov.firebaseapp.com',
  projectId: 'editor-promov',
  storageBucket: 'editor-promov.appspot.com',
  messagingSenderId: '850159332777',
  appId: '1:850159332777:web:7d330c25bf4ebd7a6ca8b8',
};

// Inicialize o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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
      // Coloque aqui o código que você quer executar após o delay
      fetchTemplate();
    }, 2000); // Executa fetchTemplate após 2 segundos
  
    return () => clearTimeout(timer); // Limpa o timer se o componente for desmontado
  }, [location.search, editor]);

  const fetchTemplate = async () => {
    const queryParams = new URLSearchParams(location.search);
    const docId = queryParams.get('t');
    console.log(`PARAMETRO: ${docId}`);
    const docRef = firebase.firestore().collection('template').doc(docId);
    const doc = await docRef.get();
    console.log('Template:', doc.data()); // Chamada correta para visualizar os dados
  
    if (doc.exists) {
      const { url } = doc.data(); // Acessando os dados corretamente
      console.log('URL do Template:', url); // Verifique se o URL está sendo obtido corretamente
  
      fetch(url)
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
    } else {
      message.error('Documento não encontrado v3');
    }
  };
  

  const loadEditorWithJSON = (jsonStr) => {
    if (editor) {
      setReady(false);
      editor.loadFromJSON(jsonStr, true);  // Certifique-se de chamar o método do objeto editor
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
    // @ts-ignore
    const name = sketch.fabritor_desc;
    switch (key) {
        case 'png':
            const png = editor.export2Img({ format: 'png' });
            downloadFile(png, 'png', name);
            break;
        case 'jpg':
            const jpg = editor.export2Img({ format: 'jpg' });
            downloadFile(jpg, 'jpg', name);
            break;
        case 'publish':
            const publishImage = editor.export2Img({ format: 'jpg' });
            const blob = await base64ToBlob(publishImage);
            const storageRef = firebase.storage().ref();
            const imageRef = storageRef.child('images/' + name + '.jpg');
            try {
                const snapshot = await imageRef.put(blob);
                const url = await snapshot.ref.getDownloadURL();
                const docRef = await firebase.firestore().collection('criativos').add({
                    url: url
                });
                window.parent.postMessage({
                    type: 'editorPublish',
                    data: {
                        url: url,
                        docId: docRef.id
                    }
                }, '*'); // Use specific domain instead of '*' in production for security
                message.success('Publicado com sucesso');
            } catch (error) {
                message.error('Erro ao publicar: ' + error.message);
            }
            break;
        case 'svg':
            const svg = editor.export2Svg();
            downloadFile(svg, 'svg', name);
            break;
        case 'json':
            const json = editor.canvas2Json();
            downloadFile(`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json, null, 2))}`, 'json', name);
            break;
        case 'clipboard':
            copyImage();
            break;
        default:
            break;
    }
};

  return (
    <CenterV
      justify="flex-end"
      gap={16}
      style={{
        width: SETTER_WIDTH,
        paddingRight: 16
      }}
    >
      <Button onClick={selectJsonFile}>
        Importar
      </Button>
      <Dropdown 
        menu={{ items, onClick: handleClick }} 
        arrow={{ pointAtCenter: true }}
        placement="bottom"
      >
        <Button type="primary" icon={<ExportOutlined />}>Exportar</Button>
      </Dropdown>
      <LocalFileSelector accept="application/json" ref={localFileSelectorRef} onChange={handleFileChange} />
    </CenterV>
  );
}

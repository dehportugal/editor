import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faCamera, faHeart, faHome, faCar } from '@fortawesome/free-solid-svg-icons';
import { fabric } from 'fabric';
import '@fortawesome/fontawesome-svg-core/styles.css';


import { Button } from 'antd';
import { createTextbox } from '@/editor/objects/textbox';
import { useContext } from 'react';
import { GloablStateContext } from '@/context';



    
export default function IconPanel() {
    const  globalState  = useContext(GloablStateContext);
  
  if (!globalState || !globalState.editor) {
    return null; // ou throw new Error('GlobalStateContext or editor not found');
  }
  
  const { editor } = globalState;
  
  const handleAddIcon = async (iconDef) => {
    // FontAwesome ícones são baseados em texto, aqui usamos o código Unicode do ícone.
    const iconUnicode = String.fromCharCode(parseInt(iconDef.icon[3], 16));
    
    // Carregar a fonte antes de adicionar o ícone
    await document.fonts.load('10pt "Font Awesome 5 Free"');
  
    // Criar o elemento de texto depois que a fonte foi carregada
    const iconElement = new fabric.Text(iconUnicode, {
      left: 100,
      top: 100,
      fontFamily: 'FontAwesome',
      fontWeight: '900',
      fontSize: 40,
      fill: 'black',
      data: { objectType: 'icon' } // Armazenando dados personalizados
    });
    // Adicionar o ícone ao canvas e renderizar
    editor.canvas.add(iconElement);
    editor.canvas.renderAll();
  };
  
  
  
  // Array de ícones do FontAwesome para serem usados
  const icons = [faCoffee, faCamera, faHeart, faHome, faCar];
  
  return (
    <div className="fabricator-panel-wrapper" style={{ backgroundColor: 'white' }}>
      {icons.map((icon, index) => (
        <button key={index} onClick={() => handleAddIcon(icon)}>
          <FontAwesomeIcon icon={icon} /> Add {icon.iconName}
        </button>
      ))}
    </div>
  );
}

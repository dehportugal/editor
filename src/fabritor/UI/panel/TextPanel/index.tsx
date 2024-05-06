import { Button } from 'antd';
import PresetFontPanel from './PresetFontPanel';
import { createTextbox } from '@/editor/objects/textbox';
import { useContext } from 'react';
import { GloablStateContext } from '@/context';

export default function TextPanel () {
  const { editor } = useContext(GloablStateContext);
  
  const handleAddText = async (options) => {
    await createTextbox({  ...options, canvas: editor.canvas });
  }

  return (
    <div className="fabritor-panel-wrapper">
     
      <PresetFontPanel addTextBox={handleAddText} />
    </div>
  )
}
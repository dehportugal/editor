import { CenterV } from '@/fabritor/components/Center';
import { PANEL_WIDTH } from '@/config';

export default function Logo() {
  return (
    <CenterV gap={5} style={{ width: PANEL_WIDTH, paddingLeft: 16 }}>
      <img src="D:/projects/canva-editor/fabritor-web/logo.jpeg" style={{ width: 200 }} alt="Logotipo" />
      <span style={{ fontWeight: 'bold', fontSize: 14 }}>
        Impulsione no modo easy
      </span>
    </CenterV>
  )
}

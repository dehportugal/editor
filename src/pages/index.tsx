import { definePageConfig } from 'ice';
import Fabritor from '@/fabritor';

export const pageConfig = definePageConfig(() => ({
  title:'Impulsione no modo easy'
}));

export default function () {
  return <Fabritor />;
}

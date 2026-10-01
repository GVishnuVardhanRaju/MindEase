import { createFileRoute } from '@tanstack/react-router';
import { Legal } from '@/components/ContentPages';
export const Route = createFileRoute('/privacy')({
  head: () => ({meta:[
    {title:'Privacy policy — MindEase AI'},
    {name:'description',content:'Understand how MindEase AI stores check-ins locally in your browser.'},
    {property:'og:title',content:'Privacy policy — MindEase AI'},
    {property:'og:description',content:'Understand how MindEase AI stores check-ins locally in your browser.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Legal kind="privacy"/>
});

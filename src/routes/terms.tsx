import { createFileRoute } from '@tanstack/react-router';
import { Legal } from '@/components/ContentPages';
export const Route = createFileRoute('/terms')({
  head: () => ({meta:[
    {title:'Terms of use — MindEase AI'},
    {name:'description',content:'Read the educational-use boundaries of MindEase AI.'},
    {property:'og:title',content:'Terms of use — MindEase AI'},
    {property:'og:description',content:'Read the educational-use boundaries of MindEase AI.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Legal kind="terms"/>
});

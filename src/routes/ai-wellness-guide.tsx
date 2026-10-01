import { createFileRoute } from '@tanstack/react-router';
import { Guide } from '@/components/ToolsPages';
export const Route = createFileRoute('/ai-wellness-guide')({
  head: () => ({meta:[
    {title:'Wellness guide — MindEase AI'},
    {name:'description',content:'Ask educational questions about anxiety and coping with a local self-guided assistant.'},
    {property:'og:title',content:'Wellness guide — MindEase AI'},
    {property:'og:description',content:'Ask educational questions about anxiety and coping with a local self-guided assistant.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Guide/>
});

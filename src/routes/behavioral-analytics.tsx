import { createFileRoute } from '@tanstack/react-router';
import { Analytics } from '@/components/ToolsPages';
export const Route = createFileRoute('/behavioral-analytics')({
  head: () => ({meta:[
    {title:'Behavioral analytics — MindEase AI'},
    {name:'description',content:'Explore illustrative ARI, RPS, and trigger metrics with interactive charts.'},
    {property:'og:title',content:'Behavioral analytics — MindEase AI'},
    {property:'og:description',content:'Explore illustrative ARI, RPS, and trigger metrics with interactive charts.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Analytics/>
});

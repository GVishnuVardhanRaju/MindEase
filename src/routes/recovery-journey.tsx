import { createFileRoute } from '@tanstack/react-router';
import { Journey } from '@/components/ToolsPages';
export const Route = createFileRoute('/recovery-journey')({
  head: () => ({meta:[
    {title:'90-day wellness journey — MindEase AI'},
    {name:'description',content:'Explore three flexible phases of awareness, resilience, and growth.'},
    {property:'og:title',content:'90-day wellness journey — MindEase AI'},
    {property:'og:description',content:'Explore three flexible phases of awareness, resilience, and growth.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Journey/>
});

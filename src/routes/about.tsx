import { createFileRoute } from '@tanstack/react-router';
import { About } from '@/components/ContentPages';
export const Route = createFileRoute('/about')({
  head: () => ({meta:[
    {title:'About MindEase AI — MindEase AI'},
    {name:'description',content:'Learn the mission, boundaries, and creator of MindEase AI.'},
    {property:'og:title',content:'About MindEase AI — MindEase AI'},
    {property:'og:description',content:'Learn the mission, boundaries, and creator of MindEase AI.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <About/>
});

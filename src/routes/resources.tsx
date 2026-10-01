import { createFileRoute } from '@tanstack/react-router';
import { Resources } from '@/components/ContentPages';
export const Route = createFileRoute('/resources')({
  head: () => ({meta:[
    {title:'Support resources — MindEase AI'},
    {name:'description',content:'Find reputable mental health resources and professional support information.'},
    {property:'og:title',content:'Support resources — MindEase AI'},
    {property:'og:description',content:'Find reputable mental health resources and professional support information.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Resources/>
});

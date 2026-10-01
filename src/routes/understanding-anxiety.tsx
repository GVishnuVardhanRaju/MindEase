import { createFileRoute } from '@tanstack/react-router';
import { Understanding } from '@/components/ContentPages';
export const Route = createFileRoute('/understanding-anxiety')({
  head: () => ({meta:[
    {title:'Understanding anxiety — MindEase AI'},
    {name:'description',content:'Learn about anxiety, symptoms, myths, and when to seek professional support.'},
    {property:'og:title',content:'Understanding anxiety — MindEase AI'},
    {property:'og:description',content:'Learn about anxiety, symptoms, myths, and when to seek professional support.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Understanding/>
});

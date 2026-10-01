import { createFileRoute } from '@tanstack/react-router';
import { Disorders } from '@/components/ContentPages';
export const Route = createFileRoute('/anxiety-disorders')({
  head: () => ({meta:[
    {title:'Anxiety-related experiences — MindEase AI'},
    {name:'description',content:'Explore educational overviews of common anxiety patterns and professional support.'},
    {property:'og:title',content:'Anxiety-related experiences — MindEase AI'},
    {property:'og:description',content:'Explore educational overviews of common anxiety patterns and professional support.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Disorders/>
});

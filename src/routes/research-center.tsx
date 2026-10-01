import { createFileRoute } from '@tanstack/react-router';
import { Research } from '@/components/ContentPages';
export const Route = createFileRoute('/research-center')({
  head: () => ({meta:[
    {title:'Research center — MindEase AI'},
    {name:'description',content:'Read research-inspired behavioral science and trustworthy mental health resources.'},
    {property:'og:title',content:'Research center — MindEase AI'},
    {property:'og:description',content:'Read research-inspired behavioral science and trustworthy mental health resources.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Research/>
});

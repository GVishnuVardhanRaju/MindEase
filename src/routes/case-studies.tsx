import { createFileRoute } from '@tanstack/react-router';
import { Cases } from '@/components/ContentPages';
export const Route = createFileRoute('/case-studies')({
  head: () => ({meta:[
    {title:'Educational case studies — MindEase AI'},
    {name:'description',content:'Browse 100 original educational anxiety case studies.'},
    {property:'og:title',content:'Educational case studies — MindEase AI'},
    {property:'og:description',content:'Browse 100 original educational anxiety case studies.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Cases/>
});

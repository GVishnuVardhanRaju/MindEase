import { createFileRoute } from '@tanstack/react-router';
import { Contact } from '@/components/ContentPages';
export const Route = createFileRoute('/contact')({
  head: () => ({meta:[
    {title:'Contact and support — MindEase AI'},
    {name:'description',content:'Find the right support and learn about this educational project.'},
    {property:'og:title',content:'Contact and support — MindEase AI'},
    {property:'og:description',content:'Find the right support and learn about this educational project.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Contact/>
});

import { createFileRoute } from '@tanstack/react-router';
import { Tracker } from '@/components/ToolsPages';
export const Route = createFileRoute('/progress-tracker')({
  head: () => ({meta:[
    {title:'Progress tracker — MindEase AI'},
    {name:'description',content:'Privately track mood, stress, sleep, activity, and reflections.'},
    {property:'og:title',content:'Progress tracker — MindEase AI'},
    {property:'og:description',content:'Privately track mood, stress, sleep, activity, and reflections.'},
    {property:'og:type',content:'website'},
    {name:'twitter:card',content:'summary_large_image'}
  ]}),
  component: () => <Tracker/>
});

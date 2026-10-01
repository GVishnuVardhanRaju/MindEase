import { createContext,useContext,useEffect,useState } from 'react';
import { readCheckIns,saveCheckIn,sample,type CheckIn } from '@/lib/wellness';
const Context=createContext<{entries:CheckIn[];isDemo:boolean;add:(entry:CheckIn)=>void}>({entries:sample,isDemo:true,add:()=>{}});
export function WellnessProvider({children}:{children:React.ReactNode}) {const [saved,setSaved]=useState<CheckIn[]>([]);useEffect(()=>setSaved(readCheckIns()),[]);return <Context.Provider value={{entries:saved.length?saved:sample,isDemo:!saved.length,add:(entry)=>setSaved(saveCheckIn(entry))}}>{children}</Context.Provider>}
export const useWellness=()=>useContext(Context);

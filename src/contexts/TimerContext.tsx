import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth, database } from "../services/firebase";
import { authContext } from "./AuthContext";

interface TimerContextData{
  startTime:number,
  endTime:number,
  isTimeOn: boolean,
  time:number
  timestamps : any[]
  handleStartTimer: () => void
  handlePauseTimer: () => void
}
interface TimerProviderProps {
  children: ReactNode;
}
export const timerContext = createContext({} as TimerContextData);
export function TimerProvider({children} : TimerProviderProps){
  const [time, setTime] = useState(0);
  const [isTimeOn, setIsTimeOn] = useState(false);
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)
  const [timestamps, setTimestamps] = useState<any>([])
  const {user, signInWithGoogle} = useContext(authContext)

  const handleStartTimer = () => {
    setIsTimeOn(true)
    setStartTime(Date.now())
    }
  const handlePauseTimer = () => {
    setEndTime(Date.now())
    setIsTimeOn(false)
  }

  useEffect(() => {
    let interval = null as any
    if (isTimeOn) {
      interval = setInterval(() => {
        let inter = Date.now() - startTime
        setTime(inter)
        
      }, 1);
    }
     else if (!isTimeOn) {
      clearInterval(interval);
    }
    // if(!isTimeOn){
    //   const fetchData = async ()=>{
    //     const querySnapshot = await database.ref('timestamps').get()
    //     setTimestamps(querySnapshot.docs.map( (doc) =>  ( {id: doc.id, data: doc.data()})))
    //     console.log(timestamps)
    //   }
    //   fetchData();
    // }

    return () => clearInterval(interval);
    
  }, [isTimeOn]); 
  return(
    <timerContext.Provider value={{startTime, endTime, timestamps, isTimeOn, handleStartTimer, handlePauseTimer, time}}>
      {children}
    </timerContext.Provider>
  )

}
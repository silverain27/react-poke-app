import { useEffect } from "react";

export default function useOnclickOutside(ref, handler ){

    useEffect(()=>{
        const listener =(event)=>{
            console.log(event)
            //모달 안을 클릭했는지 확인한다. 
            if(!ref.current || ref.current.contains(event.target)){
                return;
            }
            handler()

        }
        document.addEventListener('mousedown', listener)


        return () => {
            document.removeEventListener('mousedown', listener)
        }
    }, [ref,handler])

}
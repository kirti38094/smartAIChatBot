       import React from 'react'
import "../App.css"

import { RiImageAddLine } from "react-icons/ri";
import { BsChatLeftQuote } from "react-icons/bs";
import { LuPlus } from "react-icons/lu";
import { IoArrowUpSharp } from "react-icons/io5";
import { useContext } from 'react';
import { dataContext,prevUser ,user} from '../context/UserContext';
import { generateResponse } from '../gemini';
import Chat from './Chat';



function Home(){
    let {startRes,setStartRes,popUp,setPopUp,input,setInput,feature,setFeature,showResult,setShowResult,prevFeature,setPrevFeature} = useContext(dataContext)
    async function handleSubmit(e){
        setStartRes(true);
        setPrevFeature(feature);
        setShowResult("")
        prevUser.data = user.data;
        prevUser.mime_type = user.mime_type;
        prevUser.imgUrl = user.imgUrl;
        prevUser.prompt= input;
          user.data= null;
            user.mime_type = null;
            user.imgUrl = null;
        setInput("");
        let result = await generateResponse();
        setShowResult(result);
         setFeature("chat");
       
    }
    function handleImage(e){
        setFeature("upimg");
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload=(event)=>{
            let base64 = event.target.result.split(",")[1];
            user.data= base64;
            user.mime_type = file.type;
            user.imgUrl = `data:${user.mime_type};base64,${user.data}`
        }
        
        reader.readAsDataURL(file)
    }
  

    return(
        <div className='home'>
            <nav>
                <div className='logo'onClick={()=>{
                    setStartRes(false);
                    setFeature("chat");
                     user.data= null;
            user.mime_type = null;
            user.imgUrl = null;
            setPopUp(false)
                }}>
                   Smart AI Bot 
                </div>
            </nav>
               <input type="file" accept='image/*'hidden id="inputImg"onChange={handleImage} />
            {!startRes? <div className='hero'>
                <span id="tag">What can I help with ?</span>
                <div className='category'>
                    <div className="upImg"onClick={()=>{
                        document.getElementById("inputImg").click();
                    }}>
                        <RiImageAddLine />
                        <span>Upload Image</span>
                    </div>
                    <div className="chatImg"onClick={()=>setFeature("chat")}>
                        <BsChatLeftQuote />
                         <span>Let's Chat</span>
                    </div>
                </div>
            </div>
            :
            <Chat />
            }
         
           
            <form className="input-box" onSubmit={(e)=>{
                  e.preventDefault();
                if(input){
                      handleSubmit(e);
                    }
                    }}
            >
                <img src={user.imgUrl} alt=""id="im"/>
                {popUp? <div className="pop-up">
                    <div className="select-up"onClick={()=>{
                        setPopUp(false);
                        setFeature("chat")
                        document.getElementById("inputImg").click();
                    }}>
                         <RiImageAddLine />
                        <span>Upload Image</span>
                    </div>
                    
                </div>:null}
               
                <div id="add" onClick={()=>{
                    setPopUp(prev=>!prev)
                }}>
                    <LuPlus />
              
                </div>
                <input type="text"placeholder='Ask Something...'onChange={(e)=>setInput(e.target.value)} value={input}/>
                {input? <button id="submit">
                    <IoArrowUpSharp />
                </button>:null}
               
            </form>
        </div>
    )
}
export default Home
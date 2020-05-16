import React, { useState, useEffect, useCallback, useRef } from "react";
import "./style.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';
const randomColor = require('randomcolor');

interface IWheelItem {
  description: string;
  color: string;
  rotationValue?: number;
  id: string;
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function deg2rad(deg: number): number {
  return (deg * Math.PI) / 180;
}

const degree = rand(0, 360);

const WheelOfFortune: React.FC = () => {
  const [circleClass, setCircleClass] = useState("circle");
  const [wheelItems, setWheelItems] = useState<IWheelItem[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [pageHeight, setPageHeight] = useState<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);



  useEffect(() => {
    //document.getElementById("cont")?.setAttribute('height', '100vh');
    function updateHeight(){
      setPageHeight(document.body.scrollHeight);
      console.log(document.body.scrollHeight);
    }
    window.addEventListener('scroll', updateHeight);

    return () => {window.removeEventListener('scroll', updateHeight);}
  },[]);



  //rotation
  function startRotation() {
    setCircleClass("circle start-rotation");
    setTimeout(() => {
      setCircleClass("circle start-rotation stop-rotation");
    }, Math.floor(Math.random() * 10000) + 1);
  }

  function addNewItem(text: string) {
    if(text !== ''){
      setInputText('');
      //startRotation();
      let newWheelItems: IWheelItem[] = [
        ...wheelItems,
        { 
          description: text, 
          color: randomColor({
            luminosity: 'dark', 
            format: 'rgba',
            alpha: 1
          }), 
          id:uuidv4() },
      ];
  
      setWheelItems(newWheelItems);
      console.log(newWheelItems);
    }
  }


  const drawSlice = useCallback((deg: number, color: string, text:string) => {
    if (!canvasRef.current) {
        return;
      }
      const canvas: HTMLCanvasElement = canvasRef.current;
      const ctx = canvas.getContext("2d");
  
      const width = canvas.width;
      const center = width/2;
      const sliceDeg = 360 / wheelItems.length;
  
      if (ctx) {
        ctx.beginPath();
        ctx.fillStyle = color;
        //ctx.fillText(text, center, deg2rad(deg));
      
        ctx.moveTo(center, center);
        ctx.arc(center, center, width / 2, deg2rad(deg), deg2rad(deg + sliceDeg));
        ctx.lineTo(center, center);
        ctx.fill();
      
      }
  },[wheelItems.length])

  const  drawSlices = useCallback((wheelItems: IWheelItem[]) =>{

    if (!canvasRef.current) {
        return;
      }

    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0,0, canvas.width, canvas.width);

    let newDeg = degree;
    for (let i=0; i < wheelItems.length; i++){
        drawSlice(newDeg, wheelItems[i].color, wheelItems[i].description);
        newDeg += (360/wheelItems.length);
    }
  },[drawSlice]);


  useEffect(() => {
    drawSlices(wheelItems)
  },[drawSlices, wheelItems]);

  const handleChangeInput = (e: any) => {setInputText(e)};

  function removeItem(id: string) {
    const filteredWheel: IWheelItem[] = wheelItems.filter((item) => item.id !== id); 

    setWheelItems(filteredWheel);
    //console.log(newWheelItems);
  }

  return (
    <div id="cont" className="container" style={{height: pageHeight > 0 ? `${pageHeight}px`: '100vh'}}>
      <h1 className="mt-5 mb-3">Wheel of fortune</h1>
      <div className="mb-3 wheel-container">
        <div id="wheel" 
          className={circleClass}
          onClick={startRotation}>
          <canvas id="canvas" ref={canvasRef}  height="300" />
        </div>
      </div>
      <div className="players-container">
    
        <div className="custom-input-group">
          <input 
            type="text" 
            id="input-name" 
            placeholder="Insert a new name"
            value={inputText} onChange={(e) => handleChangeInput(e.target.value)}/>
          <div className="plus-box" onClick={() => addNewItem(inputText)}>
            <FontAwesomeIcon className="plus-icon" icon={faPlus}/>
          </div>
        </div>
        <div id="players-list" className="players-list mt-3 mb-4">
          <ul>
            {
              wheelItems.length > 0 &&
              wheelItems.map((item) =>{
                return <li 
                  className="d-flex align-items-center my-li justify-content-between my-3"
                  style={{color: item.color, fontWeight: 'bold'}}
                  key={item.id}>
                  {item.description}
                  <FontAwesomeIcon 
                    color={item.color} 
                    icon={faTimes}
                    onClick={() => removeItem(item.id)}/>
                </li>
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WheelOfFortune;

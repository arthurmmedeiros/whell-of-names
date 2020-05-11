import React, { useState, useEffect, useCallback, useRef } from "react";
import "./style.css";
const randomColor = require('randomcolor');

interface IWheelItem {
  description: string;
  color: string;
  rotationValue?: number;
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
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  //rotation
  function startRotation() {
    setCircleClass("circle start-rotation");
    setTimeout(() => {
      setCircleClass("circle start-rotation stop-rotation");
    }, Math.floor(Math.random() * 10000) + 1);
  }

  function addNewItem() {
    startRotation();
    let newWheelItems: IWheelItem[] = [
      ...wheelItems,
      { description: "test", color: randomColor() },
    ];

    newWheelItems = newWheelItems.map((item) => ({
      description: item.description,
      color: item.color,
      rotationValue: 360 / newWheelItems.length,
    }));

    setWheelItems(newWheelItems);
    console.log(newWheelItems);
  }

  const drawSlice = useCallback((deg: number, color: string) => {
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
        drawSlice(newDeg, wheelItems[i].color);
        newDeg += (360/wheelItems.length);
    }
  },[drawSlice]);


  useEffect(() => {
    drawSlices(wheelItems)
  },[drawSlices, wheelItems]);



  return (
    <div>
      <div id="wheel" className={circleClass}>
        <canvas ref={canvasRef} width="400" height="400" />
      </div>
      <button type="button" className="spin-button" onClick={addNewItem}>
        Spin
      </button>
    </div>
  );
};

export default WheelOfFortune;

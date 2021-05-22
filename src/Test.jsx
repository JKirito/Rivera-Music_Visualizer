import React, { useRef, useEffect, useState } from 'react'

function Test() {
    const canvasRef = useRef();
    // const [x, setX] = useState(1);
    useEffect(() => {
        let canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.7;
        let ctx = canvas.getContext('2d');
        draw();
    }, [])
    let x = 1;
    const draw = () => {
        let canvas = canvasRef.current;
        let ctx = canvas.getContext('2d');
        // console.log(x)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        // ctx.clearRect(20, 20, 100, 50);
        ctx.fillRect(x, 0, 300, 150);
        // ctx.clearRect(20, 20, 100, 50);
        // ctx.rect(300, 10, 100, 100)
        // ctx.fill();
        x += 1;
        requestAnimationFrame(draw)
    }
    return (
        <>
            <canvas ref={canvasRef}></canvas>
        </>
    )
}

export default Test

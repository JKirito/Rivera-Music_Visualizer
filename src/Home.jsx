import React, { useEffect, useRef, useState } from 'react'

function Home() {
    const [audioFile, setAudioFile] = useState(null);
    const [isHome, setIsHome] = useState(true);


    const selectFile = () => {
        let input = document.createElement('input')
        input.type = 'file'
        input.accept = "audio/*"
        // let file;
        input.onchange = () => {
            console.log(input.files);
            if (input.files[0]) {
                // history.push(`/visualize/${input.files[0]}`);
                setAudioFile(input.files[0]);
                setIsHome(false);
            }
        }
        input.click();
    }
    return (
        <>
            {
                isHome ? < HomeUI selectFile={selectFile} /> : <VisualizeUI audioFile={audioFile} setIsHome={setIsHome} />
            }
        </>
    );

}

const HomeUI = ({ selectFile }) => {
    return (
        <div className='mainContainer'>
            <div className='bg'></div>
            <header>
                <h4>Rivera</h4>
                <span>Song Visualizer</span>
            </header>
            <section id='mainsection'>
                <span id='s_own'>Your Own</span>
                <span id='s_sound'>Sound Visualizer</span>
            </section>
            <section id='secondarysection'>
                <span>Simple and Easy Steps</span>
                <ul>
                    <li>Pick A Song</li>
                    <li>Visualize</li>
                    <li>Download Frames</li>
                </ul>
            </section>
            <footer>
                <div>
                    <button onClick={selectFile}>
                        <div className='fas fa-plus' style={{ marginRight: "6px" }}></div>
                        <span>
                            Pick a Song
                        </span>
                    </button>
                </div>
            </footer>
        </div>
    );
}

const VisualizeUI = ({ audioFile, setIsHome }) => {
    const audioRef = useRef();
    const canvasRef = useRef();
    // const requestRef = React.useRef()
    const [canvas, setCanvas] = useState(null);
    const [taudio, setAudio] = useState(null);
    let audioSource;
    let analyser;
    const audioCTX = new AudioContext();
    var audio = new Audio();
    let x = 0;
    let src;
    let bufferLength;
    let dataArray;
    let barWidth = 10;
    let barHeight = 15;
    let animFrame = 0;

    useEffect(() => {
        // audioRef.current.src = URL.createObjectURL(audioFile)
        // audioRef.current.play();
        barWidth = canvasRef.current.width / bufferLength
        setCanvas(canvasRef.current)
        src = URL.createObjectURL(audioFile);
        audio.src = src;
        setAudio(audio);
        audio.play();
        audio.addEventListener('ended', () => {
            setTimeout(() => {
                // alert(animFrame)
                cancelAnimationFrame(animFrame);
            }, 500)
        })
        audio.addEventListener('pause', () => {
            // console.log('Paused Lister')
            // cancelAnimationFrame(animFrame);
            setTimeout(() => {
                // alert(animFrame)
                cancelAnimationFrame(animFrame);
                setIsHome(true);
            }, 500)
        })
        audioSource = audioCTX.createMediaElementSource(audio);
        analyser = audioCTX.createAnalyser();
        // console.log(analyser)
        audioSource.connect(analyser);
        analyser.connect(audioCTX.destination);
        analyser.fftSize = 2048;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        audioCTX.resume();
        console.log(bufferLength)
        draw();
    }, [audioFile])
    const draw = () => {
        let canvas = canvasRef.current;
        let canvasctx = canvas.getContext('2d')
        canvasctx.clearRect(0, 0, canvas.width, canvas.height);
        // canvasctx.fillRect(x, 10, 100, 100);
        x = 0;
        analyser.getByteFrequencyData(dataArray);
        barWidth = canvas.width / bufferLength;
        for (let i = 0; i < bufferLength; i++) {
            const hue = i * 0.25;
            barHeight = dataArray[i] * 1.5;
            // canvasctx.fillStyle = `red`;
            canvasctx.fillStyle = `hsl(${hue},80%,50%)`;
            canvasctx.shadowBlur = 10;
            canvasctx.shadowColor = `hsl(${hue},80%,50%)`;
            // ctx.fillStyle = `rgb(${red},${green},${blue})`;
            canvasctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += 1;
        }
        // for (let i = 0; i < bufferLength; i++) {
        //     barHeight = dataArray[i] * 2;
        //     canvasctx.save();
        //     canvasctx.translate(canvas.width / 2, canvas.height / 2);
        //     canvasctx.rotate(ToRadian(i) / bufferLength);
        //     const hue = i * 30;
        //     canvasctx.fillStyle = `hsl(${hue},100%,50%)`;
        //     canvasctx.fillRect(0, 0, barWidth, barHeight);
        //     x += barWidth;
        //     canvasctx.restore();
        // }

        animFrame = requestAnimationFrame(draw);
    }
    const ToRadian = (angle) => {
        return (angle * (Math.PI * 4));
    }
    const getSongName = () => {
        let name = audioFile.name;
        let split = name.split('.');
        return split[0];
    }
    const closeSimulation = () => {
        // audio.pause();
        // console.log(audio)
        taudio.pause();
        taudio.currentTime = 0;
        // setTimeout(() => {
        //     // cancelAnimationFrame(animFrame);
        //     // setIsHome(true);
        // }, 200)
    }

    useEffect(() => {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight * 0.7;
    }, [])


    return (
        <div>
            <audio ref={audioRef} ></audio>
            <canvas ref={canvasRef}></canvas>
            <div className='closebuttoncontainer' onClick={closeSimulation}>
                <div className='fas fa-times fa-2x'></div>
            </div>
            <div className='footerbase'>
                <div className='subContainer'>
                    <span>{getSongName()}</span>
                    <div className='circle'>
                        <div className='fas fa-cloud-download-alt'></div>
                    </div>
                </div>
                <div className='infoContainer'>
                    <span>Information</span>
                    <span>Rivera is an OpenSource Application .</span>
                    <span>Feel Free to Contribute.</span>
                </div>
                <footer>
                    <div className='mainfooter'>
                        <span>Github:- JKirito@github.com</span>
                        <div className='circle'>
                            <div className='fab fa-facebook-f'></div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}
export default Home

import React, {useEffect, useRef, useState} from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './index.css';
import {Button} from "react-bootstrap";
import {useStateWithCallbackLazy} from 'use-state-with-callback';

interface GuessesProps {
  data: string[],
}

const FrontPage = (props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLCanvasElement> & React.CanvasHTMLAttributes<HTMLCanvasElement>): JSX.Element => {
    const [calculation, setCalculation] = useState("")
    const [comment, setComment] = useState("")
    const [showCalculator, setShowCalculator] = useState(true)
    const [showVictory, setShowVictory] = useState(false)
    const [showHangman, setShowHangman] = useState(false)
    const [noOfGuesses, setNoOfGuesses] = useState(0)
    const [guesses, setGuesses] = useStateWithCallbackLazy<string[]>([]);
    const [solutionArray, setSolutionArray] = useState<string[]>([]);

    const canvasRef = useRef(null)

    function click(n: string) {
      setComment("")
      if ((calculation.includes("+") || calculation.includes("*") || calculation.includes("-")) && (n === "+" || n === "-" || n === "*")) {
        let temp: string = calculation;
        temp = temp.replaceAll("-", n);
        temp = temp.replaceAll("+", n);
        temp = temp.replaceAll("*", n);
        console.log("temp: ", temp)
        setCalculation(temp);
      } else {
        setCalculation(calculation.concat(n.toString()));
      }
      // console.log("clicked: ", calculation)

    }

    function backspace() {
      let temp: string = calculation;
      temp = temp.slice(0, -1);
      setCalculation(temp);
    }

    function solve(calculation: string) {
      let test = null;
      try {
        if (!isNaN(eval(calculation))) {
          test = eval(calculation);
        }
      }
      catch (err) {
        console.error(err);
        setComment("That is not a valid computation.")
      }

      if (test !== null) {
        if (calculation.includes("+")) {
          let solutionArray: string[] = [];
          test.toString().split("").forEach((n: string) => solutionArray.push(n));
          setSolutionArray(solutionArray);
        }
        if (calculation.includes("-")) {
          let solutionArray: string[] = [];
          test.toString().split("").forEach((n: string) => solutionArray.push(n));
          setSolutionArray(solutionArray);
        }
        if (calculation.includes("*")) {
          let solutionArray: string[] = [];
          test.toString().split("").forEach((n: string) => solutionArray.push(n));
          setSolutionArray(solutionArray);
        }
        setShowCalculator(false);
        setShowHangman(true);
      }
    }


    function gameOver() {
      setShowCalculator(false);
      setShowHangman(false);
      console.log("Game over man, game over")
    }

    function victory() {
      setShowCalculator(false);
      setShowHangman(false);
      setShowVictory(true);

    }

    function refreshPage() {
      window.location.reload();
    }

    function progressHangman(context: any, step: number) {
      if (step === 1) {
        context.strokeStyle = '#444';
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(175, 225);
        context.lineTo(5, 225);
        context.moveTo(40, 225);
        context.lineTo(25, 5);
        context.lineTo(100, 5);
        context.lineTo(100, 25);
        context.stroke();
      }

      if (step === 2) {
        context.lineWidth = 5;
        context.beginPath();
        context.arc(100, 50, 25, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
      }

      if (step === 3) {
        context.beginPath();
        context.moveTo(100, 75);
        context.lineTo(100, 140);
        context.stroke();
      }

      if (step === 4) {

        context.beginPath();
        context.moveTo(100, 85);
        context.lineTo(60, 100);
        context.stroke();
        context.beginPath();
        context.moveTo(100, 85);
        context.lineTo(140, 100);
        context.stroke();
      }

      if (step === 5) {
        context.beginPath();
        context.moveTo(100, 140);
        context.lineTo(80, 190);
        context.stroke();
      }

      if (step === 6) {
        context.beginPath();
        context.moveTo(100, 140);
        context.lineTo(125, 190);
        context.stroke();
      }

      if (step === 7) {
        context.beginPath();
        context.moveTo(122, 190);
        context.lineTo(135, 185);
        context.stroke();
        context.beginPath();
        context.moveTo(82, 190);
        context.lineTo(70, 185);
        context.stroke();
        gameOver();
      }

    }


    useEffect(() => {
      const canvas = canvasRef.current
      // @ts-ignore
      const context = canvas.getContext('2d')
      progressHangman(context, noOfGuesses);
    }, [noOfGuesses])

    function guess(number: string) {
      if (!guesses.includes(number) && !solutionArray.includes(number)) {
        setNoOfGuesses(noOfGuesses + 1);
        setGuesses(state => [...state, number], () => {
          // do nothing
        })
      }

      if (!guesses.includes(number) && solutionArray.includes(number)) {
        setGuesses(state => [...state, number], (currentGuesses) => {
          let win = (answer: string[], solution: string[]) => solution.every(v => answer.includes(v));
          if (win(currentGuesses, solutionArray)) {
            victory();
          }
        })
      }
    }

    function Solution() {
      return eval(calculation);
    }

    function NumberGuesses(props: GuessesProps) {
      return (<div>
          {
            solutionArray.map((value, index) =>
              props.data.includes(value) ?
                <div className="correctGuesses" key={index}>{value}</div>
                :
                <div className="incorrectGuesses" key={index}>&nbsp;</div>
            )
          }
        </div>
      )
    }

    if (showCalculator && !showHangman) {
      return (
        <div className="Frontpage">

          <div className="container">
            <h3>Most annoying calculator ever?</h3>
            <div className="calculator-container">
              <Container fluid>
                <Row>
                  <Col sm={12} className="p-1">
                    <div className="calculation">&nbsp;{calculation}</div>
                  </Col>
                </Row>
                <Row>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("7")}>7</Button></Col>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("8")}>8</Button></Col>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("9")}>9</Button></Col>
                  <Col sm={3} className="p-1"><Button className="operation"
                                                      onClick={() => click("+")}>+</Button></Col>
                </Row>
                <Row>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("4")}>4</Button></Col>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("5")}>5</Button></Col>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("6")}>6</Button></Col>
                  <Col sm={3} className="p-1"><Button className="operation"
                                                      onClick={() => click("-")}>-</Button></Col>
                </Row>
                <Row>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("1")}>1</Button></Col>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("2")}>2</Button></Col>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("3")}>3</Button></Col>
                  <Col sm={3} className="p-1"><Button className="operation"
                                                      onClick={() => click("*")}>*</Button></Col>
                </Row>
                <Row>
                  <Col sm={3} className="p-1"><Button className="number">&nbsp;</Button></Col>
                  <Col sm={3} className="p-1"><Button className="number"
                                                      onClick={() => click("0")}>0</Button></Col>
                  <Col sm={3} className="p-1"><Button className="operation"
                                                      onClick={() => backspace()}>&lt;&lt; </Button></Col>
                  <Col sm={3} className="p-1"><Button className="operation"
                                                      onClick={() => solve(calculation)}>=</Button></Col>
                </Row>
              </Container>
            </div>
            <canvas hidden ref={canvasRef} {...props}/>
            <h2>{comment}</h2>
          </div>
        </div>
      );
    }
    else if (!showCalculator && showHangman) {
      return (
        <div className="Frontpage">
          <div className="container">
            <h3>Most annoying calculator ever!</h3>
            <div className="canvas-container">
              <canvas ref={canvasRef} {...props} width="180" height="250"/>
            </div>
            <div className="numberGuesses">
              <NumberGuesses data={guesses}/>
            </div>
            <div className="possibleGuesses">
              {
                [...Array(10)].map((x, i) =>
                  <div className="numberGuess" key={i} onClick={() => guess(i.toString())}>{i}</div>
                )
              }
            </div>
          </div>
        </div>
      )
    }
    else if (!showCalculator && !showHangman && showVictory) {
      return (
        <div className="h-auto d-flex align-items-center justify-content-center">
          <Container>
            <Row>
              <Col>
                <h1>Victory!</h1>
                <div>Correct answer: <Solution/></div>
              </Col>
            </Row>
            <Row>
              <Col><h1><Button onClick={refreshPage}>Click to reload!</Button></h1></Col>
            </Row>
          </Container>
        </div>
      )
    }
    else {
      return (
        <div className="h-auto d-flex align-items-center justify-content-center">
          <Container>
          <Row>
            <Col><h1>Game over! YOU LOSE!</h1></Col>
          </Row>
          <Row>
            <Col><h1><Button onClick={refreshPage}>Click to reload!</Button></h1></Col>
          </Row>
        </Container>
      </div>
      )
    }
  }
;

export default FrontPage;

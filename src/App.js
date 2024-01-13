import './App.css';
import Grid from './Components/Grid'
import Keyboard from './Components/Keyboard'
import { boardDefault,generateWordSet } from './Words'
import { createContext,useState,useEffect } from 'react';
import GameOver from './Components/GameOver';

export const AppContext=createContext();

function App() {
  const[grid,setGrid]=useState(boardDefault)
  const[currAttempt,setCurrAttempt]=useState({attempt:0,letterPos:0})
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  //const [correctWord,setCorrectWord]=useState("")
  const [gameOver,setGameOver]=useState({gameOver:false,guessedWord:false})

  const correctWord="RIGHT"

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      //setCorrectWord(words.todaysWord);
    });
  }, []);

  const onSelectLetter=(keyVal)=>{
    if(currAttempt.letterPos>4) return;
    const newGrid=[...grid]
    newGrid[currAttempt.attempt][currAttempt.letterPos]=keyVal
    setGrid(newGrid)
    setCurrAttempt({attempt:currAttempt.attempt,letterPos:currAttempt.letterPos+1})
  }

  const onDelete=(keyVal)=>{
    if(currAttempt.letterPos===0) return;
    const newGrid=[...grid];
    newGrid[currAttempt.attempt][currAttempt.letterPos-1]=""
    setGrid(newGrid);
    setCurrAttempt({...currAttempt,letterPos:currAttempt.letterPos-1})
  }

  const onEnter=(keyVal)=>{
    if(currAttempt.letterPos!==5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += grid[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    } else {
      alert("Word not found");
    }

    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }
    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
      return;
    }
    
    // setCurrAttempt({attempt:currAttempt.attempt+1,letterPos:0})
  };
  return (
    <div className='App'>
      <nav>
        Wordle
      </nav>
      <AppContext.Provider value={{grid,setGrid,currAttempt,setCurrAttempt,onSelectLetter,onDelete,onEnter,correctWord,setDisabledLetters,disabledLetters,gameOver,setGameOver}}>
        <div className='game'>
          <Grid />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
      </AppContext.Provider>
      
    </div>
  );
}

export default App;

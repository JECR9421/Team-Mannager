'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
// eslint-disable-next-line
const MOVE = function (arr: Array<any>,from: number, to: number) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
};

const SORT_PLAYERS_BY_ID = (player1: any, player2: any)=> (player1.id < player2.id) ? -1 : (player1.id > player2.id) ? 1 : 0;

export default function Home() {
  const [team, setTeam] = useState([] as any);
  const [out, setOut] = useState([] as any);
  const [outSave, setOutSave] = useState([] as any);
  const [pointer, setPointer] = useState(-1);
  const [allowChange, setAllowChange] = useState(true);

  const addOutPlayer = (playerOut: any) => { 
    const players = [...out];
    const exists = players.findIndex((player:any) => player.id === playerOut.id);
    if(exists === -1 ){
      players.push(playerOut);
    } else {
      players.splice(exists, 1);
    }
    setOut(players.sort(SORT_PLAYERS_BY_ID));
  };

  const handlerOnePlayerChange = () => {
    let newOrder = [];
    const outIndex = team.findIndex((player:any) => player.id === out[0].id);
     newOrder = MOVE([...team], outIndex, pointer -1);
     //newOrder = MOVE([...newOrder], pointer, outIndex);
     return newOrder;
  };
  
  const playersGoing = (player:any) => !out.find((outPlayer: any) => outPlayer.id === player.id);
  const handlerMultiplePlayerChange = () => {
    let newOrder = team.filter((player:any) => playersGoing(player));
    let insertIndex =  ((pointer) - out.length) > -1 ? pointer - out.length : 0;
    out.forEach((player:any)=> {
      newOrder.splice(insertIndex, 0, player);
      insertIndex++;
    });
     const lastOutInserted = newOrder.findIndex((player:any) => player.id === out[out.length - 1].id);
     setPointer(lastOutInserted + 1);
     return newOrder;
  };

  const replace = () => {
    if (out.length === 0) {
      alert('Debe seleccionar al menos 1 jugador');
      return;
    }
    if(out.length === 1) {
      setTeam(handlerOnePlayerChange());
    }else {
      setTeam(handlerMultiplePlayerChange());
      //setPointer(pointer + (out.length - pointer));
      setOutSave([...out])
    }
    setOut([]);
    setAllowChange(false);
  };
  useEffect(() => {
    fetch('/api/team/get')
      .then((res) => res.json())
      .then((data) => {
        const {team, pointer} = data;
        setTeam(team);
        setPointer(pointer);
      })
  }, [])

  const save = async () => {
    const teamToSave = team.map((player: any, index: number) => ({...player , id: index + 1}));
    const playLoad = {team: teamToSave, pointer, playersOut: out};
    await fetch('/api/team/save', {method: "PUT",  headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },body: JSON.stringify(playLoad)});
    location.reload();
  }
  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className='col-span-1'>
          <ul>
              {team.map((player:any, index:number) => {
                return (
                  <li key={player.id}>
                    {((index !== pointer - 1  && !outSave.find((outPlayer:any) => outPlayer.id === player.id)) && allowChange) &&
                      <input type='checkbox' onChange={()=>{addOutPlayer(player)}} /> 
                    }
                    {player.name}
                  </li>
                );
              })}
          </ul>
        </div>
  
        <div className=''>
            <button onClick={replace} 
            style={{
              backgroundColor: allowChange ? '#00FA9A' : '#A9A9A9', 
              cursor: allowChange ? 'pointer' : 'not-allowed',
              color:  allowChange ? 'black' : '#fdfdfd6e'
            }}
            disabled={!allowChange}
            >Cambiar jugadores ➜
            </button>
        </div>
        <div>
          {/* eslint-disable */}
          <h2>Rota: {team[pointer -1]?.name}</h2>

          <h2>Fuera:</h2>
          <ul>
              {outSave.map((player:any, index:number) => {
                return (
                  <li key={player.id}>
                    {`${index + 1}.${player.name}`}
                  </li>
                );
              })}
          </ul>
        </div>
        
      </div>
      <div className="grid grid-cols-2" style={{marginTop: '5%'}}>
          <div>
          <button 
              disabled={allowChange}
              onClick={save} 
              style={{
                backgroundColor: !allowChange ? '#00FA9A' : '#A9A9A9', 
                cursor: !allowChange ? 'pointer' : 'not-allowed', 
                color: !allowChange ? 'black' : '#fdfdfd6e'}}
              >Guardar
            </button>
          </div>
          <div>
            <button onClick={()=>{location.reload()}} 
              style={{backgroundColor: 'white'}}
              >Reinicar
            </button>
          </div>
      </div>
    </main>
  )
}

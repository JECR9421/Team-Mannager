'use client'
import Image from 'next/image'
import { useState, useEffect } from 'react'
// eslint-disable-next-line
const MOVE = function (arr: Array<any>,from: number, to: number) {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
};
export default function Home() {
  const [team, setTeam] = useState([] as any);
  const [out, setOut] = useState([] as any);
  const [pointer, setPointer] = useState(-1);

  const addOutPlayer = (playerOut: any) => { 
    const players = [...out];
    const exists = players.findIndex((player:any) => player.id === playerOut.id);
    if(exists === -1 ){
      players.push(playerOut);
    } else {
      players.splice(exists, 1);
    }
    setOut(players);
  };

  const handlerOnePlayerChange = () => {
    let newOrder = [];
    const outIndex = team.findIndex((player:any) => player.id === out[0].id);
     newOrder = MOVE([...team], outIndex, pointer -1);
     newOrder = MOVE([...newOrder], pointer, outIndex);
     return newOrder;
  };
  
  const playersGoing = (player:any) => !out.find((outPlayer: any) => outPlayer.id === player.id);
  const handlerMultiplePlayerChange = () => {
    let newOrder = team.filter((player:any) => playersGoing(player));
    console.log('new order', newOrder);
    // out.forEach((player:any)=> {
    //   const index = newOrder.findIndex((elem) => elem.id === player.id);
    //   newOrder.splice(index, 1);
    // });
     return newOrder;
  };

  const replace = () => {
    if(out.length === 1) {
      setTeam(handlerOnePlayerChange());
    }else {
      setTeam(handlerMultiplePlayerChange());
    }
    setOut([]);
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
  return (
    <main className="flex min-h-screen flex-col p-24">
      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className='col-span-1'>
          <ul>
              {team.map((player:any, index:number) => {
                return (
                  <li key={player.id}>
                    {index !== pointer - 1 &&
                      <input type='checkbox' onClick={()=>{addOutPlayer(player)}} /> 
                    }
                    {player.name}
                  </li>
                );
              })}
          </ul>
        </div>
  
        <div className=''>
            <button onClick={()=>{
              const out = [team[1]];
              replace(out);
            }} 
            style={{backgroundColor: 'white'}}
            >Cambiar jugadores ➜
            </button>
        </div>
        <div>
          {/* eslint-disable */}
          <h2>Rota: {team[pointer -1]?.name}</h2>

          <p>Fuera:</p>
        </div>
      </div>
    </main>
  )
}

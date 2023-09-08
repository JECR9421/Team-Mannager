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
  const [pointer, setPointer] = useState(-1);

  const replace = (out: Array<any>) => {
    let newOrder = [];
    if(out.length === 1) {
     const outIndex = team.findIndex((player:any) => player.id === out[0].id);
     console.log(team, outIndex, pointer - 1); 
     newOrder = MOVE([...team], outIndex, pointer -1);
    }
    setTeam(newOrder);
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
              {team.map((player:any) => {
                return (
                  <li key={player.id}><input type='checkbox' /> {player.name}</li>
                );
              })}
          </ul>
        </div>
  
        <div className=''><button onClick={()=>{
          const out = [team[1]];
          replace(out);
        }}>--</button></div>
        <div>
          {/* eslint-disable */}
          <h2>Rota: {team[pointer -1]?.name}</h2>

          <p>Fuera:</p>
        </div>
      </div>
    </main>
  )
}

Array.prototype.move = function (from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  };

const array = [
    {id: 1, name: "Jesus"},
    {id: 2, name: "Enrique"},
    {id: 3, name: "Ademar"},
    {id: 4, name: "David"},
    {id: 5, name: "Bernal"},
    ];
    
    const puntero = 4;
    array.move(0, puntero - 1);
    console.log(array);

    const array2 = [
        {id: 1, name: "Jesus"},
        {id: 2, name: "Enrique"},
        {id: 3, name: "Ademar"},
        {id: 4, name: "David"},
        {id: 5, name: "Bernal"},
        {id: 6, name: "Checo"},
    ];

  const puntero2 = 4;
  const out = [0, 2]; // no van jesus y ademar
  let newArray = [ ...array2];
  const playersOut = [];
  out.forEach((playerOut) =>{
    const player = { ...array2[playerOut]};
    playersOut.push(player);
 });
 console.log('players out', playersOut);
 playersOut.forEach((player)=> {
   const index = array2.findIndex((elem) => elem.id === player.id);
   array2.splice(index, 1);
 });
  let insertIndex =  (puntero2) - playersOut.length;
  playersOut.forEach((player)=> {
    array2.splice(insertIndex, 0, player);
  });
  console.log(array2);
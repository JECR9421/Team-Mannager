import Image from 'next/image'
import { MongoClient } from 'mongodb'
import moment from 'moment'

// Connection URL
const url = 'mongodb://146.190.199.54:5012';
const dbName = 'team-mercedes';
async function getData() {
  //const res = await fetch('https://api.publicapis.org/entries')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('team-list');
  const findResult = await collection.find({}).toArray();
  const now = moment();
  const nextCut = now.clone().weekday(7).add(1, 'day').format();
  return {team: findResult, nextCut};
}
export default async function Home() {
  const data = await getData()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p>Next: {data.nextCut}</p>
       <ul>
        {data.team.map((player) => {
          return (
            <li key={player.id}>{player.name}</li>
          );
        })}
       </ul>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
    </main>
  )
}

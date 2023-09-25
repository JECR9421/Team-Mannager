import type { NextApiRequest, NextApiResponse } from 'next'
import { Db, MongoClient } from 'mongodb'
import moment from 'moment'

// Connection URL
const url = 'mongodb://root:Data%40adm21@209.126.7.137:5012';
const dbName = 'team-mercedes';
 
type ResponseData = {
  team: Array<Object>
  nextCut: string
  pointer: number
}

const handleNext = async (nextCutDate: moment.Moment, teamLength:number, curPointer:number, client: MongoClient,db : Db) => {
 const pointer = (curPointer + 1) <= teamLength ? curPointer + 1 : 1;
 const pointerCollection = db.collection('rotation');
 await pointerCollection.insertOne({pointer,nextCut: nextCutDate.format('YYYY-MM-DD')});
 return pointer;
};
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const teamCollection = db.collection('team-list');
  const pointerCollection = db.collection('rotation');
  const findResult = await teamCollection.find({}).toArray();
  const rotation = await pointerCollection.find({}).sort({_id:-1}).limit(1).toArray();
  const { pointer: curPointer, nextCut : lastCutStr } = rotation[0];
  const now = moment();
  const nextCut = now.clone().weekday(7).add(1, 'day');
  const lastCut = moment(lastCutStr, 'YYYY-MM-DD');
  let pointer = curPointer;
  if (moment(nextCut).isAfter(lastCut, 'day')) {
   pointer = await handleNext(nextCut, findResult.length, curPointer, client, db);
  }
  client.close();
  res.status(200).json({team: findResult, nextCut: nextCut.format(), pointer})
}
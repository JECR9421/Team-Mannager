import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import moment from 'moment'

// Connection URL
const url = 'mongodb://209.126.7.137:5012';
const dbName = 'team-mercedes';
 
type ResponseData = {
  team: Array<Object>
  nextCut: string
  pointer: number
}
 
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
  const now = moment();
  const nextCut = now.clone().weekday(7).add(1, 'day').format();
  const { pointer } = rotation[0];
  res.status(200).json({team: findResult, nextCut, pointer})
}
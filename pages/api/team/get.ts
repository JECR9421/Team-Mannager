import type { NextApiRequest, NextApiResponse } from 'next'
import { MongoClient } from 'mongodb'
import moment from 'moment'

// Connection URL
const url = 'mongodb://146.190.199.54:5012';
const dbName = 'team-mercedes';
 
type ResponseData = {
  team: Array<Object>
  nextCut: string
}
 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const players = [{id: 1, name: "Jesus"}]
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection('team-list');
  const findResult = await collection.find({}).toArray();
  const now = moment();
  const nextCut = now.clone().weekday(7).add(1, 'day').format();
  //return {team: findResult, nextCut};
  res.status(200).json({team: findResult, nextCut})
}
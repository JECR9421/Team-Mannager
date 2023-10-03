import type { NextApiRequest, NextApiResponse } from 'next';
import { Db, MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://root:Data%40adm21@209.126.7.137:5012';
const dbName = 'team-mercedes';
type ResponseData = {
    success: boolean,
    error?: any
  }
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ResponseData>
  ) {
    const client = new MongoClient(url);
    await client.connect();
    try {
        if (req.method === 'PUT') {
            const { team, pointer, playersOut } = req.body;
            const db = client.db(dbName);
            const teamCollection = db.collection('team-list');
            const pointerCollection = db.collection('rotation');
            const rotation = await pointerCollection.find({}).sort({_id:-1}).limit(1).toArray();
            teamCollection.deleteMany({});
            teamCollection.insertMany(team);
            const { _id } = rotation[0];
            const modify = {$set:{pointer, playersOut}};
            await pointerCollection.updateOne({_id}, modify);
            res.status(200).json({success: true});
       }
    } catch (error:any) {
        res.status(500).json({success: false, error});
    } finally {
      client.close();
    }
  }
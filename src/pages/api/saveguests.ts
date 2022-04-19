import type { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb';
import { fauna } from '../../services/fauna';
import guests from '../../utils/guests.json'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  try {
    for (let i = 0; i < guests.length; i++) {
      const guest = await fauna.query(
        q.Create(
          q.Collection('guests'),
          { data:  guests[i] }
        )
      )
    }
    return res.status(200).json(true)
  } catch (error) {
    res.status(400).json(error)
  }
}

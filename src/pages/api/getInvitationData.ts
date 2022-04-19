import type { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb';
import { fauna } from '../../services/fauna';

type Guest = {
  type: string;
  code: number;
  data: {
    ref: {
      id: string
    };
    id: string;
    ts: string;
    data: {
      invitation_code: string;
      confirmed_invitation: boolean;
      guests: {
        nome: string;
        confirmed: boolean;
      }[]
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { confirmationCode } = req.body;
  console.log('confirmationCode: ', confirmationCode)
  if (!confirmationCode) {
    return res.status(400).json({ error: 'Invalid request.' })
  }
  try {
    const guest = await fauna.query<Guest>(
      q.Let(
        {
          ref: q.Match(q.Index('guest_by_invitation_code'), confirmationCode),
        },
        q.If(
          q.Exists(q.Var('ref')),
          {
            type: 'found',
            data: q.Get(q.Var('ref')),
            code: 200
          },
          {
            type: 'notFound',
            message: 'Convidado não encontrado.',
            code: 200
          }
        )
      )
    )
    console.log('guest: ', guest)
    if (guest.data) {
      guest.data.id = guest.data.ref.id;
    }
    return res.status(guest.code).json(guest)
  } catch (error) {
    res.status(400).json(error)
  }
}

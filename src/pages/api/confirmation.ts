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
    ts: string;
    data: {
      invitation_code: string;
      confirmed: boolean;
      qtdGuests: number;
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { confirmationCode } = req.body;
  if (!confirmationCode) {
    return res.status(400).json({ error: 'Informe o código de confirmação.' })
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
    if (guest.data) {
      if (guest.data.data.confirmed === true) {
        return res.status(200).json({
            type: 'alreadyConfirmed',
            invitation_code: guest.data.data.invitation_code,
            confirmed: guest.data.data.confirmed,
            qtdGuests: guest.data.data.qtdGuests,
        })
      }
      await fauna.query(
        q.Update(
            q.Ref(q.Collection('guests'), guest.data.ref.id),
            {
                data: {
                  confirmed: true,
                }
            }
        )
      )
      return res.status(guest.code).json({
        type: guest.type,
        invitation_code: guest.data.data.invitation_code,
        confirmed: guest.data.data.confirmed,
        qtdGuests: guest.data.data.qtdGuests,
      })
    }
    return res.status(guest.code).json(guest)
  } catch (error) {
    res.status(400).json(error)
  }
}

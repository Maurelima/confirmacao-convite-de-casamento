import type { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb';
import { fauna } from '../../services/fauna';

interface NextApiRequestGuest extends NextApiRequest {
  body: {
    confirmationCode: string;
    invitationData: {
      ref: {
        id: string
      };
      ts: string;
      id: string;
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
}

export default async function handler(
  req: NextApiRequestGuest,
  res: NextApiResponse
) {
  const { confirmationCode, invitationData } = req.body;

  if (!confirmationCode || invitationData === undefined) {
    return res.status(400).json({ error: 'Invalid request.' })
  }
  try {
    if (invitationData.data.confirmed_invitation) {
      return res.status(200).json({
        type: 'alreadyConfirmed',
        invitation_code: invitationData.data.invitation_code,
        confirmed_invitation: invitationData.data.confirmed_invitation,
        guests: invitationData.data.guests,
      })
    }
    invitationData.data.confirmed_invitation = true;
    await fauna.query(
      q.Update(
        q.Ref(q.Collection('guests'), invitationData.id),
        {
          data: invitationData.data
        }
      )
    )
    return res.status(200).json({
      type: 'confirmed',
      invitation_code: invitationData.data.invitation_code,
      confirmed_invitation: invitationData.data.confirmed_invitation,
      guests: invitationData.data.guests,
    })
  } catch (error) {
    res.status(400).json(error)
  }
}

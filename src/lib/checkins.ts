import { supabase } from './supabase'

export async function reportOccupancy(
  spaceId: string,
  userId: string,
  occLevel: 'empty' | 'moderate' | 'busy'
): Promise<{ error: string | null }> {
  await supabase
    .from('check_ins')
    .update({ status: 'expired' })
    .eq('user_id', userId)
    .eq('status', 'active')

  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('check_ins')
    .insert({
      user_id: userId,
      space_id: spaceId,
      expires_at: expiresAt,
      status: 'active',
      occ_level: occLevel,
    })

  return { error: error?.message ?? null }
}

export async function checkInPresence(
  spaceId: string,
  userId: string
): Promise<{ error: string | null }> {
  await supabase
    .from('check_ins')
    .update({ status: 'expired' })
    .eq('user_id', userId)
    .eq('status', 'active')

  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('check_ins')
    .insert({
      user_id: userId,
      space_id: spaceId,
      expires_at: expiresAt,
      status: 'active',
      occ_level: null,
    })

  return { error: error?.message ?? null }
}

export async function manualCheckOut(
  userId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('check_ins')
    .update({ status: 'expired' })
    .eq('user_id', userId)
    .eq('status', 'active')

  return { error: error?.message ?? null }
}

export async function flagWrongData(
  spaceId: string,
  userId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('reports')
    .insert({
      reporter_id: userId,
      space_id: spaceId,
      issue_type: 'wrong_occupancy',
      status: 'open',
    })

  return { error: error?.message ?? null }
}

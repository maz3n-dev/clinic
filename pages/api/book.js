import { supabaseServer } from '../../lib/supabaseServer';

export default async function handler(req, res){
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { doctor_id, client_name, client_phone, date, time_slot, notes } = req.body;
  if (!client_name || !client_phone || !date || !time_slot) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabaseServer
      .from('reservations')
      .insert([{ doctor_id, client_name, client_phone, date, time_slot, notes }])
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json({ reservation: data });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Insertion failed' });
  }
}
